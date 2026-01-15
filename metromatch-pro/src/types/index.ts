export interface MetroData {
  // Location
  lat: number;
  lng: number;
  cbsa: number;
  cbsa_name: string;
  cbsa_label: string;
  cbsa_population: number;
  cbsa_type: string;

  // Economic
  rpp: number;
  median_rent_cbsa: number;
  income_cbsa: number;

  // Age Distribution (all brackets)
  age_18_19_cbsa: number;
  age_20_24_cbsa: number;
  age_25_29_cbsa: number;
  age_30_34_cbsa: number;
  age_35_39_cbsa: number;
  age_40_44_cbsa: number;
  age_45_49_cbsa: number;
  age_50_54_cbsa: number;
  age_55_59_cbsa: number;
  age_60_64_cbsa: number;
  age_65_69_cbsa: number;
  age_70_74_cbsa: number;
  age_75_79_cbsa: number;
  age_80_84_cbsa: number;
  age_85_120_cbsa: number;
  age_25_45_cbsa: number;  // Aggregate

  // Gender
  gender_man_cbsa: number;
  gender_woman_cbsa: number;
  gender_other_cbsa: number;
  male_cbsa: number;
  female_cbsa: number;

  // Sexual Orientation
  orientation_straight_cbsa: number;
  orientation_bisexual_cbsa: number;
  orientation_gay_lesbian_cbsa: number;
  orientation_other_cbsa: number;

  // Ethnicity
  ethnicity_white_cbsa: number;
  ethnicity_hispanic_cbsa: number;
  ethnicity_black_cbsa: number;
  ethnicity_asian_cbsa: number;
  ethnicity_native_cbsa: number;
  ethnicity_pacific_cbsa: number;
  ethnicity_other_cbsa: number;
  pct_white_cbsa: number;

  // Relationship Status
  relationship_married_cbsa: number;
  relationship_dating_cbsa: number;
  relationship_separated_cbsa: number;
  relationship_single_cbsa: number;
  single_18_65_cbsa: number;

  // Children
  have_kids_yes_cbsa: number;
  have_kids_no_cbsa: number;
  want_kids_yes_cbsa: number;
  want_kids_no_cbsa: number;
  want_kids_maybe_cbsa: number;

  // Education
  education_less_hs_cbsa: number;
  education_hs_grad_cbsa: number;
  education_trade_cbsa: number;
  education_associate_cbsa: number;
  education_some_college_cbsa: number;
  education_bachelors_cbsa: number;
  education_graduate_cbsa: number;
  bachelors_cbsa: number;  // Aggregate bachelors+

  // Income Distribution
  income_under_35k_cbsa: number;
  income_35k_50k_cbsa: number;
  income_50k_75k_cbsa: number;
  income_75k_100k_cbsa: number;
  income_100k_150k_cbsa: number;
  income_150k_200k_cbsa: number;
  income_200k_300k_cbsa: number;
  income_300k_500k_cbsa: number;
  income_500k_750k_cbsa: number;
  income_750k_plus_cbsa: number;

  // Fitness & Health
  fitness_never_cbsa: number;
  fitness_1_day_cbsa: number;
  fitness_2_3_days_cbsa: number;
  fitness_4_6_days_cbsa: number;
  fitness_daily_cbsa: number;
  activity_cbsa: number;
  obesity_cbsa: number;
  smoking_cbsa: number;

  // Height Distribution
  height_under_60_cbsa: number;
  height_60_62_cbsa: number;
  height_63_65_cbsa: number;
  height_66_68_cbsa: number;
  height_69_71_cbsa: number;
  height_72plus_cbsa: number;

  // BMI Categories
  bmi_elite_cbsa: number;
  bmi_normal_cbsa: number;
  bmi_overweight_cbsa: number;
  bmi_obesity_cbsa: number;

  // Political Alignment
  political_conservative_cbsa: number;
  political_moderate_cbsa: number;
  political_liberal_cbsa: number;
  political_apolitical_cbsa: number;

  // Substance Use
  smoking_no_cbsa: number;
  smoking_yes_cbsa: number;
  drugs_no_cbsa: number;
  drugs_yes_cbsa: number;
}

export interface MetroScore extends MetroData {
  score: number;
  matchReasons: string[];
}

export interface SearchFilters {
  minPopulation?: number;
  maxPopulation?: number;
  maxRPP?: number;
  minIncome?: number;
  minBachelors?: number;
  politicalLean?: 'conservative' | 'liberal' | 'moderate' | 'any';
  metroType?: string[];
  minSingle?: number;
}

export interface ZIPCentroid {
  lat: number;
  lng: number;
}

export interface SalaryComparison {
  metro: string;
  salary: number;
  rpp: number;
  adjustedSalary: number;
  purchasingPower: number;
}
