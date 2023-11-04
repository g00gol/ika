use polars::prelude::*;

pub fn country_to_continent(lf: LazyFrame, country: String) -> String {
    lf.filter(polars::prelude::col("Country").eq(country.as_str())) 
        .first()
        .select(&[polars::prelude::col("Continent")])
        .collect()
        .unwrap()
        .to_string()
}
