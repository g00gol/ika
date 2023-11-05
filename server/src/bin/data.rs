use polars::prelude::*;

fn init_dataframe() -> DataFrame {
    // read data file and convert to lazyframe
    let lf_countries_continents: LazyFrame = LazyCsvReader::new("./data/countries-continents.csv").finish().unwrap();

    let lf_country_pop: LazyFrame = LazyCsvReader::new("./data/Country_Population_Data.csv").finish().unwrap();

    // let lf_gen_region: LazyFrame = LazyCsvReader::new("./data/plastic_waste_generation/total_region.csv").finish().unwrap();
    let lf_gen_country: LazyFrame = LazyCsvReader::new("./data/plastic_waste_generation/total_country.csv").finish().unwrap();

    let lf_mis_region: LazyFrame = LazyCsvReader::new("./data/mismanaged_waste/total.csv").finish()
                                                                                          .unwrap()
                                                                                          .filter(col("Year").eq(lit(2010))
                                                                                              .or(col("Year").eq(lit(2019))));
    let lf_mis_country: LazyFrame = LazyCsvReader::new("./data/mismanaged_waste/per_capita.csv").finish().unwrap();

    let lf_prob_country: LazyFrame = LazyCsvReader::new("./data/probability_of_ocean_pollution/total.csv").finish().unwrap();

    let lf_emit_capita: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/per_capita.csv").finish().unwrap();
    // let lf_emit_total: LazyFrame = LazyCsvReader::new("./data/plastic_emitted_to_ocean/total.csv").finish().unwrap();
    

    let lf_2010_country: LazyFrame = lf_gen_country
                                     .left_join(lf_countries_continents.clone(),
                                                 col("Entity"),
                                                 col("Country"))
                                    // We probably lost some countries here because of the join
                                      .select(&[col("Entity"),
                                                col("Code"),
                                                col("Continent"),
                                                col("Plastic waste generation (tonnes, total)").alias("2010 Total Waste Generated") * lit(1000)]);
    
    let lf_2019_country: LazyFrame = lf_mis_country
                                     .left_join(lf_countries_continents,
                                                 col("Entity"),
                                                 col("Country"))
                                     .join_builder()
                                         .with(lf_emit_capita)
                                         .how(JoinType::Inner)
                                         .on(&[col("Entity"),
                                               col("Year")])
                                         .finish()
                                     .select(&[col("Entity"),
                                               col("Code"),
                                               col("Continent"),
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
                                               col("Continent"),
                                               col("Mismanaged per capita").alias("2019 Total Mismanaged") * col("2019"),
                                               col("Emit per capita").alias("2019 Total Emitted") * col("2019"),
                                               col("Probability of plastic being emitted to ocean").alias("2019 Prob Emitted")])
                                     .inner_join(lf_mis_region.clone(),
                                                 col("Continent"),
                                                 col("Entity"))
                                     .filter(col("Year").eq(lit(2019)))
                                     .select(&[col("Entity"),
                                               col("Code"),
                                               col("Continent"),
                                               col("2019 Total Mismanaged"),
                                               col("2019 Total Mismanaged").alias("2019 % of Region Mismanaged") / col("Mismanaged") / lit(10),
                                               col("2019 Total Emitted"),
                                               col("2019 Prob Emitted")]);

    println!("{}", lf_2019_country.clone().collect().unwrap());

/*  
 *  SELECT lf_country.Entity, (lf_country."2010 Total Mismanaged" / lf_mis_region.Mismanaged) "2010 Mismanaged"
 *  FROM lf_country INNER JOIN lf_mis_region
 *      ON lf_country.Continent = lf_mis_region.Entity
 *  GROUP_BY lf_country.Entity
 *  HAVING lf_mis_region.Year = 2010
 *
 *  SELECT lf_country.Entity, (lf_country."2019 Total Mismanaged" / lf_mis_region.Mismanaged) "2019 Mismanaged"
 *  FROM lf_country INNER JOIN lf_mis_region
 *      ON lf_country.Continent = lf_mis_region.Entity
 *  GROUP_BY lf_country.Entity
 *  HAVING lf_mis_region.Year = 2019
 */

    let lf_country: LazyFrame = lf_2010_country
                                .inner_join(lf_2019_country, col("Entity"), col("Entity"))
                                .inner_join(lf_mis_region,
                                            col("Continent"),
                                            col("Entity"))
                                .filter(col("Year").eq(lit(2010)))
                                .select(&[col("Entity"),
                                          col("Code"),
                                          col("Continent"),
                                          col("2010 Total Waste Generated"),
                                          col("2019 % of Region Mismanaged").alias("2010 Total Mismanaged") * col("Mismanaged") * lit(10),
                                          col("2019 Total Mismanaged"),
                                          col("2019 % of Region Mismanaged"),
                                          col("2019 Total Emitted"),
                                          col("2019 Prob Emitted")])
                                .select(&[col("*"),
                                          col("2010 Total Mismanaged").alias("2010 Total Emitted") / lit(100) * col("2019 Prob Emitted")]);
                                           // col("Year"),
                                           // col("Mismanaged")]);

    // Calculate change per year
    let lf_slope: LazyFrame = lf_country
                                .with_column(
                                    (col("2019 Total Emitted").alias("Change Per Year")-col("2010 Total Emitted"))/lit(9)
                                    );
                                


    return lf_slope.collect().unwrap();
}
