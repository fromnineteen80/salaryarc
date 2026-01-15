import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CareerContext, AboutYou, Sector, Education, BodyType, WorkoutFrequency, PoliticalViews, YesNo, WantKids, RelationshipGoal } from '../../types/user';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

interface Props {
  careerData: Partial<CareerContext>;
  aboutYouData: Partial<AboutYou>;
  gender: 'man' | 'woman';
  onNext: (career: Partial<CareerContext>, aboutYou: Partial<AboutYou>) => void;
  onBack: () => void;
}

export default function Step2Career({ careerData, aboutYouData, gender, onNext, onBack }: Props) {
  const [career, setCareer] = useState<Partial<CareerContext>>({
    firstJobTitle: careerData.firstJobTitle || '',
    firstJobYear: careerData.firstJobYear || new Date().getFullYear() - 5,
    currentJobTitle: careerData.currentJobTitle || '',
    firstSector: careerData.firstSector || undefined,
    currentSector: careerData.currentSector || undefined,
    sectorTransitionYear: careerData.sectorTransitionYear,
    sectorTransitionReason: careerData.sectorTransitionReason
  });

  const [aboutYou, setAboutYou] = useState<Partial<AboutYou>>({
    currentLocation: aboutYouData.currentLocation || '',
    currentZip: aboutYouData.currentZip || '',
    currentIncome: aboutYouData.currentIncome || undefined,
    currentEducation: aboutYouData.currentEducation || undefined,
    height: aboutYouData.height || '',
    bodyType: aboutYouData.bodyType || undefined,
    workoutFrequency: aboutYouData.workoutFrequency || undefined,
    politicalViews: aboutYouData.politicalViews || undefined,
    smoking: aboutYouData.smoking || undefined,
    wantKids: aboutYouData.wantKids || undefined,
    relationshipGoal: aboutYouData.relationshipGoal || undefined
  });

  const sectors: Array<{ value: Sector; label: string }> = [
    { value: 'corporate', label: 'Corporate' },
    { value: 'startup', label: 'Startup' },
    { value: 'government', label: 'Government' },
    { value: 'nonprofit', label: 'Nonprofit' },
    { value: 'self-employed', label: 'Self-Employed' },
    { value: 'student', label: 'Student' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'retired', label: 'Retired' }
  ];

  const educationLevels: Array<{ value: Education; label: string }> = [
    { value: 'less_hs', label: 'Less than High School' },
    { value: 'hs_grad', label: 'High School Graduate' },
    { value: 'trade', label: 'Trade/Vocational School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'some_college', label: 'Some College' },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'graduate', label: 'Graduate Degree' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(career, aboutYou);
  };

  const isValid = career.firstJobTitle &&
                  career.currentJobTitle &&
                  career.firstSector &&
                  career.currentSector &&
                  aboutYou.currentLocation &&
                  aboutYou.currentZip &&
                  aboutYou.currentIncome &&
                  aboutYou.currentEducation &&
                  aboutYou.bodyType &&
                  aboutYou.workoutFrequency &&
                  aboutYou.politicalViews &&
                  aboutYou.smoking &&
                  aboutYou.wantKids &&
                  aboutYou.relationshipGoal &&
                  (gender === 'woman' || aboutYou.height);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Career & Current Situation
        </h2>
        <p className="text-gray-600">
          This data helps us calculate your true market value
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
        {/* Career Section */}
        <div className="border-b pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Career History
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Job Title
              </label>
              <input
                type="text"
                value={career.firstJobTitle}
                onChange={(e) => setCareer({ ...career, firstJobTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="Sales Associate"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Job Year
              </label>
              <input
                type="number"
                value={career.firstJobYear}
                onChange={(e) => setCareer({ ...career, firstJobYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                min="1960"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Job Title
              </label>
              <input
                type="text"
                value={career.currentJobTitle}
                onChange={(e) => setCareer({ ...career, currentJobTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="Senior Product Manager"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Sector
              </label>
              <select
                value={career.firstSector || ''}
                onChange={(e) => setCareer({ ...career, firstSector: e.target.value as Sector })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select...</option>
                {sectors.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Sector
              </label>
              <select
                value={career.currentSector || ''}
                onChange={(e) => setCareer({ ...career, currentSector: e.target.value as Sector })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select...</option>
                {sectors.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Current Location & Income */}
        <div className="border-b pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location & Income
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Location
              </label>
              <input
                type="text"
                value={aboutYou.currentLocation}
                onChange={(e) => setAboutYou({ ...aboutYou, currentLocation: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="Austin, TX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={aboutYou.currentZip}
                onChange={(e) => setAboutYou({ ...aboutYou, currentZip: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="78701"
                pattern="[0-9]{5}"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Annual Income
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={aboutYou.currentIncome || ''}
                  onChange={(e) => setAboutYou({ ...aboutYou, currentIncome: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="85000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Education Level
              </label>
              <select
                value={aboutYou.currentEducation || ''}
                onChange={(e) => setAboutYou({ ...aboutYou, currentEducation: e.target.value as Education })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select...</option>
                {educationLevels.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Physical & Lifestyle */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            About You
          </h3>

          <div className="space-y-4">
            {/* Height (men only) */}
            {gender === 'man' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height
                </label>
                <input
                  type="text"
                  value={aboutYou.height}
                  onChange={(e) => setAboutYou({ ...aboutYou, height: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  placeholder="5'10&quot;"
                  pattern="[4-7]'([0-9]|1[0-1])&quot;"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: 5'10"</p>
              </div>
            )}

            {/* Body Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Body Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['lean_fit', 'average', 'overweight', 'obese'] as BodyType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAboutYou({ ...aboutYou, bodyType: type })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      aboutYou.bodyType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Workout Frequency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Workout Frequency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'never' as WorkoutFrequency, label: 'Never' },
                  { value: '1_day' as WorkoutFrequency, label: '1 day/week' },
                  { value: '2_3_days' as WorkoutFrequency, label: '2-3 days/week' },
                  { value: '4_6_days' as WorkoutFrequency, label: '4-6 days/week' },
                  { value: 'daily' as WorkoutFrequency, label: 'Daily' }
                ].map(freq => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setAboutYou({ ...aboutYou, workoutFrequency: freq.value })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      aboutYou.workoutFrequency === freq.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Political Views */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Political Views
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['apolitical', 'liberal', 'moderate', 'conservative'] as PoliticalViews[]).map(view => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setAboutYou({ ...aboutYou, politicalViews: view })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all capitalize ${
                      aboutYou.politicalViews === view
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Smoking
                </label>
                <div className="flex gap-3">
                  {(['yes', 'no'] as YesNo[]).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAboutYou({ ...aboutYou, smoking: opt })}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium ${
                        aboutYou.smoking === opt
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {opt === 'yes' ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Want Kids?
                </label>
                <div className="flex gap-2">
                  {(['yes', 'no', 'maybe'] as WantKids[]).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAboutYou({ ...aboutYou, wantKids: opt })}
                      className={`flex-1 px-3 py-3 rounded-lg border-2 font-medium capitalize ${
                        aboutYou.wantKids === opt
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Looking For
                </label>
                <select
                  value={aboutYou.relationshipGoal || ''}
                  onChange={(e) => setAboutYou({ ...aboutYou, relationshipGoal: e.target.value as RelationshipGoal })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select...</option>
                  <option value="casual">Casual Dating</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <motion.button
            type="submit"
            disabled={!isValid}
            whileHover={{ scale: isValid ? 1.02 : 1 }}
            whileTap={{ scale: isValid ? 0.98 : 1 }}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all ${
              isValid
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </motion.button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Step 2 of 5 - Career & Profile
      </div>
    </motion.div>
  );
}
