import { motion } from 'framer-motion';
import { Presentation, Github } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-10 py-5 px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ opacity: 0.8 }}
        >
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Presentation className="w-5 h-5 text-white" />
          </div>

          <span className="font-display font-semibold text-lg text-white">
            GesturePresenter
          </span>
        </motion.div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {/* Online indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-white/60 font-medium">Online</span>
          </div>

          {/* GitHub button */}
          <motion.a
            href="https://github.com/Jaruvit0867/Gesture-Presenter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-white/15 text-white/80 hover:bg-white/5 hover:border-white/25 transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">Github</span>
            <span className="sm:hidden">→</span>
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
}
