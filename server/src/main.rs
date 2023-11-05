mod init;

use std::sync::Mutex;
use actix_web::{web, Error, http, post, HttpResponse, Result, HttpServer, App};
use polars::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json;
use actix_cors::Cors;

#[derive(Debug, Serialize, Deserialize)]
struct PostBody {
    year: u64
}

#[post("/data")]
async fn post_route(body: web::Json<PostBody>, df: web::Data<Mutex<DataFrame>>) -> Result<HttpResponse, Error> {

    // Append columns from 2020 until the input year
    let expressions: Vec<Expr> = (2020..(body.year+1))

        // Prevent future Total Emitted being less than 0 
        .map(|y| when((col("2019")+col("Change Per Year")*lit(y-2019)).lt(0))

             .then(lit(0).alias(format!("{}", y).as_str()))
             .otherwise(
                 col("2019")
                          .alias(format!("{}", y).as_str())
                          +col("Change Per Year")*lit(y-2019)
             )).collect();

    // We put the hack in hackathon
    let lf_years_emitted: LazyFrame = df.lock().unwrap().clone().lazy()
                                        .select(&[
                                           col("Entity"),
                                           col("Continent"),
                                           col("2019 Total Emitted").alias("2019"),
                                           col("Change Per Year"),
                                           col("Code")
                                        ])
                                        .with_columns(
                                            expressions
                                            );

    Ok(HttpResponse::Ok()
       // We put the hack in hackathon
        .append_header(("Access-Control-Allow-Headers", "*"))
        .append_header(("Access-Control-Allow-Origin", "*"))
        .append_header(("Access-Control-Allow-Methods", "*"))
       .json(serde_json::to_value(lf_years_emitted.collect().unwrap())?))

}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 3001;

    let df = init::init_dataframe();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3001")
            .allowed_origin("http://localhost:5173")
            .allowed_origin_fn(|origin, _req_head| {
                origin.as_bytes().ends_with(b".rust-lang.org")
             })
              .allowed_methods(vec!["GET", "POST", "OPTION"])
              .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
              .allowed_header(http::header::CONTENT_TYPE)
              .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(Mutex::new(df.clone()))) 
            .service(post_route)
            //.service(web::resource("/data").route(web::post().to(post)))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
