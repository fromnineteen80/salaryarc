import { MetroData, SearchFilters, MetroScore } from '../types';

/**
 * Calculate purchasing power adjusted salary
 * National average RPP = 100
 */
export function calculateAdjustedSalary(salary: number, fromRPP: number, toRPP: number): number {
  return salary * (fromRPP / toRPP);
}

/**
 * Calculate purchasing power percentage difference
 */
export function calculatePurchasingPowerDiff(rpp1: number, rpp2: number): number {
  return ((rpp1 - rpp2) / rpp2) * 100;
}

/**
 * Intelligent metro scoring algorithm
 * Returns 0-100 score based on how well metro matches user preferences
 */
export function scoreMetro(metro: MetroData, filters: SearchFilters): MetroScore {
  let score = 0;
  const matchReasons: string[] = [];
  const maxScore = 100;

  // Population filter (hard filter, not scored)
  if (filters.minPopulation && metro.cbsa_population < filters.minPopulation) {
    return { ...metro, score: 0, matchReasons: ['Population too small'] };
  }
  if (filters.maxPopulation && metro.cbsa_population > filters.maxPopulation) {
    return { ...metro, score: 0, matchReasons: ['Population too large'] };
  }

  // Cost of Living Score (30 points)
  if (filters.maxRPP) {
    const rppScore = Math.max(0, ((filters.maxRPP - metro.rpp) / filters.maxRPP) * 30);
    score += rppScore;
    if (metro.rpp < 95) {
      matchReasons.push(`${((100 - metro.rpp) / 100 * 100).toFixed(0)}% cheaper than national average`);
    }
  }

  // Income Level Score (25 points)
  if (filters.minIncome) {
    const incomeScore = metro.income_cbsa >= filters.minIncome ? 25 :
                       (metro.income_cbsa / filters.minIncome) * 25;
    score += incomeScore;
    if (metro.income_cbsa >= 60) {
      matchReasons.push(`High median income ($${metro.income_cbsa}k)`);
    }
  }

  // Education Score (20 points)
  if (filters.minBachelors) {
    const eduScore = metro.bachelors_cbsa >= filters.minBachelors ? 20 :
                    (metro.bachelors_cbsa / filters.minBachelors) * 20;
    score += eduScore;
    if (metro.bachelors_cbsa >= 50) {
      matchReasons.push(`${metro.bachelors_cbsa.toFixed(0)}% college educated`);
    }
  }

  // Political Alignment Score (15 points)
  if (filters.politicalLean && filters.politicalLean !== 'any') {
    const politicalMatch = {
      'conservative': metro.political_conservative_cbsa,
      'liberal': metro.political_liberal_cbsa,
      'moderate': metro.political_moderate_cbsa
    }[filters.politicalLean] || 0;

    const politicalScore = (politicalMatch / 100) * 15;
    score += politicalScore;
  }

  // Singles Score (10 points) - if looking for dating pool
  if (filters.minSingle) {
    const singleScore = metro.single_18_65_cbsa >= filters.minSingle ? 10 :
                       (metro.single_18_65_cbsa / filters.minSingle) * 10;
    score += singleScore;
    if (metro.single_18_65_cbsa >= 35) {
      matchReasons.push(`${metro.single_18_65_cbsa.toFixed(0)}% single adults`);
    }
  }

  // Normalize to 100
  const normalizedScore = Math.min(100, Math.round((score / maxScore) * 100));

  return {
    ...metro,
    score: normalizedScore,
    matchReasons
  };
}

/**
 * Rank metros by intelligent scoring
 */
export function rankMetros(metros: Record<string, MetroData>, filters: SearchFilters): MetroScore[] {
  const scored = Object.entries(metros).map(([name, data]) =>
    scoreMetro(data, filters)
  );

  return scored
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
