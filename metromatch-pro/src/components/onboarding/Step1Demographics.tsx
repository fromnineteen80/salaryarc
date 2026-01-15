import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Demographics, Gender, Ethnicity, Orientation } from '../../types/user';
import { User, Heart } from 'lucide-react';

interface Props {
  data: Partial<Demographics>;
  onNext: (data: Partial<Demographics>) => void;
}

export default function Step1Demographics({ data, onNext }: Props) {
  const [formData, setFormData] = useState<Partial<Demographics>>({
    firstName: data.firstName || '',
    currentAge: data.currentAge || undefined,
    gender: data.gender || undefined,
    ethnicity: data.ethnicity || undefined,
    orientation: data.orientation || undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isValid = formData.firstName &&
                  formData.currentAge &&
                  formData.gender &&
                  formData.ethnicity &&
                  formData.orientation;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Let's start with the basics
        </h2>
        <p className="text-gray-600">
          This helps us understand your demographic profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="What should we call you?"
            required
          />
        </div>

        {/* Current Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Age
          </label>
          <input
            type="number"
            value={formData.currentAge || ''}
            onChange={(e) => setFormData({ ...formData, currentAge: parseInt(e.target.value) })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
            placeholder="25"
            min="18"
            max="100"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['man', 'woman'] as Gender[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData({ ...formData, gender: option })}
                className={`px-6 py-4 rounded-lg border-2 font-medium transition-all ${
                  formData.gender === option
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option === 'man' ? 'Man' : 'Woman'}
              </button>
            ))}
          </div>
        </div>

        {/* Ethnicity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Ethnicity
          </label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'white', label: 'White' },
              { value: 'black', label: 'Black' },
              { value: 'hispanic', label: 'Hispanic/Latino' },
              { value: 'asian', label: 'Asian' },
              { value: 'other', label: 'Other/Mixed' }
            ] as Array<{ value: Ethnicity; label: string }>).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, ethnicity: option.value })}
                className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.ethnicity === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sexual Orientation
          </label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'straight', label: 'Straight' },
              { value: 'gay', label: 'Gay/Lesbian' },
              { value: 'bisexual', label: 'Bisexual' }
            ] as Array<{ value: Orientation; label: string }>).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, orientation: option.value })}
                className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                  formData.orientation === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isValid}
          whileHover={{ scale: isValid ? 1.02 : 1 }}
          whileTap={{ scale: isValid ? 0.98 : 1 }}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
          <Heart className="w-5 h-5" />
        </motion.button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Step 1 of 5 - Demographics
      </div>
    </motion.div>
  );
}
