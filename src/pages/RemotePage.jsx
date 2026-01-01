import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Wifi, WifiOff, Smartphone, Presentation, Loader2, AlertCircle } from 'lucide-react';
import { useRemoteController } from '../hooks/useRemoteSession';
import { BackgroundParticles } from '../components/BackgroundParticles';

const RemotePage = () => {
  const { sessionId } = useParams();
  const { isConnected, presenterConnected, currentPage, totalPages, sendCommand, connectionError } = useRemoteController(sessionId);
  const [lastAction, setLastAction] = useState(null);

  const triggerHaptic = (pattern = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = { light: [10], medium: [20], heavy: [30], success: [10, 50, 10] };
      navigator.vibrate(patterns[pattern] || patterns.light);
    }
  };

  const handlePrev = () => {
    sendCommand('prev');
    setLastAction('prev');
    triggerHaptic('medium');
    setTimeout(() => setLastAction(null), 300);
  };

  const handleNext = () => {
    sendCommand('next');
    setLastAction('next');
    triggerHaptic('medium');
    setTimeout(() => setLastAction(null), 300);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    if (presenterConnected) triggerHaptic('success');
  }, [presenterConnected]);

  if (!isConnected && !connectionError) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <BackgroundParticles />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/70 font-medium">Connecting to Session...</p>
          <p className="text-white/30 text-xs mt-2 font-mono tracking-wider">{sessionId}</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <BackgroundParticles />
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-display font-bold mb-2">Connection Failed</h3>
          <p className="text-white/50 text-sm mb-8">{connectionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col select-none touch-none relative overflow-hidden text-white">
      <BackgroundParticles />

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-dark-950/50 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm leading-tight">Remote Control</h1>
            <p className="text-white/30 text-[10px] font-mono tracking-wider">ID: {sessionId}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors duration-300
          ${presenterConnected
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
          {presenterConnected ? (
            <><Wifi className="w-3 h-3" /><span>Linked</span></>
          ) : (
            <><Loader2 className="w-3 h-3 animate-spin" /><span>Syncing...</span></>
          )}
        </div>
      </motion.header>

      {/* Main Controls */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 gap-8">

        {/* Slide Counter */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-baseline justify-center gap-1.5">
            <span className="text-6xl font-display font-bold text-white tracking-tight">
              {currentPage || '-'}
            </span>
            <span className="text-2xl text-white/20 font-light">/</span>
            <span className="text-2xl text-white/40 font-medium">{totalPages || '-'}</span>
          </div>
          <p className="text-white/30 text-xs uppercase tracking-widest mt-2 font-medium">Slide Number</p>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          className="w-full max-w-sm grid grid-cols-2 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handlePrev}
            disabled={!presenterConnected}
            className={`group relative h-40 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300
              ${!presenterConnected
                ? 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
                : 'glass-panel hover:bg-white/10 active:scale-95 border-white/10'
              }`}
          >
            <ChevronLeft className={`w-12 h-12 transition-transform duration-300 ${presenterConnected ? 'group-active:-translate-x-1 text-white' : ''}`} />
            <span className="font-medium">Previous</span>
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!presenterConnected}
            className={`group relative h-40 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300
              ${!presenterConnected
                ? 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed'
                : 'glass-panel hover:bg-white/10 active:scale-95 border-white/10'
              }`}
          >
            <ChevronRight className={`w-12 h-12 transition-transform duration-300 ${presenterConnected ? 'group-active:translate-x-1 text-white' : ''}`} />
            <span className="font-medium">Next</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Visual Feedback Overlay */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/5 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
            >
              {lastAction === 'prev' ? <ChevronLeft className="w-16 h-16 text-white" /> : <ChevronRight className="w-16 h-16 text-white" />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="relative z-10 py-6 text-center text-white/30 text-xs font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        GesturePresenter Remote
      </motion.footer>
    </div>
  );
};

export default RemotePage;
