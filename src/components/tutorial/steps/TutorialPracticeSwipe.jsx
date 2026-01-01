import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTutorial } from '../../../contexts/TutorialContext';
import { CheckCircle2, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TutorialPracticeSwipe({ gesture }) {
  const { markPracticeSuccess, practiceSuccess } = useTutorial();
  const [swipeCount, setSwipeCount] = useState(0);
  const [lastSwipeDir, setLastSwipeDir] = useState(null);
  const lastGestureRef = useRef(null);

  const isSuccess = practiceSuccess.swipe;
  const isSwipeReady = gesture?.name === 'SWIPE_READY';
  const isSwipeLeft = gesture?.name === 'SWIPE_LEFT';
  const isSwipeRight = gesture?.name === 'SWIPE_RIGHT';
  const isSwipeAction = isSwipeLeft || isSwipeRight;

  // Track swipes
  useEffect(() => {
    if (isSuccess) return;

    // Detect swipe actions
    if (isSwipeAction && lastGestureRef.current !== gesture?.name) {
      lastGestureRef.current = gesture?.name;
      setLastSwipeDir(isSwipeLeft ? 'left' : 'right');
      setSwipeCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 2) {
          setTimeout(() => markPracticeSuccess('swipe'), 500);
        }
        return newCount;
      });
    } else if (!isSwipeAction) {
      lastGestureRef.current = null;
    }
  }, [gesture?.name, isSwipeAction, isSwipeLeft, isSuccess, markPracticeSuccess]);

  return (
    <div className="flex gap-6">
      {/* Left side - Instructions */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
            ${isSuccess
              ? 'bg-aurora-emerald/20 border-aurora-emerald/30'
              : isSwipeAction
                ? 'bg-aurora-purple/20 border-aurora-purple/30'
                : isSwipeReady
                  ? 'bg-aurora-emerald/20 border-aurora-emerald/30'
                  : 'bg-aurora-cyan/20 border-aurora-cyan/30'
            } border
          `}>
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-aurora-emerald" />
            ) : (
              <span className="text-2xl">👋</span>
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">
              {isSuccess ? 'Swipe Gesture Mastered!' : 'Practice: Swipe'}
            </h3>
            <p className="text-xs text-slate-400">
              {isSuccess ? 'You got it!' : 'Step 5 of 6 - Gesture Practice'}
            </p>
          </div>
        </div>

        {!isSuccess ? (
          <>
            <p className="text-slate-300 text-sm mb-4">
              Open your palm with <span className="text-aurora-emerald font-bold">all 5 fingers</span> extended,
              then <span className="text-aurora-purple font-bold">swipe left or right</span> to navigate slides.
              Complete <span className="text-aurora-cyan font-bold">2 swipes</span> to continue.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <p className="text-xs text-slate-400 mb-2">Current Status:</p>
                <div className="flex items-center gap-2">
                  <div className={`
                    w-3 h-3 rounded-full transition-all
                    ${isSwipeAction
                      ? 'bg-aurora-purple animate-pulse'
                      : isSwipeReady
                        ? 'bg-aurora-emerald animate-pulse'
                        : 'bg-slate-600'
                    }
                  `} />
                  <span className={`font-bold text-sm ${
                    isSwipeAction
                      ? 'text-aurora-purple'
                      : isSwipeReady
                        ? 'text-aurora-emerald'
                        : 'text-slate-400'
                  }`}>
                    {isSwipeAction
                      ? `Swipe ${isSwipeLeft ? 'Left' : 'Right'} Detected!`
                      : isSwipeReady
                        ? 'Ready - Now swipe left or right!'
                        : 'Open your palm with all fingers'
                    }
                  </span>
                </div>
              </div>

              {/* Swipe counter */}
              <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <p className="text-xs text-slate-400 mb-2">Swipe Progress:</p>
                <div className="flex items-center gap-3">
                  {[1, 2].map((num) => (
                    <div
                      key={num}
                      className={`
                        flex-1 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                        ${swipeCount >= num
                          ? 'bg-aurora-purple/20 border-aurora-purple/50'
                          : 'bg-dark-700 border-dark-600'
                        } border
                      `}
                    >
                      {swipeCount >= num ? (
                        <CheckCircle2 className="w-5 h-5 text-aurora-purple" />
                      ) : (
                        <span className="text-slate-500 text-sm">Swipe {num}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tip - Animated Workflow */}
            <div className="mt-4 p-3 bg-aurora-cyan/10 rounded-xl border border-aurora-cyan/20">
              <p className="text-xs font-bold text-aurora-cyan mb-3">Swipe Workflow (follow along!):</p>

              {/* Animated workflow demo */}
              <div className="flex items-center justify-center gap-1">
                {/* Step 1: Open palm */}
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.4] }}
                >
                  <div className="w-10 h-10 rounded-lg bg-aurora-emerald/20 flex items-center justify-center mb-1">
                    <span className="text-xl">🖐️</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Open</span>
                </motion.div>

                {/* Arrow 1 */}
                <motion.div
                  className="text-aurora-purple"
                  animate={{ x: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0.15, 0.3, 0.45] }}
                >
                  →
                </motion.div>

                {/* Step 2: Swipe */}
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0.25, 0.45, 0.6] }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-aurora-purple/20 flex items-center justify-center mb-1"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0.3, 0.45, 0.5] }}
                  >
                    <span className="text-xl">👋</span>
                  </motion.div>
                  <span className="text-[9px] text-slate-400">Swipe</span>
                </motion.div>

                {/* Arrow 2 */}
                <motion.div
                  className="text-aurora-pink"
                  animate={{ x: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0.5, 0.65, 0.8] }}
                >
                  →
                </motion.div>

                {/* Step 3: Fist to reset */}
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0.6, 0.8, 1] }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-aurora-pink/20 flex items-center justify-center mb-1"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0.65, 0.75, 0.85] }}
                  >
                    <span className="text-xl">✊</span>
                  </motion.div>
                  <span className="text-[9px] text-slate-400">Reset</span>
                </motion.div>

                {/* Arrow 3 - loop back */}
                <motion.div
                  className="text-aurora-cyan"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, times: [0.85, 0.95, 1] }}
                >
                  ↺
                </motion.div>
              </div>

              <p className="text-[10px] text-slate-400 mt-3 text-center">
                Make a fist after swipe to reset position for next swipe
              </p>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-aurora-emerald/10 rounded-xl border border-aurora-emerald/20"
          >
            <p className="text-sm text-slate-300 mb-2">
              Amazing! You've mastered all gestures!
            </p>
            <p className="text-xs text-slate-400">
              You're now ready to control your presentations hands-free.
            </p>
          </motion.div>
        )}
      </div>

      {/* Right side - Visual guide */}
      <div className="w-48 flex-shrink-0">
        <div className={`
          h-full rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-500
          ${isSuccess
            ? 'border-aurora-emerald/50 bg-aurora-emerald/5'
            : isSwipeAction
              ? 'border-aurora-purple/50 bg-aurora-purple/5'
              : isSwipeReady
                ? 'border-aurora-emerald/50 bg-aurora-emerald/5'
                : 'border-dark-700 bg-dark-800/50'
          }
        `}>
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <CheckCircle2 className="w-16 h-16 text-aurora-emerald" />
            </motion.div>
          ) : (
            <>
              {/* Animated swipe demo */}
              <div className="relative w-full h-20 mb-3">
                {isSwipeReady || isSwipeAction ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      className="text-5xl"
                      animate={{
                        x: lastSwipeDir === 'left' ? [-20, 0] : lastSwipeDir === 'right' ? [20, 0] : [20, -20, 20],
                      }}
                      transition={{
                        duration: lastSwipeDir ? 0.3 : 1.5,
                        repeat: lastSwipeDir ? 0 : Infinity,
                      }}
                    >
                      🖐️
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl">🖐️</span>
                  </div>
                )}
              </div>

              {/* Direction arrows */}
              <div className="flex items-center gap-4 text-slate-500">
                <motion.div
                  animate={isSwipeReady ? { x: [-5, 0, -5] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ChevronLeft className={`w-6 h-6 ${lastSwipeDir === 'left' ? 'text-aurora-purple' : ''}`} />
                </motion.div>
                <ArrowLeftRight className="w-5 h-5" />
                <motion.div
                  animate={isSwipeReady ? { x: [5, 0, 5] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ChevronRight className={`w-6 h-6 ${lastSwipeDir === 'right' ? 'text-aurora-purple' : ''}`} />
                </motion.div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-3">
                {isSwipeAction
                  ? `${swipeCount}/2 swipes done!`
                  : isSwipeReady
                    ? 'Swipe left or right'
                    : 'Open palm first'
                }
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
