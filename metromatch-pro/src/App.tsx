import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Step1Demographics from './components/onboarding/Step1Demographics';
import Step2Career from './components/onboarding/Step2Career';
import Step3PartnerPrefs from './components/onboarding/Step3PartnerPrefs';
import Step4IncomeHistory from './components/onboarding/Step4IncomeHistory';
import Step5MetroSelection from './components/onboarding/Step5MetroSelection';
import ResultsDashboard from './components/dashboard/ResultsDashboard';
import { UserProfile, Demographics, CareerContext, AboutYou, PreferredPartner, IncomeHistoryRow, RelocationTarget } from './types/user';
import { MetroData } from './types';
import { scoreAllMetros } from './utils/datingMarketEngine';

// Import CBSA data
import CBSA_DATA_RAW from './data/cbsa-data.js?raw';

// Parse the CBSA data from the raw JavaScript file
const parseCBSAData = (): Record<string, MetroData> => {
  try {
    // Extract the data object from the JavaScript module
    const match = CBSA_DATA_RAW.match(/const\s+CBSA_DATA\s*=\s*(\{[\s\S]*\});?\s*(?:export|$)/);
    if (match) {
      const dataStr = match[1];
      // Use Function constructor to safely evaluate the object literal
      const data = new Function(`return ${dataStr}`)();
      return data;
    }
  } catch (error) {
    console.error('Error parsing CBSA data:', error);
  }
  return {};
};

type AppView = 'landing' | 'onboarding' | 'results';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [step, setStep] = useState(1);

  // User profile data
  const [demographics, setDemographics] = useState<Partial<Demographics>>({});
  const [careerContext, setCareerContext] = useState<Partial<CareerContext>>({});
  const [aboutYou, setAboutYou] = useState<Partial<AboutYou>>({});
  const [preferredPartner, setPreferredPartner] = useState<Partial<PreferredPartner>>({});
  const [incomeHistory, setIncomeHistory] = useState<IncomeHistoryRow[]>([]);
  const [relocationTargets, setRelocationTargets] = useState<RelocationTarget[]>([]);

  // Load CBSA data
  const cbsaData = useMemo(() => parseCBSAData(), []);
  const metrosList = useMemo(() => Object.keys(cbsaData).sort(), [cbsaData]);

  // Calculate market scores
  const marketScores = useMemo(() => {
    if (view !== 'results') return [];

    const profile: UserProfile = {
      demographics: demographics as Demographics,
      careerContext: careerContext as CareerContext,
      aboutYou: aboutYou as AboutYou,
      preferredPartner: preferredPartner as PreferredPartner,
      incomeHistory,
      relocationTargets,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionTier: 'free'
    };

    return scoreAllMetros(profile, cbsaData);
  }, [view, demographics, careerContext, aboutYou, preferredPartner, incomeHistory, relocationTargets, cbsaData]);

  const handleStartOnboarding = () => {
    setView('onboarding');
    setStep(1);
  };

  const handleStep1Complete = (data: Partial<Demographics>) => {
    setDemographics(data);
    setStep(2);
  };

  const handleStep2Complete = (career: Partial<CareerContext>, about: Partial<AboutYou>) => {
    setCareerContext(career);
    setAboutYou(about);
    setStep(3);
  };

  const handleStep3Complete = (prefs: Partial<PreferredPartner>) => {
    setPreferredPartner(prefs);
    setStep(4);
  };

  const handleStep4Complete = (history: IncomeHistoryRow[]) => {
    setIncomeHistory(history);
    setStep(5);
  };

  const handleStep5Complete = (targets: RelocationTarget[]) => {
    setRelocationTargets(targets);
    setView('results');
  };

  const handleStep5Skip = () => {
    setRelocationTargets([]);
    setView('results');
  };

  const handleBack = (targetStep: number) => {
    setStep(targetStep);
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <button
              onClick={handleStartOnboarding}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Discover Your Best Markets →
            </button>
            <p className="mt-4 text-gray-600">Free • 5-minute assessment • Instant results</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Driven Insights</h3>
              <p className="text-gray-600">
                We analyze 80+ demographic factors across 917 US metros to find your perfect match market
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">True Value Analysis</h3>
              <p className="text-gray-600">
                See your real purchasing power adjusted for cost of living in every market
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Match Pool Sizing</h3>
              <p className="text-gray-600">
                Know exactly how many potential partners meet YOUR criteria in each city
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Demographics
              key="step1"
              data={demographics}
              onNext={handleStep1Complete}
            />
          )}

          {step === 2 && (
            <Step2Career
              key="step2"
              careerData={careerContext}
              aboutYouData={aboutYou}
              gender={demographics.gender!}
              onNext={handleStep2Complete}
              onBack={() => handleBack(1)}
            />
          )}

          {step === 3 && (
            <Step3PartnerPrefs
              key="step3"
              data={preferredPartner}
              userGender={demographics.gender!}
              onNext={handleStep3Complete}
              onBack={() => handleBack(2)}
            />
          )}

          {step === 4 && (
            <Step4IncomeHistory
              key="step4"
              data={incomeHistory}
              currentAge={demographics.currentAge!}
              onNext={handleStep4Complete}
              onBack={() => handleBack(3)}
            />
          )}

          {step === 5 && (
            <Step5MetroSelection
              key="step5"
              data={relocationTargets}
              metrosList={metrosList}
              onNext={handleStep5Complete}
              onBack={() => handleBack(4)}
              onSkip={handleStep5Skip}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (view === 'results' && marketScores.length > 0) {
    const userProfile: UserProfile = {
      demographics: demographics as Demographics,
      careerContext: careerContext as CareerContext,
      aboutYou: aboutYou as AboutYou,
      preferredPartner: preferredPartner as PreferredPartner,
      incomeHistory,
      relocationTargets,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionTier: 'free'
    };

    return <ResultsDashboard userProfile={userProfile} marketScores={marketScores} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing your dating market value...</p>
      </div>
    </div>
  );
}

export default App;
