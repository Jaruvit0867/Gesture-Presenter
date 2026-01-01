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

function MainApp() {
  const [swipeIndicator, setSwipeIndicator] = useState({ visible: false, direction: null });
  const [slideDirection, setSlideDirection] = useState('next');
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

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-orb w-[600px] h-[600px] bg-aurora-cyan/20 -top-[20%] -left-[10%]" style={{ animationDelay: '0s' }} />
        <div className="aurora-orb w-[500px] h-[500px] bg-aurora-purple/20 top-[30%] -right-[15%]" style={{ animationDelay: '5s' }} />
        <div className="aurora-orb w-[400px] h-[400px] bg-aurora-pink/15 -bottom-[10%] left-[20%]" style={{ animationDelay: '10s' }} />
      </div>

      <Header />

      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Always visible when not in presentation mode */}
          {!isPresentationStarted && !isFullscreen && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center pt-16 pb-20">

              <h2 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tight mb-8 leading-tight">
                Control Slides with<br /><span className="gradient-text">Hand Gestures</span>
              </h2>

              <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
                Experience the future of presentations. Navigate your slides naturally with intuitive hand movements - no clicker needed.
              </p>

              <div className="flex flex-wrap justify-center gap-5 mb-14">
                {[
                  { icon: Zap, label: 'Real-time Detection', color: 'aurora-cyan' },
                  { icon: Shield, label: '100% Private', color: 'aurora-emerald' },
                  { icon: Sparkles, label: 'Computer Vision', color: 'aurora-purple' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-dark-800/60 border border-dark-600/50 backdrop-blur-sm">
                    <item.icon className={`w-5 h-5 text-${item.color}`} />
                    <span className="text-base text-slate-300 font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Start Presentation & Tutorial Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Main buttons row */}
                <div className="flex items-center gap-5">
                  {/* Start Presentation Button */}
                  <motion.button
                    onClick={() => setIsPresentationStarted(true)}
                    className="group relative flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-aurora-cyan via-neon-primary to-aurora-purple text-white font-bold text-xl overflow-hidden shadow-xl shadow-aurora-purple/20"
                    whileHover={{ scale: 1.03, boxShadow: '0 25px 50px rgba(99, 102, 241, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                    <span className="relative">Start Presentation</span>
                    <Sparkles className="w-6 h-6 relative opacity-70" />
                  </motion.button>

                  {/* Tutorial Button */}
                  {!tutorialActive && (
                    <motion.button
                      onClick={startTutorial}
                      className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-aurora-purple/10 border-2 border-aurora-purple/30 text-aurora-purple hover:bg-aurora-purple/20 transition-all font-bold text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GraduationCap className="w-6 h-6" />
                      <span>Tutorial</span>
                    </motion.button>
                  )}
                </div>

                {/* How It Works button */}
                <motion.a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-800/80 border border-dark-600 hover:border-aurora-cyan/50 hover:bg-dark-700/80 text-slate-300 hover:text-aurora-cyan transition-all font-medium"
                  whileHover={{ scale: 1.02, y: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>How It Works</span>
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </motion.a>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.2 }}
                className="mt-20 flex flex-col items-center gap-3"
              >
                <span className="text-sm text-slate-500 uppercase tracking-widest">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1.5"
                >
                  <div className="w-2 h-3 rounded-full bg-slate-500" />
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
                    className="fixed inset-0 z-40 bg-dark-950/90 backdrop-blur-sm"
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
                    : 'fixed inset-4 md:inset-8 z-50 glass-strong rounded-3xl border border-aurora-purple/30 overflow-hidden'}`}
                >
                  {/* Close/Back Button - only show when not fullscreen */}
                  {!isFullscreen && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setIsPresentationStarted(false)}
                      className="absolute top-6 left-6 z-[60] flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800/80 border border-dark-700/50 text-slate-300 hover:text-white hover:bg-dark-700/80 transition-all backdrop-blur-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Back</span>
                    </motion.button>
                  )}

                  {/* Main Content Grid */}
                  <div className={`h-full ${isFullscreen ? 'p-0' : 'p-6 pt-16'}`}>
                    <div className={`h-full grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
                      {/* PDF Viewer */}
                      <div className={`${isFullscreen ? 'h-full w-full' : 'lg:col-span-2 h-full'}`}>
                        <div className={`h-full ${isFullscreen ? '' : 'glass rounded-2xl p-6 border border-dark-700/50'}`}>
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
                          />
                        </div>
                      </div>

                      {/* Sidebar - Camera, Remote, Tips - Only show when NOT fullscreen */}
                      {!isFullscreen && (
                        <div className="lg:col-span-1 flex flex-col gap-3 overflow-y-auto max-h-full">
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
                            className="flex-shrink-0 glass rounded-xl p-4 border border-dark-700/50"
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
                            className="flex-shrink-0 glass rounded-xl p-4 border border-dark-700/50"
                          >
                            <h3 className="font-display font-bold text-white mb-2 flex items-center gap-2 text-sm">
                              <div className="w-5 h-5 rounded-md bg-aurora-cyan/10 flex items-center justify-center">
                                <Zap className="w-3 h-3 text-aurora-cyan" />
                              </div>
                              Quick Tips
                            </h3>
                            <ul className="space-y-1.5">
                              {['Arrow keys for manual control', 'Fist gesture to pause', 'Point finger for pointer'].map((tip, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-aurora-cyan flex-shrink-0" />
                                  <span className="text-xs">{tip}</span>
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
              className="mt-[15vh]"
            >
              <div className="text-center mb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-aurora-purple/20 mb-6">
                  <span className="text-xs font-medium text-aurora-purple uppercase tracking-wider">Simple Setup</span>
                </motion.div>
                <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-4xl md:text-5xl font-bold text-white mb-4">How It Works</motion.h3>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-2xl mx-auto text-lg">
                  Get started in seconds. Our AI-powered system translates your hand movements into seamless presentation controls.
                </motion.p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {features.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }} className="group relative">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${item.color}/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />
                    <div className="relative glass rounded-3xl p-8 border border-dark-700/50 group-hover:border-aurora-cyan/20 transition-all duration-500 h-full">
                      <span className="absolute top-6 right-8 font-mono text-6xl font-bold text-dark-700 group-hover:text-dark-600 transition-colors">{item.step}</span>
                      <div className={`relative w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-${item.color}/10 border border-${item.color}/20 group-hover:scale-110 transition-transform duration-500`}>
                        <item.icon className={`w-8 h-8 text-${item.color}`} />
                      </div>
                      <h4 className="font-display font-bold text-white text-xl mb-3">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {!isPresentationStarted && !isFullscreen && (
        <footer className="relative z-10 py-16 border-t border-dark-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center"><Presentation className="w-5 h-5 text-white" /></div>
                <div><p className="font-display font-bold text-white">GesturePresenter</p><p className="text-xs text-slate-500">Gesture Control</p></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Built with</span>
                  <div className="flex items-center gap-2">
                    {['React', 'MediaPipe', 'PDF.js'].map((tech, i) => (<span key={i} className="px-2 py-1 rounded-md bg-dark-800 border border-dark-700 text-slate-400">{tech}</span>))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Shield className="w-4 h-4 text-aurora-emerald" /><span>100% Private - All processing happens locally</span></div>
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
