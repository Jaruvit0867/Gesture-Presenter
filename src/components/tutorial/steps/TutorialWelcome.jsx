import { motion } from 'framer-motion';
import { Hand, Presentation, Zap, Shield } from 'lucide-react';

export default function TutorialWelcome() {
  return (
    <div className="text-center">
      {/* Animated hand icon */}
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30 flex items-center justify-center"
        animate={{
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <Hand className="w-10 h-10 text-aurora-cyan" />
      </motion.div>

      <h2 className="font-display text-2xl font-bold text-white mb-3">
        Welcome to <span className="gradient-text">GesturePresenter</span>
      </h2>

      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        Control your presentations with natural hand gestures.
        This interactive tutorial will guide you through each feature step by step.
      </p>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: Zap, label: 'Real-time', desc: 'Instant response' },
          { icon: Shield, label: 'Private', desc: 'Local processing' },
          { icon: Presentation, label: 'Simple', desc: 'Easy to use' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-dark-800/50 rounded-xl p-3 border border-dark-700/50"
          >
            <item.icon className="w-5 h-5 mx-auto mb-2 text-aurora-cyan" />
            <p className="text-xs font-bold text-white">{item.label}</p>
            <p className="text-[10px] text-slate-500">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* What you'll learn */}
      <div className="text-left bg-dark-800/30 rounded-xl p-4 border border-dark-700/50">
        <p className="text-xs font-bold text-aurora-purple uppercase tracking-wider mb-3">
          What you'll learn:
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            'Upload and display your PDF presentation',
            'Enable camera for gesture detection',
            'Use Fist gesture to pause',
            'Point with your finger to highlight',
            'Swipe to navigate slides',
          ].map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-aurora-cyan/10 flex items-center justify-center flex-shrink-0">
                <span className="text-aurora-cyan text-xs font-bold">{i + 1}</span>
              </div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
