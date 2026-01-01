import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ArrowUp, FolderOpen } from 'lucide-react';
import { useTutorial } from '../../../contexts/TutorialContext';
import { useEffect, useRef } from 'react';

export default function TutorialUpload({ hasPdf, onFileSelect }) {
  const { nextStep } = useTutorial();
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect?.(file);
    }
  };

  // Auto advance when PDF is uploaded
  useEffect(() => {
    if (hasPdf) {
      const timer = setTimeout(() => {
        nextStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasPdf, nextStep]);

  return (
    <div className="flex gap-6">
      {/* Left side - Instructions */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
            ${hasPdf
              ? 'bg-aurora-emerald/20 border-aurora-emerald/30'
              : 'bg-aurora-cyan/20 border-aurora-cyan/30'
            } border
          `}>
            {hasPdf ? (
              <CheckCircle2 className="w-6 h-6 text-aurora-emerald" />
            ) : (
              <Upload className="w-6 h-6 text-aurora-cyan" />
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">
              {hasPdf ? 'PDF Uploaded!' : 'Upload Your Presentation'}
            </h3>
            <p className="text-xs text-slate-400">
              {hasPdf ? 'Great job! Moving to next step...' : 'Step 1 of 6'}
            </p>
          </div>
        </div>

        {!hasPdf ? (
          <>
            <p className="text-slate-300 text-sm mb-4">
              Start by uploading a PDF file. You can either:
            </p>
            <ul className="space-y-2 text-sm">
              {[
                'Click on the upload area to browse files',
                'Drag and drop a PDF directly',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-2 text-slate-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-aurora-cyan mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* Upload Button */}
            <motion.button
              onClick={handleFileClick}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-aurora-cyan/20 hover:shadow-aurora-cyan/40 transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Browse Files</span>
            </motion.button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Tip */}
            <div className="mt-4 p-3 bg-aurora-purple/10 rounded-xl border border-aurora-purple/20">
              <p className="text-xs text-aurora-purple">
                <span className="font-bold">Tip:</span> Any PDF format works - PowerPoint exports, Google Slides, or native PDFs!
              </p>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-aurora-emerald/10 rounded-xl border border-aurora-emerald/20"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-aurora-emerald" />
              <div>
                <p className="font-bold text-white text-sm">PDF Ready</p>
                <p className="text-xs text-slate-400">Your presentation is loaded</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right side - Visual guide */}
      <div className="w-48 flex-shrink-0">
        <div className="relative h-full">
          {/* Mock upload area */}
          <motion.div
            className={`
              h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4
              transition-all duration-500
              ${hasPdf
                ? 'border-aurora-emerald/50 bg-aurora-emerald/5'
                : 'border-aurora-cyan/50 bg-aurora-cyan/5'
              }
            `}
            animate={!hasPdf ? {
              borderColor: ['rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.6)', 'rgba(34, 211, 238, 0.3)'],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {hasPdf ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <CheckCircle2 className="w-12 h-12 text-aurora-emerald" />
              </motion.div>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUp className="w-8 h-8 text-aurora-cyan mb-2" />
                </motion.div>
                <p className="text-xs text-slate-400 text-center">
                  PDF Preview
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
