import { useCallback, useRef, memo } from 'react';
import { Upload, ChevronLeft, ChevronRight, FileText, Loader2, Maximize2, Minimize2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Separate component for the pointer to isolate re-renders
const VisualPointer = memo(({ pointer, color = '#10b981' }) => { // Default to Emerald
  if (!pointer?.isActive) return null;

  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${pointer.x * 100}%`,
        top: `${pointer.y * 100}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-4 rounded-full blur-xl animate-pulse"
        style={{ backgroundColor: `${color}20` }} // 12% opacity
      />

      {/* Main pointer */}
      <div
        className="relative w-8 h-8 -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60"
          style={{ backgroundColor: `${color}40` }}
        />

        {/* Core */}
        <div
          className="absolute inset-1 rounded-full border backdrop-blur-sm"
          style={{
            backgroundColor: `${color}20`,
            borderColor: `${color}80`
          }}
        />

        {/* Center dot */}
        <div
          className="absolute inset-[10px] rounded-full shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}80`
          }}
        />
      </div>
    </motion.div>
  );
});

// Component for the PDF image itself to isolate it from pointer updates
const SlideArea = memo(({ pageImage, currentPage, slideDirection }) => {
  return (
    <AnimatePresence mode="wait">
      {pageImage && (
        <motion.div
          key={currentPage}
          initial={{
            opacity: 0,
            x: slideDirection === 'next' ? 40 : -40,
            scale: 0.98,
            filter: 'blur(4px)'
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)'
          }}
          exit={{
            opacity: 0,
            x: slideDirection === 'next' ? -40 : 40,
            scale: 0.98,
            filter: 'blur(4px)'
          }}
          transition={{
            type: 'tween',
            duration: 0.3,
            ease: 'easeOut'
          }}
          className="absolute inset-0 flex items-center justify-center p-6"
        >
          <img
            src={pageImage}
            alt={`Page ${currentPage}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export const PdfViewer = memo(({
  pageImage,
  currentPage,
  totalPages,
  isLoading,
  error,
  fileName,
  onFileSelect,
  onPrevPage,
  onNextPage,
  slideDirection,
  isFullscreen,
  onToggleFullscreen,
  pointer,
  pointerColor = '#10b981', // Accept color prop
  onSetPointerColor = () => { },
}) => {
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with file info - Hidden in fullscreen */}
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <FileText className="w-5 h-5 text-white/80" />
            </div>

            <div>
              <h2 className="font-display font-medium text-white tracking-tight text-lg">
                {fileName || 'Document Viewer'}
              </h2>
              {totalPages > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                    {totalPages} {totalPages === 1 ? 'Slide' : 'Slides'} Ready
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen button - Only show when PDF is loaded */}
            {totalPages > 0 && (
              <motion.button
                onClick={onToggleFullscreen}
                className="glass-button p-3 rounded-lg text-white/60 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </motion.button>
            )}

            {/* Upload button */}
            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              <motion.div
                className="btn-primary flex items-center gap-2.5 px-5 py-2.5 rounded-full cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="relative w-4 h-4" />
                <span className="relative text-sm font-medium">Upload PDF</span>
              </motion.div>
            </label>
          </div>
        </motion.div>
      )}

      {/* Main viewer area */}
      <div
        className={`
          flex-1 relative overflow-hidden
          ${isFullscreen
            ? 'h-full w-full bg-black'
            : 'glass-panel rounded-2xl bg-black/40'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {/* Visual Pointer Overlay */}
          <VisualPointer pointer={pointer} color={pointerColor} />

          {/* Loading state */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
              >
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-white/80 animate-spin mx-auto mb-4" />
                  <p className="text-white/80 font-medium">Processing Document</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <div className="text-center p-8 glass-strong rounded-2xl max-w-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-white font-medium text-lg mb-2">Process Failed</p>
                  <p className="text-white/40 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state - drop zone */}
          {!pageImage && !isLoading && !error && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative group cursor-pointer text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Upload className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />
                </motion.div>

                <h3 className="text-xl font-medium text-white mb-2">
                  Drop Your Presentation
                </h3>
                <p className="text-white/40 text-sm mb-6 max-w-[240px] mx-auto">
                  Drag & drop PDF or click to browse
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {['PDF Support', 'Instant Load'].map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-white/40"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PDF Page display */}
          <SlideArea
            pageImage={pageImage}
            currentPage={currentPage}
            slideDirection={slideDirection}
          />
        </div>
      </div>

      {/* Navigation controls */}
      <AnimatePresence>
        {totalPages > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`
              flex items-center justify-center gap-4 py-4 z-[60]
              ${isFullscreen ? 'bg-black' : 'mt-2'}
            `}
          >
            <div className="flex items-center gap-3 p-2 glass-strong rounded-full border border-white/10">
              {/* Previous button */}
              <motion.button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className={`
                    p-3 rounded-full hover:bg-white/10 transition-colors
                    ${currentPage <= 1 ? 'opacity-30 cursor-not-allowed' : ''}
                  `}
                whileHover={currentPage > 1 ? { scale: 1.1 } : {}}
                whileTap={currentPage > 1 ? { scale: 0.9 } : {}}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>

              {/* Page indicator */}
              <div className="flex items-center gap-3 px-4 border-r border-white/10 mr-1">
                <span className="font-mono text-lg text-white font-medium">
                  {String(currentPage).padStart(2, '0')}
                </span>
                <span className="text-white/20">/</span>
                <span className="font-mono text-lg text-white/40">
                  {String(totalPages).padStart(2, '0')}
                </span>
              </div>

              {/* Color Picker - Compact */}
              <div className="flex items-center gap-2 pr-2">
                {[
                  { color: '#10b981', label: 'Emerald' },
                  { color: '#06b6d4', label: 'Cyan' },
                  { color: '#8b5cf6', label: 'Violet' },
                  { color: '#f43f5e', label: 'Rose' },
                  { color: '#f59e0b', label: 'Amber' }
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => onSetPointerColor(item.color)}
                    className={`
                        w-4 h-4 rounded-full transition-all duration-300 relative
                        ${pointerColor === item.color
                        ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black/20'
                        : 'opacity-50 hover:opacity-100 hover:scale-110'
                      }
                      `}
                    style={{ backgroundColor: item.color }}
                    title={item.label}
                  />
                ))}
              </div>

              {/* Next button */}
              <motion.button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                className={`
                    p-3 rounded-full hover:bg-white/10 transition-colors
                    ${currentPage >= totalPages ? 'opacity-30 cursor-not-allowed' : ''}
                  `}
                whileHover={currentPage < totalPages ? { scale: 1.1 } : {}}
                whileTap={currentPage < totalPages ? { scale: 0.9 } : {}}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>

              {/* Exit fullscreen button (only in fullscreen) */}
              {isFullscreen && (
                <>
                  <div className="w-px h-6 bg-white/10 mx-1" />
                  <motion.button
                    onClick={onToggleFullscreen}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minimize2 className="w-5 h-5 text-white/70" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
