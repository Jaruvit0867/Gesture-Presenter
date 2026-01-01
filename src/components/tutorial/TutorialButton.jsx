import { motion } from 'framer-motion';
import { HelpCircle, GraduationCap } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';

export default function TutorialButton() {
  const { isActive, startTutorial } = useTutorial();

  if (isActive) return null;

  return (
    <motion.button
      onClick={startTutorial}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-aurora-purple/10 border border-aurora-purple/20 text-aurora-purple hover:bg-aurora-purple/20 transition-all text-sm"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <GraduationCap className="w-4 h-4" />
      <span className="font-medium">Tutorial</span>
    </motion.button>
  );
}
