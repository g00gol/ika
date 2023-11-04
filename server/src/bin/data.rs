mod country_continent;
use polars::prelude::*;

fn main() -> () {
    // read data file and convert to lazyframe
    let lf: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/per_capita.csv").finish().unwrap();

    let lf_countries_to_continents: LazyFrame = LazyCsvReader::new("./data/countries-continents.csv").finish().unwrap();

    let res = country_continent::country_to_continent(lf_countries_to_continents, "Uganda".to_string());
    println!("{}", res);

    let row1 = lf.first().collect().unwrap();
    println!("{}", row1);
}
