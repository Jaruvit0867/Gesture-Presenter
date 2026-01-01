import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial, TUTORIAL_STEPS } from '../../contexts/TutorialContext';
import { X, ChevronRight, ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';
import TutorialWelcome from './steps/TutorialWelcome';
import TutorialUpload from './steps/TutorialUpload';
import TutorialCamera from './steps/TutorialCamera';
import TutorialPracticeFist from './steps/TutorialPracticeFist';
import TutorialPracticePointer from './steps/TutorialPracticePointer';
import TutorialPracticeSwipe from './steps/TutorialPracticeSwipe';
import TutorialCompleted from './steps/TutorialCompleted';

const stepComponents = {
  [TUTORIAL_STEPS.WELCOME]: TutorialWelcome,
  [TUTORIAL_STEPS.UPLOAD_PDF]: TutorialUpload,
  [TUTORIAL_STEPS.ENABLE_CAMERA]: TutorialCamera,
  [TUTORIAL_STEPS.PRACTICE_FIST]: TutorialPracticeFist,
  [TUTORIAL_STEPS.PRACTICE_POINTER]: TutorialPracticePointer,
  [TUTORIAL_STEPS.PRACTICE_SWIPE]: TutorialPracticeSwipe,
  [TUTORIAL_STEPS.COMPLETED]: TutorialCompleted,
};

const stepTitles = {
  [TUTORIAL_STEPS.WELCOME]: 'Welcome',
  [TUTORIAL_STEPS.UPLOAD_PDF]: 'Upload Presentation',
  [TUTORIAL_STEPS.ENABLE_CAMERA]: 'Enable Camera',
  [TUTORIAL_STEPS.PRACTICE_FIST]: 'Practice: Pause',
  [TUTORIAL_STEPS.PRACTICE_POINTER]: 'Practice: Pointer',
  [TUTORIAL_STEPS.PRACTICE_SWIPE]: 'Practice: Swipe',
  [TUTORIAL_STEPS.COMPLETED]: 'All Done!',
};

export default function TutorialOverlay({ gesture, onStartCamera, cameraActive, hasPdf, onFileSelect }) {
  const {
    isActive,
    currentStep,
    progress,
    isPracticeStep,
    skipTutorial,
    nextStep,
    prevStep,
    resetPractice,
    practiceSuccess,
  } = useTutorial();

  if (!isActive) return null;

  const StepComponent = stepComponents[currentStep];
  const isFirstStep = currentStep === TUTORIAL_STEPS.WELCOME;
  const isLastStep = currentStep === TUTORIAL_STEPS.COMPLETED;

  // Determine if next is allowed based on current step requirements
  const canProceed = () => {
    switch (currentStep) {
      case TUTORIAL_STEPS.WELCOME:
        return true;
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Semi-transparent backdrop */}
        <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm pointer-events-auto" />

        {/* Tutorial Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-auto"
        >
          <div className="glass-strong rounded-3xl border border-aurora-cyan/20 overflow-hidden shadow-2xl shadow-aurora-cyan/10">
            {/* Header */}
            <div className="px-6 py-4 border-b border-dark-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">
                    Interactive Tutorial
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {stepTitles[currentStep]}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-purple"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {progress}%
                </span>

                {/* Close button */}
                <motion.button
                  onClick={skipTutorial}
                  className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-aurora-pink/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepComponent
                    gesture={gesture}
                    onStartCamera={onStartCamera}
                    cameraActive={cameraActive}
                    hasPdf={hasPdf}
                    onFileSelect={onFileSelect}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with navigation */}
            {!isLastStep && (
              <div className="px-6 py-4 border-t border-dark-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Back button */}
                  {!isFirstStep && (
                    <motion.button
                      onClick={prevStep}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-slate-400 hover:text-white hover:border-aurora-cyan/30 transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </motion.button>
                  )}

                  {/* Reset practice button */}
                  {isPracticeStep && (
                    <motion.button
                      onClick={resetPractice}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-slate-400 hover:text-aurora-purple hover:border-aurora-purple/30 transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Skip text */}
                  <button
                    onClick={skipTutorial}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Skip tutorial
                  </button>

                  {/* Next button */}
                  <motion.button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`
                      flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                      ${canProceed()
                        ? 'bg-gradient-to-r from-aurora-cyan to-aurora-purple text-white shadow-lg shadow-aurora-cyan/20 hover:shadow-aurora-cyan/40'
                        : 'bg-dark-800 text-slate-500 cursor-not-allowed border border-dark-700'
                      }
                    `}
                    whileHover={canProceed() ? { scale: 1.02 } : {}}
                    whileTap={canProceed() ? { scale: 0.98 } : {}}
                  >
                    <span>{isPracticeStep && !canProceed() ? 'Complete to Continue' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
