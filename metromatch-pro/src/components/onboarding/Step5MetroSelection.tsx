import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RelocationTarget } from '../../types/user';
import { MapPin, Search, X, Target } from 'lucide-react';

interface Props {
  data: RelocationTarget[];
  metrosList: string[];  // List of all CBSA labels
  onNext: (data: RelocationTarget[]) => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function Step5MetroSelection({ data, metrosList, onNext, onBack, onSkip }: Props) {
  const [selected, setSelected] = useState<RelocationTarget[]>(data);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMetros = metrosList.filter(metro =>
    metro.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50);  // Limit to 50 results

  const addMetro = (cbsaLabel: string) => {
    if (selected.length < 6 && !selected.find(m => m.cbsaLabel === cbsaLabel)) {
      const cbsaName = cbsaLabel.split(',')[0].trim();
      setSelected([...selected, { cbsaName, cbsaLabel }]);
      setSearchTerm('');
    }
  };

  const removeMetro = (cbsaLabel: string) => {
    setSelected(selected.filter(m => m.cbsaLabel !== cbsaLabel));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Compare Specific Markets
        </h2>
        <p className="text-gray-600">
          Select up to 6 metros to compare (optional - you can skip this)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-8">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg"
            placeholder="Search for a city... (e.g., Austin, New York, San Francisco)"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchTerm && (
          <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg">
            <AnimatePresence>
              {filteredMetros.map((metro, i) => (
                <motion.button
                  key={metro}
                  type="button"
                  onClick={() => addMetro(metro)}
                  disabled={selected.length >= 6 || selected.find(m => m.cbsaLabel === metro) !== undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selected.find(m => m.cbsaLabel === metro) ? 'bg-indigo-50 text-indigo-700' : ''
                  } ${
                    selected.length >= 6 && !selected.find(m => m.cbsaLabel === metro) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
                  {metro}
                </motion.button>
              ))}
            </AnimatePresence>

            {filteredMetros.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No metros found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {/* Selected Metros */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Selected Markets ({selected.length}/6)
          </label>

          {selected.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No metros selected yet</p>
              <p className="text-sm text-gray-400 mt-1">Search above to add markets</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {selected.map((metro, i) => (
                  <motion.div
                    key={metro.cbsaLabel}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{metro.cbsaName}</div>
                        <div className="text-sm text-gray-600">{metro.cbsaLabel}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMetro(metro.cbsaLabel)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Popular Metros Suggestions */}
        {selected.length < 6 && !searchTerm && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Popular Markets
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'New York-Newark-Jersey City, NY-NJ-PA',
                'Los Angeles-Long Beach-Anaheim, CA',
                'Chicago-Naperville-Elgin, IL-IN-WI',
                'Houston-The Woodlands-Sugar Land, TX',
                'Phoenix-Mesa-Scottsdale, AZ',
                'San Francisco-Oakland-Hayward, CA',
                'Austin-Round Rock, TX',
                'Seattle-Tacoma-Bellevue, WA',
                'Denver-Aurora-Lakewood, CO',
                'Miami-Fort Lauderdale-West Palm Beach, FL',
                'Boston-Cambridge-Newton, MA-NH',
                'Atlanta-Sandy Springs-Roswell, GA'
              ].filter(m => !selected.find(s => s.cbsaLabel === m)).slice(0, 6).map(metro => (
                <button
                  key={metro}
                  type="button"
                  onClick={() => addMetro(metro)}
                  className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 text-left transition-all"
                >
                  {metro.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Skip
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
          >
            See My Results
            <Target className="w-5 h-5" />
          </motion.button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Step 5 of 5 - Metro Selection
      </div>
    </motion.div>
  );
}
