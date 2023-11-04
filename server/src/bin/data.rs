use polars::prelude::*;

fn main() -> () {
    // read data file and convert to lazyframe
    let lf: LazyFrame = LazyCsvReader::new("../../plastic_emitted_to_ocean/per_capita.csv").finish().unwrap();
    
    let row1 = lf.head(1).collect().unwrap();
    println!(row1);
}
