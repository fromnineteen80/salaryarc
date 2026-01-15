import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PreferredPartner, BodyType, WorkoutFrequency, PoliticalViews, Ethnicity, Education, WantKids } from '../../types/user';
import { Heart, Users } from 'lucide-react';

interface Props {
  data: Partial<PreferredPartner>;
  userGender: 'man' | 'woman';
  onNext: (data: Partial<PreferredPartner>) => void;
  onBack: () => void;
}

export default function Step3PartnerPrefs({ data, userGender, onNext, onBack }: Props) {
  const [prefs, setPrefs] = useState<Partial<PreferredPartner>>({
    ageMin: data.ageMin || 25,
    ageMax: data.ageMax || 35,
    minIncome: data.minIncome || 50000,
    minHeight: data.minHeight || 'no_preference',
    bodyTypes: data.bodyTypes || [],
    workoutFrequencies: data.workoutFrequencies || [],
    politicalViews: data.politicalViews || [],
    ethnicities: data.ethnicities || [],
    minEducation: data.minEducation,
    hasKids: data.hasKids || 'no_preference',
    wantKids: data.wantKids || ['no_preference'],
    smoking: data.smoking || 'no_preference'
  });

  const toggleArrayItem = <T extends string>(
    array: T[],
    item: T,
    setter: (arr: T[]) => void
  ) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(prefs);
  };

  const isValid = prefs.ageMin !== undefined &&
                  prefs.ageMax !== undefined &&
                  prefs.minIncome !== undefined &&
                  prefs.bodyTypes!.length > 0 &&
                  prefs.politicalViews!.length > 0;

  // Show height selector only for women seeking men
  const showHeight = userGender === 'woman';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What are you looking for?
        </h2>
        <p className="text-gray-600">
          Your preferences help us find the best markets for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
        {/* Age Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Age Range: {prefs.ageMin} - {prefs.ageMax}
          </label>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="range"
                min="18"
                max="65"
                value={prefs.ageMin}
                onChange={(e) => setPrefs({ ...prefs, ageMin: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">Min: {prefs.ageMin}</div>
            </div>
            <div className="flex-1">
              <input
                type="range"
                min="18"
                max="65"
                value={prefs.ageMax}
                onChange={(e) => setPrefs({ ...prefs, ageMax: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">Max: {prefs.ageMax}</div>
            </div>
          </div>
        </div>

        {/* Minimum Income */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Minimum Income: ${(prefs.minIncome || 0).toLocaleString()}
          </label>
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={prefs.minIncome}
            onChange={(e) => setPrefs({ ...prefs, minIncome: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span>$250k</span>
            <span>$500k+</span>
          </div>
        </div>

        {/* Height (women only) */}
        {showHeight && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum Height (Optional)
            </label>
            <select
              value={prefs.minHeight}
              onChange={(e) => setPrefs({ ...prefs, minHeight: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-rose-500 focus:outline-none"
            >
              <option value="no_preference">No Preference</option>
              <option value="5'6&quot;">5'6" or taller</option>
              <option value="5'8&quot;">5'8" or taller</option>
              <option value="5'10&quot;">5'10" or taller</option>
              <option value="6'0&quot;">6'0" or taller</option>
            </select>
          </div>
        )}

        {/* Body Types (Multi-select) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Acceptable Body Types <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['lean_fit', 'average', 'overweight', 'obese'] as BodyType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayItem(
                  prefs.bodyTypes!,
                  type,
                  (arr) => setPrefs({ ...prefs, bodyTypes: arr })
                )}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  prefs.bodyTypes!.includes(type)
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
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
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Workout Frequency (Optional)
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
                onClick={() => toggleArrayItem(
                  prefs.workoutFrequencies!,
                  freq.value,
                  (arr) => setPrefs({ ...prefs, workoutFrequencies: arr })
                )}
                className={`px-3 py-3 rounded-lg border-2 font-medium transition-all text-sm ${
                  prefs.workoutFrequencies!.includes(freq.value)
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        {/* Political Views (Multi-select) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Political Views <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['apolitical', 'liberal', 'moderate', 'conservative'] as PoliticalViews[]).map(view => (
              <button
                key={view}
                type="button"
                onClick={() => toggleArrayItem(
                  prefs.politicalViews!,
                  view,
                  (arr) => setPrefs({ ...prefs, politicalViews: arr })
                )}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all capitalize ${
                  prefs.politicalViews!.includes(view)
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Ethnicity (Multi-select, Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Ethnicity Preferences (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'white' as Ethnicity, label: 'White' },
              { value: 'black' as Ethnicity, label: 'Black' },
              { value: 'hispanic' as Ethnicity, label: 'Hispanic/Latino' },
              { value: 'asian' as Ethnicity, label: 'Asian' },
              { value: 'other' as Ethnicity, label: 'Other/Mixed' }
            ].map(eth => (
              <button
                key={eth.value}
                type="button"
                onClick={() => toggleArrayItem(
                  prefs.ethnicities!,
                  eth.value,
                  (arr) => setPrefs({ ...prefs, ethnicities: arr })
                )}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  prefs.ethnicities!.includes(eth.value)
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {eth.label}
              </button>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Education (Optional)
          </label>
          <select
            value={prefs.minEducation || ''}
            onChange={(e) => setPrefs({ ...prefs, minEducation: (e.target.value || undefined) as Education })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-rose-500 focus:outline-none"
          >
            <option value="">No Preference</option>
            <option value="hs_grad">High School Graduate</option>
            <option value="trade">Trade/Vocational School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="graduate">Graduate Degree</option>
          </select>
        </div>

        {/* Kids Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Has Kids?
            </label>
            <select
              value={prefs.hasKids}
              onChange={(e) => setPrefs({ ...prefs, hasKids: e.target.value as any })}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-rose-500 focus:outline-none"
            >
              <option value="no_preference">No Preference</option>
              <option value="no">Prefers No Kids</option>
              <option value="yes">Open to Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wants Kids?
            </label>
            <div className="flex gap-2">
              {(['yes', 'no', 'maybe'] as WantKids[]).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const current = prefs.wantKids!;
                    if (current.includes('no_preference')) {
                      setPrefs({ ...prefs, wantKids: [opt] });
                    } else {
                      toggleArrayItem(current, opt, (arr) =>
                        setPrefs({ ...prefs, wantKids: arr.length > 0 ? arr : ['no_preference'] })
                      );
                    }
                  }}
                  className={`flex-1 px-3 py-3 rounded-lg border-2 font-medium capitalize ${
                    prefs.wantKids!.includes(opt)
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Smoking */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Smoking Preference
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'no_preference', label: 'No Preference' },
              { value: 'no', label: 'Non-Smoker' },
              { value: 'yes', label: 'Smoker OK' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPrefs({ ...prefs, smoking: opt.value as any })}
                className={`px-4 py-3 rounded-lg border-2 font-medium ${
                  prefs.smoking === opt.value
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
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
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              isValid
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <Users className="w-5 h-5" />
          </motion.button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Step 3 of 5 - Partner Preferences
      </div>
    </motion.div>
  );
}
