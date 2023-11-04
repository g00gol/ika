use actix_web::{post, HttpServer, HttpResponse, App, Responder};
use polars::prelude::*;

#[post("/data")]
async fn post_data() -> impl Responder {
    // read data file and convert to lazyframe
    let lf: LazyFrame = LazyCsvReader::new("data/plastic_waste_generation/per_capita.csv").finish().unwrap();

    HttpResponse::Ok().body({})
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 3001;

    HttpServer::new(|| {
        App::new()
            .service(post_data)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
