import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TutorialContext = createContext(null);

// Tutorial Steps Definition
export const TUTORIAL_STEPS = {
  WELCOME: 'welcome',
  UPLOAD_PDF: 'upload_pdf',
  ENABLE_CAMERA: 'enable_camera',
  PRACTICE_FIST: 'practice_fist',
  PRACTICE_POINTER: 'practice_pointer',
  PRACTICE_SWIPE: 'practice_swipe',
  COMPLETED: 'completed',
};

const STEP_ORDER = [
  TUTORIAL_STEPS.WELCOME,
  TUTORIAL_STEPS.UPLOAD_PDF,
  TUTORIAL_STEPS.ENABLE_CAMERA,
  TUTORIAL_STEPS.PRACTICE_FIST,
  TUTORIAL_STEPS.PRACTICE_POINTER,
  TUTORIAL_STEPS.PRACTICE_SWIPE,
  TUTORIAL_STEPS.COMPLETED,
];

const STORAGE_KEY = 'gesture-presenter-tutorial';

export function TutorialProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(TUTORIAL_STEPS.WELCOME);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [practiceSuccess, setPracticeSuccess] = useState({
    fist: false,
    pointer: false,
    swipe: false,
  });
  const [highlightTarget, setHighlightTarget] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.hasCompletedTutorial) {
          setHasCompleted(true);
          setIsActive(false);
        } else if (data.currentStep) {
          setCurrentStep(data.currentStep);
          setCompletedSteps(data.completedSteps || []);
        }
      }
    } catch (e) {
      console.error('Failed to load tutorial state:', e);
    }
  }, []);

  // Save state to localStorage
  const saveState = useCallback((completed = false) => {
    try {
      if (completed) setHasCompleted(true);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        hasCompletedTutorial: completed,
        currentStep,
        completedSteps,
      }));
    } catch (e) {
      console.error('Failed to save tutorial state:', e);
    }
  }, [currentStep, completedSteps]);

  // Start tutorial
  const startTutorial = useCallback(() => {
    setIsActive(true);
    setCurrentStep(TUTORIAL_STEPS.WELCOME);
    setCompletedSteps([]);
    setPracticeSuccess({ fist: false, pointer: false, swipe: false });
    setHighlightTarget(null);
  }, []);

  // Skip/Close tutorial
  const skipTutorial = useCallback(() => {
    setIsActive(false);
    saveState(true);
  }, [saveState]);

  // Go to next step
  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const newStep = STEP_ORDER[currentIndex + 1];
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(newStep);

      // If completed
      if (newStep === TUTORIAL_STEPS.COMPLETED) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          saveState(true);
        }, 3000);
      }
    }
  }, [currentStep, saveState]);

  // Go to previous step
  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((step) => {
    if (STEP_ORDER.includes(step)) {
      setCurrentStep(step);
    }
  }, []);

  // Mark practice as successful
  const markPracticeSuccess = useCallback((type) => {
    setPracticeSuccess(prev => ({ ...prev, [type]: true }));
  }, []);

  // Reset practice for current step
  const resetPractice = useCallback(() => {
    if (currentStep === TUTORIAL_STEPS.PRACTICE_FIST) {
      setPracticeSuccess(prev => ({ ...prev, fist: false }));
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_POINTER) {
      setPracticeSuccess(prev => ({ ...prev, pointer: false }));
    } else if (currentStep === TUTORIAL_STEPS.PRACTICE_SWIPE) {
      setPracticeSuccess(prev => ({ ...prev, swipe: false }));
    }
  }, [currentStep]);

  // Calculate progress percentage
  const progress = Math.round(
    (STEP_ORDER.indexOf(currentStep) / (STEP_ORDER.length - 1)) * 100
  );

  // Check if a step is practice step
  const isPracticeStep = [
    TUTORIAL_STEPS.PRACTICE_FIST,
    TUTORIAL_STEPS.PRACTICE_POINTER,
    TUTORIAL_STEPS.PRACTICE_SWIPE,
  ].includes(currentStep);

  const value = {
    isActive,
    hasCompleted,
    currentStep,
    completedSteps,
    practiceSuccess,
    highlightTarget,
    showCelebration,
    progress,
    isPracticeStep,
    startTutorial,
    skipTutorial,
    nextStep,
    prevStep,
    goToStep,
    markPracticeSuccess,
    resetPractice,
    setHighlightTarget,
    setIsActive,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
