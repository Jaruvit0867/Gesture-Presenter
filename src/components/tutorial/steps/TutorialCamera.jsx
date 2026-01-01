import { motion } from 'framer-motion';
import { Camera, CheckCircle2, Shield, Video } from 'lucide-react';
import { useTutorial } from '../../../contexts/TutorialContext';
import { useEffect } from 'react';

export default function TutorialCamera({ cameraActive, onStartCamera }) {
  const { nextStep } = useTutorial();

  // Auto advance when camera is enabled
  useEffect(() => {
    if (cameraActive) {
      const timer = setTimeout(() => {
        nextStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cameraActive, nextStep]);

  return (
    <div className="flex gap-6">
      {/* Left side - Instructions */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
            ${cameraActive
              ? 'bg-aurora-emerald/20 border-aurora-emerald/30'
              : 'bg-aurora-cyan/20 border-aurora-cyan/30'
            } border
          `}>
            {cameraActive ? (
              <CheckCircle2 className="w-6 h-6 text-aurora-emerald" />
            ) : (
              <Camera className="w-6 h-6 text-aurora-cyan" />
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">
              {cameraActive ? 'Camera Active!' : 'Enable Camera'}
            </h3>
            <p className="text-xs text-slate-400">
              {cameraActive ? 'Ready for gesture detection...' : 'Step 2 of 6'}
            </p>
          </div>
        </div>

        {!cameraActive ? (
          <>
            <p className="text-slate-300 text-sm mb-4">
              Enable your webcam to start detecting hand gestures.
              Click the <span className="text-aurora-cyan font-bold">"Enable"</span> button on the Gesture Control panel.
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={onStartCamera}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-aurora-cyan/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Video className="w-4 h-4" />
              <span>Enable Camera Now</span>
            </motion.button>

            {/* Privacy notice */}
            <div className="mt-4 p-3 bg-aurora-emerald/10 rounded-xl border border-aurora-emerald/20">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-aurora-emerald flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <span className="font-bold text-aurora-emerald">100% Private:</span> All gesture processing happens locally on your device. No video is ever sent to any server.
                </p>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-aurora-emerald/10 rounded-xl border border-aurora-emerald/20"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Video className="w-8 h-8 text-aurora-emerald" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-aurora-emerald"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Camera Ready</p>
                <p className="text-xs text-slate-400">Gesture detection is active</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right side - Visual */}
      <div className="w-48 flex-shrink-0">
        <motion.div
          className={`
            h-full rounded-xl overflow-hidden border-2 flex items-center justify-center
            transition-all duration-500
            ${cameraActive
              ? 'border-aurora-emerald/50 bg-aurora-emerald/5'
              : 'border-aurora-cyan/50 bg-dark-800'
            }
          `}
          animate={!cameraActive ? {
            borderColor: ['rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.6)', 'rgba(34, 211, 238, 0.3)'],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {cameraActive ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-aurora-emerald mx-auto mb-2" />
              <p className="text-xs text-slate-400">Connected</p>
            </motion.div>
          ) : (
            <div className="text-center p-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-12 h-12 text-aurora-cyan mx-auto mb-3" />
              </motion.div>
              <p className="text-xs text-slate-400">
                Click Enable to start
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
