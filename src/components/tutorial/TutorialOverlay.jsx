import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial, TUTORIAL_STEPS } from '../../contexts/TutorialContext';
import { X, ChevronRight, ArrowRight, Sparkles, Upload, Camera, Hand, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

// Tooltip positions based on step
const stepConfig = {
  [TUTORIAL_STEPS.WELCOME]: {
    title: 'Welcome to Gesture Presenter! 👋',
    description: 'Let\'s learn how to control presentations with hand gestures. Follow these quick steps!',
    position: 'center',
    highlight: null,
  },
  [TUTORIAL_STEPS.UPLOAD_PDF]: {
    title: 'Upload Your Presentation',
    description: 'Drag and drop a PDF file or click the "Upload PDF" button to load your slides.',
    position: 'left',
    highlight: 'pdf-viewer',
    icon: Upload,
  },
  [TUTORIAL_STEPS.ENABLE_CAMERA]: {
    title: 'Enable Camera',
    description: 'Click "Enable" to start your webcam for gesture detection. All processing is local and private.',
    position: 'right',
    highlight: 'camera',
    icon: Camera,
  },
  [TUTORIAL_STEPS.PRACTICE_FIST]: {
    title: 'Try It: Make a Fist ✊',
    description: 'Close your hand into a fist to pause gesture detection. This prevents accidental triggers.',
    position: 'right',
    highlight: 'camera',
    icon: Hand,
  },
  [TUTORIAL_STEPS.PRACTICE_POINTER]: {
    title: 'Try It: Point Your Finger ☝️',
    description: 'Extend only your index finger to activate the pointer mode on your slides.',
    position: 'right',
    highlight: 'camera',
    icon: Hand,
  },
  [TUTORIAL_STEPS.PRACTICE_SWIPE]: {
    title: 'Try It: Swipe to Navigate 👋',
    description: 'Open your palm and swipe left or right to change slides.',
    position: 'right',
    highlight: 'camera',
    icon: Hand,
  },
  [TUTORIAL_STEPS.COMPLETED]: {
    title: 'You\'re Ready! 🎉',
    description: 'Great job! You now know how to use gesture controls. Have a great presentation!',
    position: 'center',
    highlight: null,
    icon: CheckCircle2,
  },
};

export default function TutorialOverlay({ gesture, onStartCamera, cameraActive, hasPdf, onFileSelect }) {
  const {
    isActive,
    currentStep,
    progress,
    isPracticeStep,
    skipTutorial,
    nextStep,
    practiceSuccess,
    markPracticeSuccess,
  } = useTutorial();

  // Auto-detect practice completion
  useEffect(() => {
    if (!isActive || !cameraActive) return;

    const gestureName = gesture?.name;

    if (currentStep === TUTORIAL_STEPS.PRACTICE_FIST && gestureName === 'PAUSED') {
      markPracticeSuccess('fist');
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_POINTER && gestureName === 'READY') {
      markPracticeSuccess('pointer');
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_SWIPE &&
      (gestureName === 'SWIPE_LEFT' || gestureName === 'SWIPE_RIGHT')) {
      markPracticeSuccess('swipe');
    }
  }, [gesture?.name, currentStep, isActive, cameraActive, markPracticeSuccess]);

  // Auto-advance when step requirement is met
  useEffect(() => {
    if (!isActive) return;

    let canAdvance = false;

    if (currentStep === TUTORIAL_STEPS.UPLOAD_PDF && hasPdf) {
      canAdvance = true;
    } else if (currentStep === TUTORIAL_STEPS.ENABLE_CAMERA && cameraActive) {
      canAdvance = true;
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_FIST && practiceSuccess.fist) {
      canAdvance = true;
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_POINTER && practiceSuccess.pointer) {
      canAdvance = true;
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_SWIPE && practiceSuccess.swipe) {
      canAdvance = true;
    }

    if (canAdvance) {
      const timer = setTimeout(() => nextStep(), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, hasPdf, cameraActive, practiceSuccess, isActive, nextStep]);

  if (!isActive) return null;

  const config = stepConfig[currentStep];
  const isFirstStep = currentStep === TUTORIAL_STEPS.WELCOME;
  const isLastStep = currentStep === TUTORIAL_STEPS.COMPLETED;
  const Icon = config.icon;

  // Get requirement status for current step
  const getRequirementStatus = () => {
    switch (currentStep) {
      case TUTORIAL_STEPS.UPLOAD_PDF:
        return hasPdf;
      case TUTORIAL_STEPS.ENABLE_CAMERA:
        return cameraActive;
      case TUTORIAL_STEPS.PRACTICE_FIST:
        return practiceSuccess.fist;
      case TUTORIAL_STEPS.PRACTICE_POINTER:
        return practiceSuccess.pointer;
      case TUTORIAL_STEPS.PRACTICE_SWIPE:
        return practiceSuccess.swipe;
      default:
        return true;
    }
  };

  const isComplete = getRequirementStatus();

  // Position classes
  const getPositionClasses = () => {
    switch (config.position) {
      case 'left':
        return 'left-8 top-1/2 -translate-y-1/2';
      case 'right':
        return 'right-8 top-1/3';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Subtle darkened backdrop for welcome/completed */}
        {(isFirstStep || isLastStep) && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" />
        )}

        {/* Floating Tooltip Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`absolute ${getPositionClasses()} w-80 pointer-events-auto`}
        >
          <div className={`
            glass-strong rounded-2xl overflow-hidden shadow-2xl
            ${isComplete && isPracticeStep
              ? 'border-emerald-500/30'
              : ''
            }
          `}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${isComplete && isPracticeStep
                    ? 'bg-emerald-500/20'
                    : 'bg-white/10'
                  }
                `}>
                  {isComplete && isPracticeStep ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : Icon ? (
                    <Icon className="w-5 h-5 text-white/80" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white/80" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Tutorial</p>
                  <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-white/60"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <motion.button
                onClick={skipTutorial}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-display font-medium text-white text-lg mb-2">
                {config.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {config.description}
              </p>

              {/* Action indicator */}
              {isPracticeStep && (
                <div className={`
                  mt-4 p-3 rounded-xl border text-center
                  ${isComplete
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-white/5 border-white/10'
                  }
                `}>
                  <p className={`text-sm font-medium ${isComplete ? 'text-emerald-400' : 'text-white/70'}`}>
                    {isComplete ? '✓ Great job!' : 'Show me the gesture...'}
                  </p>
                </div>
              )}

              {/* CTA Button for specific steps */}
              {currentStep === TUTORIAL_STEPS.ENABLE_CAMERA && !cameraActive && (
                <motion.button
                  onClick={onStartCamera}
                  className="mt-4 w-full py-2.5 px-4 rounded-full bg-white text-black font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4" />
                  <span>Enable Camera</span>
                </motion.button>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={skipTutorial}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Skip
              </button>

              {(isFirstStep || isLastStep || isComplete) && (
                <motion.button
                  onClick={isLastStep ? skipTutorial : nextStep}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 text-white font-medium text-xs transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{isLastStep ? 'Finish' : isFirstStep ? 'Start' : 'Next'}</span>
                  {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
                </motion.button>
              )}
            </div>
          </div>

          {/* Arrow pointing to highlighted element */}
          {config.highlight && config.position !== 'center' && (
            <div className={`
              absolute top-1/2 -translate-y-1/2
              ${config.position === 'left' ? '-right-6' : '-left-6'}
            `}>
              <ArrowRight className={`
                w-5 h-5 text-emerald-400 animate-pulse
                ${config.position === 'left' ? '' : 'rotate-180'}
              `} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
