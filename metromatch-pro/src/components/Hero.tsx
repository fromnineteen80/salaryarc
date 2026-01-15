import { MapPin, TrendingUp, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Find Your Perfect
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-200">
              Location Match
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Compare 917 metros across 80+ demographic factors. Make data-driven relocation,
            salary negotiation, and market expansion decisions.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Start Free Analysis
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:border-white/50 transition-all"
            >
              View Demo
            </motion.button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: MapPin, label: '917 Metros', desc: 'Complete US coverage' },
              { icon: Users, label: '80+ Metrics', desc: 'Deep demographics' },
              { icon: TrendingUp, label: 'Smart Scoring', desc: 'AI-powered matches' },
              { icon: DollarSign, label: 'True COL', desc: 'BEA cost data' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <feature.icon className="w-8 h-8 text-cyan-300 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{feature.label}</div>
                <div className="text-sm text-blue-200">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
