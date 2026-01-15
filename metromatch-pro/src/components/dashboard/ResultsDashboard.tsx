import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { UserProfile, DatingMarketScore } from '../../types/user';
import { Award, Heart, Target, Zap } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  marketScores: DatingMarketScore[];
}

export default function ResultsDashboard({ userProfile, marketScores }: Props) {
  const [view, setView] = useState<'top' | 'selected' | 'all'>('top');

  // Get top markets
  const topMarkets = useMemo(() =>
    marketScores.slice(0, 10),
    [marketScores]
  );

  // Get selected markets if any
  const selectedMarkets = useMemo(() => {
    if (userProfile.relocationTargets.length === 0) return [];
    return marketScores.filter(score =>
      userProfile.relocationTargets.some(t => t.cbsaLabel === score.cbsaLabel)
    );
  }, [marketScores, userProfile.relocationTargets]);

  // Best market overall
  const bestMarket = marketScores[0];

  // Current location score (if we can find it)
  const currentLocationScore = useMemo(() => {
    const current = userProfile.aboutYou.currentLocation;
    return marketScores.find(s =>
      s.cbsaLabel.toLowerCase().includes(current.toLowerCase().split(',')[0])
    );
  }, [marketScores, userProfile.aboutYou.currentLocation]);

  const displayedMarkets = view === 'top' ? topMarkets :
                           view === 'selected' ? selectedMarkets :
                           marketScores.slice(0, 50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 shadow-xl">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Your Dating Market Report
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hi {userProfile.demographics.firstName}, here's where you rank highest
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {bestMarket.overallScore.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Best Market Score</div>
              <div className="text-xs text-gray-500 mt-1">{bestMarket.cbsaLabel.split(',')[0]}</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-1">
                {bestMarket.matchPoolSize.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Potential Matches</div>
              <div className="text-xs text-gray-500 mt-1">In best market</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                {bestMarket.rankPercentile.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Your Percentile</div>
              <div className="text-xs text-gray-500 mt-1">Overall ranking</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                ${(bestMarket.adjustedIncome / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-600">Buying Power</div>
              <div className="text-xs text-gray-500 mt-1">RPP-adjusted</div>
            </div>
          </div>
        </motion.div>

        {/* Your #1 Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-2xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Your Best Market</h2>
              </div>

              <h3 className="text-4xl font-extrabold mb-6">{bestMarket.cbsaLabel}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-purple-100 text-sm mb-1">Market Score</div>
                  <div className="text-3xl font-bold">{bestMarket.overallScore.toFixed(0)}/100</div>
                </div>
                <div>
                  <div className="text-purple-100 text-sm mb-1">Supply/Demand</div>
                  <div className="text-3xl font-bold">{bestMarket.supplyDemandScore.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-purple-100 text-sm mb-1">Competition</div>
                  <div className="text-3xl font-bold">{bestMarket.competitionScore.toFixed(0)}</div>
                </div>
              </div>

              {/* Advantages */}
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Your Advantages Here:
                </h4>
                <ul className="space-y-1">
                  {bestMarket.detailedBreakdown.yourAdvantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-200">✓</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Market Insights:
                </h4>
                <ul className="space-y-1">
                  {bestMarket.detailedBreakdown.marketInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-pink-200">→</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="ml-8 bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-6xl font-extrabold mb-2">
                #{1}
              </div>
              <div className="text-sm">Best Match</div>
            </div>
          </div>
        </motion.div>

        {/* Current Location vs Best */}
        {currentLocationScore && currentLocationScore.cbsaLabel !== bestMarket.cbsaLabel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 mb-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Your Current Market vs Your Best Market
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-500 mb-2">Current Location</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{currentLocationScore.cbsaLabel}</h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Score</span>
                      <span className="font-semibold">{currentLocationScore.overallScore.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${currentLocationScore.overallScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Match Pool</span>
                      <span className="font-semibold">{currentLocationScore.matchPoolSize.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Your Percentile</span>
                      <span className="font-semibold">{currentLocationScore.rankPercentile.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-purple-500 rounded-xl p-6 bg-purple-50">
                <div className="text-sm text-purple-600 mb-2">Best Market</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{bestMarket.cbsaLabel}</h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Score</span>
                      <span className="font-semibold text-purple-600">
                        {bestMarket.overallScore.toFixed(0)}
                        <span className="text-xs ml-1 text-green-600">
                          (+{(bestMarket.overallScore - currentLocationScore.overallScore).toFixed(0)})
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${bestMarket.overallScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Match Pool</span>
                      <span className="font-semibold text-purple-600">
                        {bestMarket.matchPoolSize.toLocaleString()}
                        <span className="text-xs ml-1 text-green-600">
                          (+{(bestMarket.matchPoolSize - currentLocationScore.matchPoolSize).toLocaleString()})
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Your Percentile</span>
                      <span className="font-semibold text-purple-600">
                        {bestMarket.rankPercentile.toFixed(0)}%
                        <span className="text-xs ml-1 text-green-600">
                          (+{(bestMarket.rankPercentile - currentLocationScore.rankPercentile).toFixed(0)})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-green-900 font-semibold">
                💡 By relocating to {bestMarket.cbsaLabel.split(',')[0]}, you could improve your dating market value by{' '}
                {((bestMarket.overallScore - currentLocationScore.overallScore) / currentLocationScore.overallScore * 100).toFixed(0)}%
              </p>
            </div>
          </motion.div>
        )}

        {/* View Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setView('top')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'top'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Top 10 Markets
          </button>
          {selectedMarkets.length > 0 && (
            <button
              onClick={() => setView('selected')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                view === 'selected'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Your Selected ({selectedMarkets.length})
            </button>
          )}
          <button
            onClick={() => setView('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Markets
          </button>
        </div>

        {/* Markets List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <h3 className="text-2xl font-bold text-gray-900">
              {view === 'top' && 'Your Top 10 Markets'}
              {view === 'selected' && 'Your Selected Markets'}
              {view === 'all' && 'All Markets (Top 50)'}
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {displayedMarkets.map((market, index) => (
              <MarketRow key={market.cbsaLabel} market={market} rank={index + 1} />
            ))}
          </div>
        </motion.div>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to make your move?</h3>
          <p className="text-xl mb-6 text-purple-100">
            Upgrade to Pro for detailed ZIP-level analysis, move planning, and ongoing market tracking
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl">
              Upgrade to Pro - $99/mo
            </button>
            <button className="bg-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-400 transition-all">
              Try Plus - $29/mo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Individual Market Row Component
function MarketRow({ market, rank }: { market: DatingMarketScore; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="hover:bg-gray-50 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
            rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
            rank <= 10 ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white' :
            'bg-gray-200 text-gray-700'
          }`}>
            #{rank}
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">{market.cbsaLabel}</h4>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>Score: {market.overallScore.toFixed(0)}</span>
              <span>•</span>
              <span>{market.matchPoolSize.toLocaleString()} matches</span>
              <span>•</span>
              <span>Top {(100 - market.rankPercentile).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{market.overallScore.toFixed(0)}</div>
          <div className="text-xs text-gray-500">Overall</div>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 pb-6 bg-gray-50"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Supply/Demand</div>
              <div className="text-2xl font-bold text-purple-600">{market.supplyDemandScore.toFixed(0)}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Competition</div>
              <div className="text-2xl font-bold text-pink-600">{market.competitionScore.toFixed(0)}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Buying Power</div>
              <div className="text-2xl font-bold text-emerald-600">${(market.adjustedIncome / 1000).toFixed(0)}k</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">Your Advantages:</h5>
              <ul className="space-y-1 text-sm">
                {market.detailedBreakdown.yourAdvantages.map((adv, i) => (
                  <li key={i} className="text-gray-700">✓ {adv}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">Market Insights:</h5>
              <ul className="space-y-1 text-sm">
                {market.detailedBreakdown.marketInsights.slice(0, 3).map((insight, i) => (
                  <li key={i} className="text-gray-700">→ {insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
