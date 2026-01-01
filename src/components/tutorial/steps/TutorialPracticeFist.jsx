import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTutorial } from '../../../contexts/TutorialContext';
import { CheckCircle2, Hand } from 'lucide-react';

export default function TutorialPracticeFist({ gesture }) {
  const { markPracticeSuccess, practiceSuccess } = useTutorial();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdStartRef = useRef(null);
  const animationRef = useRef(null);

  const isSuccess = practiceSuccess.fist;
  const isFistDetected = gesture?.name === 'PAUSED';

  // Track fist hold progress
  useEffect(() => {
    if (isSuccess) return;

    if (isFistDetected) {
      if (!holdStartRef.current) {
        holdStartRef.current = Date.now();
      }

      const animate = () => {
        const elapsed = Date.now() - holdStartRef.current;
        const progress = Math.min((elapsed / 1500) * 100, 100);
        setHoldProgress(progress);

        if (progress >= 100) {
          markPracticeSuccess('fist');
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      holdStartRef.current = null;
      setHoldProgress(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isFistDetected, isSuccess, markPracticeSuccess]);

  return (
    <div className="flex gap-6">
      {/* Left side - Instructions */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
            ${isSuccess
              ? 'bg-aurora-emerald/20 border-aurora-emerald/30'
              : isFistDetected
                ? 'bg-aurora-pink/20 border-aurora-pink/30'
                : 'bg-aurora-cyan/20 border-aurora-cyan/30'
            } border
          `}>
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-aurora-emerald" />
            ) : (
              <span className="text-2xl">✊</span>
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">
              {isSuccess ? 'Fist Gesture Mastered!' : 'Practice: Fist (Pause)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isSuccess ? 'You got it!' : 'Step 3 of 6 - Gesture Practice'}
            </p>
          </div>
        </div>

        {!isSuccess ? (
          <>
            <p className="text-slate-300 text-sm mb-4">
              Make a <span className="text-aurora-pink font-bold">fist</span> with your hand and hold it for 1.5 seconds. This gesture pauses gesture detection.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <p className="text-xs text-slate-400 mb-2">Current Status:</p>
                <div className="flex items-center gap-2">
                  <div className={`
                    w-3 h-3 rounded-full transition-all
                    ${isFistDetected ? 'bg-aurora-pink animate-pulse' : 'bg-slate-600'}
                  `} />
                  <span className={`font-bold text-sm ${isFistDetected ? 'text-aurora-pink' : 'text-slate-400'}`}>
                    {isFistDetected ? 'Fist Detected - Hold!' : 'Show your fist to camera'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="p-3 bg-dark-800/50 rounded-xl border border-dark-700/50">
                <p className="text-xs text-slate-400 mb-2">Hold Progress:</p>
                <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-aurora-pink to-aurora-purple"
                    style={{ width: `${holdProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {Math.round(holdProgress)}%
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 bg-aurora-purple/10 rounded-xl border border-aurora-purple/20">
              <p className="text-xs text-aurora-purple">
                <span className="font-bold">Tip:</span> Close all your fingers tightly into your palm. Keep your hand steady and visible to the camera.
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
              Excellent! You've learned the pause gesture.
            </p>
            <p className="text-xs text-slate-400">
              Use this anytime you want to temporarily disable gesture detection.
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
            : isFistDetected
              ? 'border-aurora-pink/50 bg-aurora-pink/5'
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
              <motion.div
                className="text-6xl mb-3"
                animate={isFistDetected ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ✊
              </motion.div>
              <p className="text-xs text-slate-400 text-center">
                {isFistDetected ? 'Keep holding...' : 'Make a fist'}
              </p>

              {/* Circular progress */}
              {isFistDetected && (
                <div className="mt-3 relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-dark-700"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      className="text-aurora-pink"
                      strokeDasharray={176}
                      strokeDashoffset={176 - (176 * holdProgress / 100)}
                    />
                  </svg>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
