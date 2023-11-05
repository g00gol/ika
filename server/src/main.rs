mod init;

use std::sync::Mutex;
use actix_web::{web, HttpServer, HttpResponse, App, Responder};
use polars::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct PostBody {
    year: u64
}

async fn post(body: web::Json<PostBody>, df: web::Data<Mutex<DataFrame>>) -> impl Responder {

    let expressions: Vec<Expr> = (2020..(body.year+1))
        .map(|y| col(format!("{} Total Emitted", y-1).as_str())
                      .alias(format!("{} Total Emitted", y).as_str())
                      +col("Change Per Year")*lit(y-2019)
                      ).collect();


    println!("{:?}", expressions);

    // We put the hack in hackathon
    let lf_years_emitted: LazyFrame = df.lock().unwrap().clone().lazy()
                                        .select(&[
                                           col("Entity"),
                                           col("Continent"),
                                           col("2019 Total Emitted"),
                                           col("Change Per Year")
                                        ])
                                        .with_columns(
                                            expressions
                                            )
                                        ;

    println!("{}", lf_years_emitted.clone().collect().unwrap());

    HttpResponse::Ok().body({})
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 3001;

    let df = init::init_dataframe();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(Mutex::new(df.clone()))) 
            .service(web::resource("/data").route(web::post().to(post)))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
