import { useState, useCallback, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { PdfViewer } from './components/PdfViewer';
import { GestureCamera } from './components/GestureCamera';
import { SwipeIndicator } from './components/SwipeIndicator';
import RemoteQRCode from './components/RemoteQRCode';
import { useGesture } from './hooks/useGesture';
import { usePdfViewer } from './hooks/usePdfViewer';
import { useRemoteSession } from './hooks/useRemoteSession';
import { BackgroundParticles } from './components/BackgroundParticles';
import RemotePage from './pages/RemotePage';
import { TutorialProvider, useTutorial } from './contexts/TutorialContext';
import TutorialOverlay from './components/tutorial/TutorialOverlay';
import { Sparkles, Zap, Shield, Upload, Camera, Presentation, Play, X, GraduationCap, ArrowLeft, ChevronDown } from 'lucide-react';

// Kinetic Text Component
const KineticText = ({ text, className = '' }) => {
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`inline-block ${className}`}
    >
      {text.split('').map((char, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block cursor-default"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{
            scale: 1.2,
            rotate: Math.random() * 10 - 5,
            y: -5,
            color: '#fff',
            textShadow: '0 0 8px rgba(255,255,255,0.5)',
            transition: { duration: 0.2 }
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

function MainApp() {
  const [swipeIndicator, setSwipeIndicator] = useState({ visible: false, direction: null });
  const [slideDirection, setSlideDirection] = useState('next');
  const [pointerColor, setPointerColor] = useState('#10b981'); // Default Emerald
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationStarted, setIsPresentationStarted] = useState(false);
  const viewerContainerRef = useRef(null);

  const { isActive: tutorialActive, startTutorial } = useTutorial();

  const {
    pageImage,
    currentPage,
    totalPages,
    isLoading: pdfLoading,
    error: pdfError,
    fileName,
    loadPdf,
    nextPage,
    prevPage,
  } = usePdfViewer();

  const handleSwipeLeft = useCallback(() => {
    setSlideDirection('prev');
    prevPage();
    setSwipeIndicator({ visible: true, direction: 'left' });
    setTimeout(() => setSwipeIndicator({ visible: false, direction: null }), 800);
  }, [prevPage]);

  const handleSwipeRight = useCallback(() => {
    setSlideDirection('next');
    nextPage();
    setSwipeIndicator({ visible: true, direction: 'right' });
    setTimeout(() => setSwipeIndicator({ visible: false, direction: null }), 800);
  }, [nextPage]);

  const handlePause = useCallback(() => { }, []);

  const handleRemoteCommand = useCallback((action) => {
    if (action === 'next') {
      setSlideDirection('next');
      nextPage();
      setSwipeIndicator({ visible: true, direction: 'right' });
      setTimeout(() => setSwipeIndicator({ visible: false, direction: null }), 800);
    } else if (action === 'prev') {
      setSlideDirection('prev');
      prevPage();
      setSwipeIndicator({ visible: true, direction: 'left' });
      setTimeout(() => setSwipeIndicator({ visible: false, direction: null }), 800);
    }
  }, [nextPage, prevPage]);

  const {
    sessionId,
    isConnected: remoteIsConnected,
    remoteConnected,
    isEnabled: remoteEnabled,
    toggleRemoteMode,
  } = useRemoteSession({
    onCommand: handleRemoteCommand,
    currentPage,
    totalPages,
  });

  const {
    videoRef,
    isActive: cameraActive,
    gesture,
    pointer,
    error: cameraError,
    start: startCamera,
    stop: stopCamera,
  } = useGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onPause: handlePause,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSlideDirection('prev');
        prevPage();
      } else if (e.key === 'ArrowRight') {
        setSlideDirection('next');
        nextPage();
      } else if (e.key === 'Escape' && isPresentationStarted && !isFullscreen) {
        setIsPresentationStarted(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPage, nextPage, isPresentationStarted, isFullscreen]);

  const handlePrevPage = useCallback(() => {
    setSlideDirection('prev');
    prevPage();
  }, [prevPage]);

  const handleNextPage = useCallback(() => {
    setSlideDirection('next');
    nextPage();
  }, [nextPage]);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Use documentElement for true fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error(`Error attempting to toggle fullscreen: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-open presentation mode when tutorial starts
  useEffect(() => {
    if (tutorialActive && !isPresentationStarted) {
      setIsPresentationStarted(true);
    }
  }, [tutorialActive, isPresentationStarted]);

  const features = [
    { step: '01', title: 'Upload PDF', desc: 'Drag and drop or click to upload your presentation. Supports all PDF formats.', icon: Upload, color: 'aurora-cyan' },
    { step: '02', title: 'Enable Camera', desc: 'Start your webcam for gesture detection. All processing stays on your device.', icon: Camera, color: 'aurora-purple' },
    { step: '03', title: 'Present!', desc: 'Control your slides with natural hand gestures. Swipe to navigate seamlessly.', icon: Presentation, color: 'aurora-pink' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <BackgroundParticles />

      <Header />

      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Always visible when not in presentation mode */}
          {!isPresentationStarted && !isFullscreen && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center pt-20 pb-24">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white/70 font-medium">AI-Powered Control</span>
              </motion.div>

              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                <KineticText text="Control Slides with" className="text-white/90 text-aura" />
                <br />
                <KineticText text="Hand Gestures" className="text-white pb-2 text-aura" />
              </h2>

              <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14">
                Experience the future of presentations. Navigate your slides naturally with intuitive hand movements - no clicker needed.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  { icon: Zap, label: 'Real-time Detection' },
                  { icon: Shield, label: '100% Private' },
                  { icon: Sparkles, label: 'Computer Vision' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                  >
                    <item.icon className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="flex items-center gap-4">
                  {/* Primary Button - White */}
                  <motion.button
                    onClick={() => setIsPresentationStarted(true)}
                    className="btn-primary flex items-center gap-2 text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Free</span>
                  </motion.button>

                  {/* Secondary Button - Outline */}
                  {!tutorialActive && (
                    <motion.button
                      onClick={startTutorial}
                      className="btn-secondary flex items-center gap-2 text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                      <span>Tutorial</span>
                    </motion.button>
                  )}
                </div>

                {/* How It Works link */}
                <motion.a
                  href="#how-it-works"
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm"
                  whileHover={{ y: 2 }}
                >
                  <span>How It Works</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.a>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.2 }}
                className="mt-24 flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-5 h-9 rounded-full border border-white/20 flex items-center justify-center p-1.5"
                >
                  <div className="w-1 h-2 rounded-full bg-white/40" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Presentation Mode - Modal/Overlay with actual UI */}
          <AnimatePresence>
            {(isPresentationStarted || isFullscreen) && (
              <>
                {/* Backdrop - only show when not fullscreen */}
                {!isFullscreen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                  />
                )}

                {/* Presentation UI Container */}
                <motion.div
                  ref={viewerContainerRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${isFullscreen
                    ? 'fixed inset-0 z-50 bg-dark-950'
                    : 'fixed inset-4 md:inset-8 z-50 glass-strong rounded-3xl overflow-hidden'}`}
                >
                  {/* Close/Back Button - only show when not fullscreen */}
                  {!isFullscreen && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => {
                        setIsPresentationStarted(false);
                        stopCamera();
                      }}
                      className="absolute top-5 right-5 z-[60] text-white/40 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  )}

                  {/* Main Content Grid */}
                  <div className={`h-full ${isFullscreen ? 'p-0' : 'p-6 pt-16'}`}>
                    <div className={`h-full grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
                      {/* PDF Viewer */}
                      <div className={`${isFullscreen ? 'h-full w-full' : 'lg:col-span-2 h-full'}`}>
                        <div className={`h-full ${isFullscreen ? '' : 'glass-panel rounded-2xl p-6 relative overflow-hidden'}`}>
                          {/* Add subtle noise or gradient to panel background if needed */}
                          <PdfViewer
                            pageImage={pageImage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            isLoading={pdfLoading}
                            error={pdfError}
                            fileName={fileName}
                            onFileSelect={loadPdf}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            slideDirection={slideDirection}
                            isFullscreen={isFullscreen}
                            onToggleFullscreen={handleToggleFullscreen}
                            pointer={pointer}
                            pointerColor={pointerColor}
                            onSetPointerColor={setPointerColor}
                          />
                        </div>
                      </div>

                      {/* Sidebar - Camera, Remote, Tips - Only show when NOT fullscreen */}
                      {!isFullscreen && (
                        <div className="lg:col-span-1 flex flex-col gap-1.5 h-full overflow-hidden">
                          {/* Gesture Camera */}
                          <div className="flex-shrink-0">
                            <GestureCamera
                              videoRef={videoRef}
                              isActive={cameraActive}
                              gesture={gesture}
                              error={cameraError}
                              onStart={startCamera}
                              onStop={stopCamera}
                              isMini={false}
                            />
                          </div>

                          {/* Remote QR Code */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex-shrink-0 glass-panel rounded-xl p-2.5"
                          >
                            <RemoteQRCode
                              sessionId={sessionId}
                              isConnected={remoteIsConnected}
                              remoteConnected={remoteConnected}
                              isEnabled={remoteEnabled}
                              onToggle={toggleRemoteMode}
                            />
                          </motion.div>

                          {/* Quick Tips */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 glass-panel rounded-xl p-4 flex flex-col min-h-0"
                          >
                            <h3 className="font-display font-medium text-white mb-2 flex items-center gap-2 text-sm shrink-0">
                              <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                                <Zap className="w-3 h-3 text-white/80" />
                              </div>
                              Quick Tips
                            </h3>
                            <ul className="flex-1 flex flex-col justify-between py-2">
                              {[
                                'Make a Fist ✊ after swipe to reset position (Best Flow)',
                                'Swipe open palm 👋 to change slides',
                                'Point index finger ☝️ to use laser pointer'
                              ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 text-white/60">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0 mt-1.5" />
                                  <span className="text-xs leading-relaxed">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mini Camera in Fullscreen - Separate from grid */}
                  {isFullscreen && (
                    <div className="fixed bottom-6 right-6 w-72 z-[70]">
                      <GestureCamera
                        videoRef={videoRef}
                        isActive={cameraActive}
                        gesture={gesture}
                        error={cameraError}
                        onStart={startCamera}
                        onStop={stopCamera}
                        isMini={true}
                      />
                    </div>
                  )}

                  <SwipeIndicator direction={swipeIndicator.direction} isVisible={swipeIndicator.visible} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Tutorial Overlay */}
          <TutorialOverlay
            gesture={gesture}
            onStartCamera={startCamera}
            cameraActive={cameraActive}
            hasPdf={!!pageImage}
            onFileSelect={loadPdf}
          />

          {/* How It Works Section - Only show when not in presentation mode */}
          {!isPresentationStarted && !isFullscreen && (
            <motion.section
              id="how-it-works"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-[15vh] pb-20"
            >
              <div className="text-center mb-16">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Simple Setup</span>
                </motion.div>
                <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-4xl md:text-5xl font-bold text-white mb-4">How It Works</motion.h3>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/50 max-w-2xl mx-auto text-lg">
                  Get started in seconds. Our AI-powered system translates your hand movements into seamless presentation controls.
                </motion.p>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {features.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }} className="group relative">
                    <div className="relative bg-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                      <span className="absolute top-6 right-8 font-mono text-5xl font-bold text-white/5 group-hover:text-white/10 transition-colors">{item.step}</span>
                      <div className="relative w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-white/5 border border-white/10">
                        <item.icon className="w-6 h-6 text-white/70" />
                      </div>
                      <h4 className="font-display font-semibold text-white text-lg mb-2">{item.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {!isPresentationStarted && !isFullscreen && (
        <footer className="relative z-10 py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center"><Presentation className="w-4 h-4 text-white" /></div>
                <span className="font-display font-medium text-white/80">GesturePresenter</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>Built with</span>
                  {['React', 'MediaPipe', 'PDF.js'].map((tech, i) => (<span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50">{tech}</span>))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40"><Shield className="w-4 h-4 text-emerald-400/70" /><span>100% Private - All processing happens locally</span></div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TutorialProvider>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/remote/:sessionId" element={<RemotePage />} />
        </Routes>
      </TutorialProvider>
    </BrowserRouter>
  );
}

export default App;
