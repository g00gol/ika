use actix_web::{post, HttpServer, HttpResponse, App, Responder};

#[post("/data")]
async fn post_data() -> impl Responder {
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
