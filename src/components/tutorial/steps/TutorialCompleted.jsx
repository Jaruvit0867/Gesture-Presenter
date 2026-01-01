import { motion } from 'framer-motion';
import { useTutorial } from '../../../contexts/TutorialContext';
import { Trophy, Sparkles, CheckCircle2, Presentation } from 'lucide-react';

export default function TutorialCompleted() {
  const { skipTutorial } = useTutorial();

  const achievements = [
    { icon: '📄', label: 'PDF Upload', desc: 'Loaded presentation' },
    { icon: '📷', label: 'Camera', desc: 'Enabled detection' },
    { icon: '✊', label: 'Fist', desc: 'Pause gesture' },
    { icon: '☝️', label: 'Pointer', desc: 'Highlight content' },
    { icon: '👋', label: 'Swipe', desc: 'Navigate slides' },
  ];

  return (
    <div className="text-center">
      {/* Celebration animation */}
      <motion.div
        className="relative w-24 h-24 mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-purple blur-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Trophy */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center">
          <Trophy className="w-12 h-12 text-white" />
        </div>

        {/* Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 text-aurora-cyan"
            style={{
              top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 6)}%`,
              left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 6)}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        ))}
      </motion.div>

      <motion.h2
        className="font-display text-2xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Congratulations!
      </motion.h2>

      <motion.p
        className="text-slate-400 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        You've mastered all the gestures. You're ready to present!
      </motion.p>

      {/* Achievement badges */}
      <motion.div
        className="flex justify-center gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {achievements.map((item, i) => (
          <motion.div
            key={i}
            className="relative group"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-dark-800 border border-aurora-cyan/30 flex items-center justify-center text-xl group-hover:border-aurora-cyan/50 group-hover:bg-aurora-cyan/10 transition-all">
              {item.icon}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <p className="text-[10px] font-bold text-white">{item.label}</p>
              <p className="text-[9px] text-slate-400">{item.desc}</p>
            </div>

            {/* Check mark */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-aurora-emerald flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Start presenting button */}
      <motion.button
        onClick={skipTutorial}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-white font-bold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-aurora-cyan/20 hover:shadow-aurora-cyan/40 transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Presentation className="w-5 h-5" />
        <span>Start Presenting</span>
      </motion.button>

      {/* Quick reference */}
      <motion.div
        className="mt-6 p-4 bg-dark-800/30 rounded-xl border border-dark-700/50 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <p className="text-xs font-bold text-aurora-purple uppercase tracking-wider mb-2 text-center">
          Quick Reference
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">✊</span>
            <span className="text-slate-400">Pause</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">☝️</span>
            <span className="text-slate-400">Point</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👋</span>
            <span className="text-slate-400">Swipe</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
