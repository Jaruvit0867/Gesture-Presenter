import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function SwipeIndicator({ direction, isVisible }) {
  const isLeft = direction === 'left';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
        >
          {/* Main indicator */}
          <motion.div
            initial={{
              x: isLeft ? -50 : 50,
              scale: 0.9,
              opacity: 0
            }}
            animate={{
              x: 0,
              scale: 1,
              opacity: 1
            }}
            exit={{
              x: isLeft ? 50 : -50,
              scale: 0.9,
              opacity: 0
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className="relative"
          >
            {/* Main container */}
            <div className="relative flex items-center gap-6 px-10 py-8 rounded-3xl glass-strong shadow-2xl">
              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center
                ${isLeft
                  ? 'bg-white/10'
                  : 'bg-emerald-400/20'
                }
              `}>
                {isLeft ? (
                  <ArrowLeft className="w-8 h-8 text-white" />
                ) : (
                  <ArrowRight className="w-8 h-8 text-emerald-400" />
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <span className={`text-4xl font-display font-medium tracking-tight ${isLeft ? 'text-white' : 'text-emerald-400'}`}>
                  {isLeft ? 'Previous' : 'Next'}
                </span>
                <span className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] mt-1 pl-1">
                  Slide
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
