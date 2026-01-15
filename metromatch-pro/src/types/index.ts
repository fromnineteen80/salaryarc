export interface MetroData {
  lat: number;
  lng: number;
  rpp: number;
  cbsa: number;
  cbsa_name: string;
  cbsa_label: string;
  cbsa_population: number;
  cbsa_type: string;

  // Demographics
  pct_white_cbsa: number;
  age_25_45_cbsa: number;
  single_18_65_cbsa: number;
  income_cbsa: number;
  bachelors_cbsa: number;
  male_cbsa: number;
  female_cbsa: number;
  median_rent_cbsa: number;

  // Age distribution
  age_18_19_cbsa: number;
  age_20_24_cbsa: number;
  age_25_29_cbsa: number;
  age_30_34_cbsa: number;
  age_35_39_cbsa: number;
  age_40_44_cbsa: number;
  age_45_49_cbsa: number;

  // Education
  education_bachelors_cbsa: number;
  education_graduate_cbsa: number;

  // Income distribution
  income_under_35k_cbsa: number;
  income_35k_50k_cbsa: number;
  income_50k_75k_cbsa: number;
  income_75k_100k_cbsa: number;
  income_100k_150k_cbsa: number;
  income_150k_200k_cbsa: number;
  income_200k_300k_cbsa: number;

  // Political
  political_conservative_cbsa: number;
  political_moderate_cbsa: number;
  political_liberal_cbsa: number;

  // Health
  obesity_cbsa: number;
  activity_cbsa: number;
  smoking_cbsa: number;

  // Relationship
  relationship_single_cbsa: number;
  relationship_married_cbsa: number;
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
