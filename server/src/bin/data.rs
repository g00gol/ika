mod country_continent;
use polars::prelude::*;

fn main() -> () {
    // read data file and convert to lazyframe
    let lf_countries_continents: LazyFrame = LazyCsvReader::new("./data/countries-continents.csv").finish().unwrap();

    let lf_country_pop: LazyFrame = LazyCsvReader::new("./data/Country_Population_Data.csv").finish().unwrap();

    // let lf_gen_region: LazyFrame = LazyCsvReader::new("./data/plastic_waste_generation/total_region.csv").finish().unwrap();
    let lf_gen_country: LazyFrame = LazyCsvReader::new("./data/plastic_waste_generation/total_country.csv").finish().unwrap();

    let lf_mis_region: LazyFrame = LazyCsvReader::new("./data/mismanaged_waste/total.csv").finish().unwrap();
    let lf_mis_country: LazyFrame = LazyCsvReader::new("./data/mismanaged_waste/per_capita.csv").finish().unwrap();

    let lf_prob_country: LazyFrame = LazyCsvReader::new("./data/probability_of_ocean_pollution/total.csv").finish().unwrap();

    let lf_emit_capita: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/per_capita.csv").finish().unwrap();
    // let lf_emit_total: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/total.csv").finish().unwrap();
    

    // let 

    let lf_2010_country: LazyFrame = lf_gen_country.left_join(lf_countries_continents,
                                                              col("Entity"),
                                                              col("Country"))
                                                 // We probably lost some countries here because of the join
                                                   .select(&[col("Entity"),
                                                             col("Code"),
                                                             col("Continent"),
                                                             col("Plastic waste generation (tonnes, total)").alias("2010 Total Waste Generated") * lit(1000)]);
    
    let lf_2019_country: LazyFrame = lf_mis_country
                                     .join_builder()
                                         .with(lf_emit_capita)
                                         .how(JoinType::Inner)
                                         .on(&[col("Entity"),
                                               col("Year")])
                                         .finish()
                                     .select(&[col("Entity"),
                                               col("Code"),
                                               col("Mismanaged plastic waste per capita (kg per year)").alias("Mismanaged per capita"),
                                               col("Mismanaged plastic waste to ocean per capita (kg per year)").alias("Emit per capita")])
                                     .join_builder()
                                         .with(lf_country_pop)
                                         .how(JoinType::Inner)
                                         .left_on(&[col("Entity")])
                                         .right_on(&[col("Country Name")])
                                         .finish()
                                     .inner_join(lf_prob_country,
                                                 col("Entity"),
                                                 col("Entity"))
                                     .select(&[col("Entity"),
                                               col("Code"),
                                               col("Mismanaged per capita").alias("2019 Total Mismanaged") * col("2019"),
                                               col("Emit per capita").alias("2019 Total Emitted") * col("2019"),
                                               col("Probability of plastic being emitted to ocean").alias("2019 Prob Emitted")]);

    let lf_country: LazyFrame = lf_2010_country.outer_join(lf_2019_country,
                                                           col("Entity"),
                                                           col("Entity"))
                                               .select(&[col("Entity"),
                                                         col("Code"),
                                                         col("Continent"),
                                                         col("2010 Total Waste Generated"),
                                                         col("2019 Total Mismanaged"),
                                                         col("2019 Total Emitted"),
                                                         col("2019 Prob Emitted")]);

    let lf1: DataFrame = lf_country.collect().unwrap();
    println!("{}", lf1);
}
