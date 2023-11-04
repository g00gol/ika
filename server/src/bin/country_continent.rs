use polars::prelude::*;

pub fn country_to_continent(lf: LazyFrame, country: String) -> String {
    lf.filter(
        col("Country").eq(lit(country.as_str()))
    )
    .select(&[col("Continent")])
    .collect()
    .unwrap()
    .to_string()
}
