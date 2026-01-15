import { MetroData } from '../types';
import { UserProfile, DatingMarketScore, BodyType, WorkoutFrequency } from '../types/user';

/**
 * DATING MARKET ENGINE
 *
 * Calculates user's dating market value across all metros
 * based on supply/demand, competition, and match pool size
 */

// Height conversion helper
function heightToInches(heightStr: string): number {
  const match = heightStr.match(/(\d+)'(\d+)"/);
  if (!match) return 0;
  return parseInt(match[1]) * 12 + parseInt(match[2]);
}

// Map body type to BMI category percentages
function getBodyTypeScore(bodyType: BodyType, metro: MetroData): number {
  const mapping = {
    lean_fit: metro.bmi_elite_cbsa + metro.bmi_normal_cbsa,
    average: metro.bmi_normal_cbsa,
    overweight: metro.bmi_overweight_cbsa,
    obese: metro.bmi_obesity_cbsa
  };
  return mapping[bodyType] || 50;
}

// Map workout frequency to fitness percentile
function getWorkoutScore(frequency: WorkoutFrequency, metro: MetroData): number {
  const mapping = {
    daily: metro.fitness_daily_cbsa,
    '4_6_days': metro.fitness_4_6_days_cbsa + metro.fitness_daily_cbsa,
    '2_3_days': metro.fitness_2_3_days_cbsa + metro.fitness_4_6_days_cbsa + metro.fitness_daily_cbsa,
    '1_day': metro.fitness_1_day_cbsa + metro.fitness_2_3_days_cbsa + metro.fitness_4_6_days_cbsa + metro.fitness_daily_cbsa,
    never: 100
  };
  return mapping[frequency] || 50;
}

// Calculate income percentile
function getIncomePercentile(userIncome: number, metro: MetroData): number {
  if (userIncome >= 750000) return 99.7;
  if (userIncome >= 500000) return 99.0;
  if (userIncome >= 300000) return 96.5 + metro.income_500k_750k_cbsa;
  if (userIncome >= 200000) return 90.8 + metro.income_300k_500k_cbsa + metro.income_500k_750k_cbsa;
  if (userIncome >= 150000) return 85.0 + metro.income_200k_300k_cbsa + metro.income_300k_500k_cbsa + metro.income_500k_750k_cbsa;
  if (userIncome >= 100000) return 71.2 + metro.income_150k_200k_cbsa + metro.income_200k_300k_cbsa + metro.income_300k_500k_cbsa;
  if (userIncome >= 75000) return 59.3 + metro.income_100k_150k_cbsa + metro.income_150k_200k_cbsa;
  if (userIncome >= 50000) return 42.5 + metro.income_75k_100k_cbsa + metro.income_100k_150k_cbsa;
  if (userIncome >= 35000) return 28.9 + metro.income_50k_75k_cbsa + metro.income_75k_100k_cbsa;
  return metro.income_under_35k_cbsa / 2;
}

// Calculate education percentile
function getEducationPercentile(education: string, metro: MetroData): number {
  const mapping: Record<string, number> = {
    graduate: 100 - metro.education_graduate_cbsa / 2,
    bachelors: 100 - (metro.education_bachelors_cbsa + metro.education_graduate_cbsa),
    some_college: 65,
    associate: 55,
    trade: 45,
    hs_grad: 28,
    less_hs: 9
  };
  return mapping[education] || 50;
}

// Calculate height percentile for men
function getHeightPercentile(heightStr: string | undefined, metro: MetroData): number {
  if (!heightStr) return 50;

  const inches = heightToInches(heightStr);

  if (inches >= 72) return 100 - metro.height_72plus_cbsa / 2;  // Top tier
  if (inches >= 69) return 69;
  if (inches >= 66) return 50;
  if (inches >= 63) return 35;
  if (inches >= 60) return 20;
  return 10;
}

// Calculate political alignment match
function getPoliticalScore(userViews: string, metro: MetroData): number {
  const mapping: Record<string, number> = {
    conservative: metro.political_conservative_cbsa,
    liberal: metro.political_liberal_cbsa,
    moderate: metro.political_moderate_cbsa,
    apolitical: metro.political_apolitical_cbsa
  };
  return mapping[userViews] || 25;
}

/**
 * Calculate supply/demand score
 * How rare is this user in this metro?
 */
function calculateSupplyDemandScore(user: UserProfile, metro: MetroData): number {
  let rarityScore = 0;
  let factors = 0;

  // Income rarity (being high income is rare and valuable)
  const incomePercentile = getIncomePercentile(user.aboutYou.currentIncome, metro);
  rarityScore += incomePercentile;
  factors++;

  // Education rarity
  const eduPercentile = getEducationPercentile(user.aboutYou.currentEducation, metro);
  rarityScore += eduPercentile;
  factors++;

  // Fitness rarity (being fit is valuable)
  if (user.aboutYou.bodyType === 'lean_fit') {
    rarityScore += (100 - (metro.bmi_elite_cbsa + metro.bmi_normal_cbsa));
    factors++;
  }

  // Height rarity (for men)
  if (user.demographics.gender === 'man' && user.aboutYou.height) {
    const heightPercentile = getHeightPercentile(user.aboutYou.height, metro);
    rarityScore += heightPercentile;
    factors++;
  }

  // Non-smoker rarity
  if (user.aboutYou.smoking === 'no') {
    rarityScore += metro.smoking_yes_cbsa;  // Being non-smoker is valuable where smokers are rare
    factors++;
  }

  return factors > 0 ? rarityScore / factors : 50;
}

/**
 * Calculate competition score
 * How does user stack up vs others competing for same partners?
 */
function calculateCompetitionScore(user: UserProfile, metro: MetroData): number {
  // Looking at same-gender individuals
  const isMan = user.demographics.gender === 'man';
  const sameGenderPct = isMan ? metro.gender_man_cbsa : metro.gender_woman_cbsa;
  const singlePct = metro.relationship_single_cbsa;

  // Calculate your demographic advantages
  const incomeAdv = getIncomePercentile(user.aboutYou.currentIncome, metro);
  const eduAdv = getEducationPercentile(user.aboutYou.currentEducation, metro);
  const fitnessAdv = getBodyTypeScore(user.aboutYou.bodyType, metro);

  // Average your advantages
  const avgAdvantage = (incomeAdv + eduAdv + fitnessAdv) / 3;

  // Lower competition if you're above average
  // Higher competition if you're below average
  const competitionPenalty = (50 - sameGenderPct) + (50 - singlePct);

  return Math.max(0, Math.min(100, avgAdvantage + competitionPenalty));
}

/**
 * Calculate match pool size
 * How many people in this metro meet the user's partner criteria?
 */
function calculateMatchPoolSize(user: UserProfile, metro: MetroData): number {
  const prefs = user.preferredPartner;
  const population = metro.cbsa_population;

  // Start with total singles of opposite gender
  const isSeekingMen = user.demographics.orientation === 'straight' && user.demographics.gender === 'woman' ||
                        user.demographics.orientation === 'gay' && user.demographics.gender === 'man';

  let poolPct = metro.relationship_single_cbsa;

  // Factor in gender
  poolPct *= (isSeekingMen ? metro.gender_man_cbsa : metro.gender_woman_cbsa) / 100;

  // Factor in age range
  const ageFields = [
    'age_18_19_cbsa', 'age_20_24_cbsa', 'age_25_29_cbsa', 'age_30_34_cbsa',
    'age_35_39_cbsa', 'age_40_44_cbsa', 'age_45_49_cbsa', 'age_50_54_cbsa',
    'age_55_59_cbsa', 'age_60_64_cbsa', 'age_65_69_cbsa'
  ];

  // Rough age filtering (this is simplified)
  if (prefs.ageMin >= 25 && prefs.ageMax <= 45) {
    poolPct *= metro.age_25_45_cbsa / 100;
  }

  // Income filtering
  if (prefs.minIncome >= 100000) {
    poolPct *= (metro.income_100k_150k_cbsa + metro.income_150k_200k_cbsa +
                metro.income_200k_300k_cbsa + metro.income_300k_500k_cbsa +
                metro.income_500k_750k_cbsa + metro.income_750k_plus_cbsa) / 100;
  } else if (prefs.minIncome >= 75000) {
    poolPct *= (metro.income_75k_100k_cbsa + metro.income_100k_150k_cbsa +
                metro.income_150k_200k_cbsa + metro.income_200k_300k_cbsa) / 100;
  }

  // Education filtering
  if (prefs.minEducation === 'graduate') {
    poolPct *= metro.education_graduate_cbsa / 100;
  } else if (prefs.minEducation === 'bachelors') {
    poolPct *= (metro.education_bachelors_cbsa + metro.education_graduate_cbsa) / 100;
  }

  // Political filtering
  if (prefs.politicalViews.length > 0 && !prefs.politicalViews.includes('apolitical')) {
    const politicalMatch = prefs.politicalViews.reduce((sum, view) => {
      const mapping: Record<string, number> = {
        conservative: metro.political_conservative_cbsa,
        liberal: metro.political_liberal_cbsa,
        moderate: metro.political_moderate_cbsa
      };
      return sum + (mapping[view] || 0);
    }, 0);
    poolPct *= politicalMatch / 100;
  }

  // Fitness/body type filtering
  if (prefs.bodyTypes.length > 0) {
    const bodyMatch = prefs.bodyTypes.reduce((sum, type) => {
      const mapping: Record<string, number> = {
        lean_fit: metro.bmi_elite_cbsa + metro.bmi_normal_cbsa,
        average: metro.bmi_normal_cbsa + metro.bmi_overweight_cbsa,
        overweight: metro.bmi_overweight_cbsa,
        obese: metro.bmi_obesity_cbsa
      };
      return sum + (mapping[type] || 0);
    }, 0);
    poolPct *= Math.min(100, bodyMatch) / 100;
  }

  // Want kids filtering
  if (prefs.wantKids.length > 0 && !prefs.wantKids.includes('no_preference')) {
    const kidsMatch = prefs.wantKids.reduce((sum, want) => {
      const mapping: Record<string, number> = {
        yes: metro.want_kids_yes_cbsa,
        no: metro.want_kids_no_cbsa,
        maybe: metro.want_kids_maybe_cbsa
      };
      return sum + (mapping[want] || 0);
    }, 0);
    poolPct *= kidsMatch / 100;
  }

  // Calculate absolute number
  return Math.round((population * poolPct) / 100);
}

/**
 * Generate detailed insights about why this metro is good/bad
 */
function generateInsights(user: UserProfile, metro: MetroData, scores: {
  supplyDemand: number;
  competition: number;
  matchPool: number;
  income: number;
  education: number;
  fitness: number;
}): {
  advantages: string[];
  disadvantages: string[];
  insights: string[];
} {
  const advantages: string[] = [];
  const disadvantages: string[] = [];
  const insights: string[] = [];

  // Income advantages
  if (scores.income > 85) {
    advantages.push(`Top ${Math.round(100 - scores.income)}% income earner here`);
  } else if (scores.income < 40) {
    disadvantages.push(`Below median income for this metro`);
  }

  // Education advantages
  if (scores.education > 80) {
    advantages.push(`Your education level is above ${Math.round(scores.education)}% of residents`);
  }

  // Fitness advantages
  if (user.aboutYou.bodyType === 'lean_fit') {
    advantages.push(`Lean/fit body type is top ${Math.round(100 - (metro.bmi_elite_cbsa + metro.bmi_normal_cbsa))}%`);
  }

  // Political alignment
  const politicalPct = getPoliticalScore(user.aboutYou.politicalViews, metro);
  if (politicalPct > 40) {
    insights.push(`${Math.round(politicalPct)}% of residents share your political views`);
  } else {
    insights.push(`Only ${Math.round(politicalPct)}% share your political alignment - could be challenging`);
  }

  // Match pool insights
  if (scores.matchPool > 5000) {
    insights.push(`Large dating pool of ${scores.matchPool.toLocaleString()} potential matches`);
  } else if (scores.matchPool < 1000) {
    insights.push(`Limited pool of ${scores.matchPool.toLocaleString()} people meeting your criteria`);
  }

  // Cost of living
  if (metro.rpp < 95) {
    const adjustment = user.aboutYou.currentIncome * (100 / metro.rpp);
    insights.push(`Your income has ${Math.round(adjustment - user.aboutYou.currentIncome).toLocaleString()} more purchasing power here`);
  } else if (metro.rpp > 110) {
    insights.push(`High cost of living (${metro.rpp}% of national average) reduces your buying power`);
  }

  return { advantages, disadvantages, insights };
}

/**
 * MAIN FUNCTION: Calculate dating market score for a specific metro
 */
export function calculateDatingMarketScore(
  user: UserProfile,
  metro: MetroData
): DatingMarketScore {
  // Calculate component scores
  const supplyDemandScore = calculateSupplyDemandScore(user, metro);
  const competitionScore = calculateCompetitionScore(user, metro);
  const matchPoolSize = calculateMatchPoolSize(user, metro);

  // Individual attribute scores
  const incomeRank = getIncomePercentile(user.aboutYou.currentIncome, metro);
  const educationRank = getEducationPercentile(user.aboutYou.currentEducation, metro);
  const fitnessRank = user.aboutYou.bodyType === 'lean_fit' ?
    (100 - (metro.bmi_elite_cbsa + metro.bmi_normal_cbsa)) : 50;

  // Calculate RPP-adjusted income
  const adjustedIncome = user.aboutYou.currentIncome * (100 / metro.rpp);

  // Overall score (weighted average)
  const overallScore = (
    supplyDemandScore * 0.35 +      // 35% - How rare/valuable you are
    competitionScore * 0.25 +        // 25% - How you compare to competition
    (matchPoolSize / 100) * 0.20 +   // 20% - Size of your potential pool (normalized)
    incomeRank * 0.20                // 20% - Income rank matters
  );

  // Generate insights
  const { advantages, disadvantages, insights } = generateInsights(user, metro, {
    supplyDemand: supplyDemandScore,
    competition: competitionScore,
    matchPool: matchPoolSize,
    income: incomeRank,
    education: educationRank,
    fitness: fitnessRank
  });

  return {
    cbsaLabel: metro.cbsa_label,
    overallScore: Math.min(100, Math.max(0, overallScore)),
    supplyDemandScore,
    competitionScore,
    matchPoolSize,
    adjustedIncome,
    rankPercentile: (incomeRank + educationRank + fitnessRank) / 3,
    detailedBreakdown: {
      incomeRank,
      educationRank,
      fitnessRank,
      yourAdvantages: advantages,
      yourDisadvantages: disadvantages,
      marketInsights: insights
    }
  };
}

/**
 * Score all metros and return ranked list
 */
export function scoreAllMetros(
  user: UserProfile,
  metrosData: Record<string, MetroData>
): DatingMarketScore[] {
  const scores = Object.values(metrosData).map(metro =>
    calculateDatingMarketScore(user, metro)
  );

  // Sort by overall score descending
  return scores.sort((a, b) => b.overallScore - a.overallScore);
}
