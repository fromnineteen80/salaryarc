// ============================================
// USER PROFILE TYPES
// ============================================

export type Gender = 'man' | 'woman';
export type Ethnicity = 'white' | 'black' | 'hispanic' | 'asian' | 'other';
export type Orientation = 'straight' | 'gay' | 'bisexual';
export type Sector = 'government' | 'nonprofit' | 'corporate' | 'startup' | 'self-employed' | 'unemployed' | 'student' | 'retired';
export type Education = 'less_hs' | 'hs_grad' | 'trade' | 'associate' | 'some_college' | 'bachelors' | 'graduate';
export type BodyType = 'lean_fit' | 'average' | 'overweight' | 'obese';
export type WorkoutFrequency = 'never' | '1_day' | '2_3_days' | '4_6_days' | 'daily';
export type PoliticalViews = 'apolitical' | 'liberal' | 'moderate' | 'conservative';
export type YesNo = 'yes' | 'no';
export type WantKids = 'yes' | 'no' | 'maybe';
export type RelationshipGoal = 'casual' | 'serious' | 'marriage';

// ============================================
// DEMOGRAPHICS
// ============================================

export interface Demographics {
  firstName: string;
  currentAge: number;
  gender: Gender;
  ethnicity: Ethnicity;
  orientation: Orientation;
}

// ============================================
// CAREER CONTEXT
// ============================================

export interface CareerContext {
  firstJobTitle: string;
  firstJobYear: number;
  currentJobTitle: string;
  firstSector: Sector;
  currentSector: Sector;
  sectorTransitionYear?: number;
  sectorTransitionReason?: string;
}

// ============================================
// INCOME HISTORY
// ============================================

export interface IncomeHistoryRow {
  year: number;
  location: string;  // "City, State" format
  zipCode: string;   // 5-digit ZIP
  income: number;
  householdGoal: number;  // Goal household income
  age: number;
  married: YesNo;
  children: YesNo;
  education: Education;
}

// ============================================
// ABOUT YOU (Singles Only)
// ============================================

export interface AboutYou {
  currentLocation: string;  // City, State
  currentZip: string;
  currentIncome: number;
  currentEducation: Education;
  height?: string;  // "5'10" format - men only
  bodyType: BodyType;
  workoutFrequency: WorkoutFrequency;
  politicalViews: PoliticalViews;
  smoking: YesNo;
  wantKids: WantKids;
  relationshipGoal: RelationshipGoal;
}

// ============================================
// PREFERRED PARTNER (Singles Only)
// ============================================

export interface PreferredPartner {
  ageMin: number;  // 18-65
  ageMax: number;  // 18-65
  minIncome: number;  // $0-$500k+
  minHeight?: string;  // "5'6" format - women seeking men only, or "no_preference"
  bodyTypes: BodyType[];  // Multi-select
  workoutFrequencies: WorkoutFrequency[];  // Multi-select
  politicalViews: PoliticalViews[];  // Multi-select
  ethnicities: Ethnicity[];  // Multi-select
  minEducation?: Education;  // Minimum education level
  hasKids: 'no_preference' | YesNo;
  wantKids: WantKids[] | ['no_preference'];  // Multi-select
  smoking: 'no_preference' | YesNo;
}

// ============================================
// RELOCATION TARGETS
// ============================================

export interface RelocationTarget {
  cbsaName: string;
  cbsaLabel: string;
}

// ============================================
// COMPLETE USER PROFILE
// ============================================

export interface UserProfile {
  demographics: Demographics;
  careerContext: CareerContext;
  incomeHistory: IncomeHistoryRow[];  // 3-15 rows
  aboutYou: AboutYou;
  preferredPartner: PreferredPartner;
  relocationTargets: RelocationTarget[];  // Up to 6
  createdAt: Date;
  updatedAt: Date;
  subscriptionTier: 'free' | 'plus' | 'pro';
}

// ============================================
// MARKET ANALYSIS RESULTS
// ============================================

export interface DatingMarketScore {
  cbsaLabel: string;
  overallScore: number;  // 0-100
  supplyDemandScore: number;  // How rare are you here?
  competitionScore: number;  // How do you stack up vs others?
  matchPoolSize: number;  // How many potential partners meet YOUR criteria?
  adjustedIncome: number;  // RPP-adjusted purchasing power
  rankPercentile: number;  // You're top X% in this metro
  detailedBreakdown: {
    incomeRank: number;  // Your income percentile
    educationRank: number;  // Your education percentile
    fitnessRank: number;  // Your fitness percentile
    yourAdvantages: string[];  // What makes you attractive here
    yourDisadvantages: string[];  // What works against you
    marketInsights: string[];  // Key insights about this market
  };
}

export interface MetroComparison {
  metro: string;
  currentMarketValue: DatingMarketScore;
  potentialMarketValue: DatingMarketScore;
  moveRecommendation: {
    shouldMove: boolean;
    scoreImprovement: number;
    poolSizeIncrease: number;
    costOfLivingDiff: number;
    keyReasons: string[];
  };
}

// ============================================
// FORM STATE
// ============================================

export interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  formData: Partial<UserProfile>;
}
