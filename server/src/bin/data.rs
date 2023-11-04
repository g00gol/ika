mod country_continent;
use polars::prelude::*;

fn main() -> () {
    // read data file and convert to lazyframe
    let lf_countries_to_continents: LazyFrame = LazyCsvReader::new("./data/countries-continents.csv").finish().unwrap();
    println!("{}", lf_countries_to_continents.clone().collect().unwrap());

    let res: String = country_continent::country_to_continent(lf_countries_to_continents, "Uganda".to_string());
    println!("{}", res);

    let lf_country_pop: LazyFrame = LazyCsvReader::new("./data/Country_Population_Data.csv").finish().unwrap();

    // let lf_gen_region: LazyFrame = LazyCsvReader::new("./data/plastic_waste_generation/total.csv").finish().unwrap();
    let lf_gen_country_capita: LazyFrame = LazyCsvReader::new("./data/plastic_waste_generation/per_capita.csv").finish().unwrap();

    // let lf_mis_region: LazyFrame = LazyCsvReader::new("./data/mismanaged_waste/total.csv").finish().unwrap();
    let lf_mis_country: LazyFrame = LazyCsvReader::new("./data/mismanaged_waste/per_capita.csv").finish().unwrap();

    // let lf_prob_country: LazyFrame = LazyCsvReader::new("./data/probability_of_ocean_pollution/total.csv").finish().unwrap();

    let lf_emit_capita: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/per_capita.csv").finish().unwrap();
    // let lf_emit_total: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/total.csv").finish().unwrap();
    
    let lf_2010_country: LazyFrame = lf_gen_country_capita
                                    .join_builder()
                                        .with(lf_country_pop)
                                        .how(JoinType::Inner)
                                        .left_on(&[col("Entity")])
                                        .right_on(&[col("Country Name")])
                                        .finish()
                                    .select(&[col("Entity"),
                                              col("Code"),
                                              col("Year"),
                                              col("Per capita plastic waste (kg/person/day)").alias("Total Waste Generated") * col("2010")]);
    
    let lf_2019_country: LazyFrame = lf_mis_country
                                     .join_builder()
                                         .with(lf_emit_capita)
                                         .on(&[col("Entity"),
                                               col("Year")])
                                         .finish()
                                     .select(&[col("Entity"),
                                               col("Code"),
                                               col("Year"),
                                               col("Mismanaged plastic waste per capita (kg per year)").alias("Mismanaged per capita"),
                                               col("Mismanaged plastic waste to ocean per capita (kg per year)").alias("Emit per capita")]);

//    let gen_country: DataFrame = lf_gen_country.collect().unwrap();
//    println!("{}", gen_country);

    let lf1: DataFrame = lf_2019_country.collect().unwrap();
    println!("{}", lf1);
}
