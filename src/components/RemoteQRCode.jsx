import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, Wifi, WifiOff, QrCode, Check, Copy } from 'lucide-react';

const RemoteQRCode = ({
  sessionId,
  isConnected,
  remoteConnected,
  isEnabled,
  onToggle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const remoteUrl = sessionId ? `${window.location.origin}/remote/${sessionId}` : '';

  const handleCopyUrl = async () => {
    if (!remoteUrl) return;
    try {
      await navigator.clipboard.writeText(remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleToggle = () => {
    if (isEnabled) setIsModalOpen(false);
    onToggle();
  };

  return (
    <>
      <motion.button
        onClick={() => {
          if (!isEnabled) onToggle();
          setIsModalOpen(true);
        }}
        className="relative w-full group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Main button */}
        <div className={`
          relative py-4 px-5 rounded-xl flex items-center justify-between gap-3
          font-medium text-sm transition-all duration-300 overflow-hidden
          ${isEnabled
            ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
            : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
          }
        `}>
          <div className="relative flex items-center gap-3">
            <div className={`
              p-2 rounded-lg transition-all duration-300
              ${isEnabled
                ? 'bg-emerald-400/20'
                : 'bg-white/10'
              }
            `}>
              <Smartphone className={`w-5 h-5 ${isEnabled ? 'text-emerald-400' : 'text-white'}`} />
            </div>
            <div className="text-left">
              <span className="block font-medium">
                {isEnabled
                  ? remoteConnected ? 'Remote Connected' : 'Waiting for Remote...'
                  : 'Mobile Remote'
                }
              </span>
              <span className={`text-xs ${isEnabled ? 'text-emerald-400/60' : 'text-white/40'
                }`}>
                {isEnabled
                  ? remoteConnected ? 'Tap to view QR' : 'Scan QR to connect'
                  : 'Control from your phone'
                }
              </span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="relative flex items-center gap-2">
            {isEnabled ? (
              <motion.div
                className={`w-3 h-3 rounded-full ${remoteConnected ? 'bg-emerald-400' : 'bg-emerald-400/50'}`}
                animate={{
                  scale: remoteConnected ? [1, 1.2, 1] : [1, 1.5, 1],
                  opacity: remoteConnected ? 1 : [1, 0.5, 1],
                  boxShadow: remoteConnected
                    ? ['0 0 10px rgba(52, 211, 153, 0.5)', '0 0 20px rgba(52, 211, 153, 0.5)', '0 0 10px rgba(52, 211, 153, 0.5)']
                    : 'none',
                }}
                transition={{ duration: remoteConnected ? 2 : 1.5, repeat: Infinity }}
              />
            ) : (
              <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-white/10 text-white/40 text-[10px] font-medium border border-white/5">
                <QrCode className="w-3 h-3" />
                <span>QR</span>
              </div>
            )}
          </div>
        </div>
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative z-10 glass-strong rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <QrCode className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-medium text-white mb-2">Mobile Remote</h3>
                  <p className="text-base text-white/40">Scan to control your presentation</p>
                </div>

                <div className={`
                  flex items-center justify-center gap-2 py-2 px-4 rounded-full mb-6 mx-auto w-fit
                  ${isConnected
                    ? remoteConnected
                      ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                      : 'bg-white/10 text-white/60 border border-white/10'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }
                `}>
                  {isConnected ? (
                    remoteConnected ? (
                      <>
                        <Wifi className="w-4 h-4" />
                        <span className="text-sm font-medium">Remote Connected</span>
                      </>
                    ) : (
                      <>
                        <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Wifi className="w-4 h-4" />
                        </motion.div>
                        <span className="text-sm font-medium">Waiting for connection...</span>
                      </>
                    )
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Connecting...</span>
                    </>
                  )}
                </div>

                {isEnabled && sessionId ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="p-4 bg-white rounded-2xl mb-6 shadow-xl"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <QRCodeSVG value={remoteUrl} size={180} level="H" bgColor="#ffffff" fgColor="#000000" />
                    </motion.div>

                    <div className="text-center mb-6">
                      <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-medium">Session ID</p>
                      <p className="text-3xl font-mono font-medium text-white tracking-[0.2em]">{sessionId}</p>
                    </div>

                    <motion.button
                      onClick={handleCopyUrl}
                      className={`
                        flex items-center gap-2 py-2.5 px-6 rounded-full text-sm font-medium transition-all duration-300
                        ${copied ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copied ? <><Check className="w-4 h-4" /><span>Copied!</span></> : <><Copy className="w-4 h-4" /><span>Copy URL</span></>}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <motion.div
                      className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-sm text-white/40 mt-4">Starting session...</p>
                  </div>
                )}

                <motion.button
                  onClick={handleToggle}
                  className={`
                    w-full mt-6 py-4 px-6 rounded-xl font-medium text-base transition-all duration-300
                    ${isEnabled
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                      : 'btn-primary text-black bg-white hover:bg-white/90 shadow-lg shadow-white/10'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isEnabled ? 'Disable Remote Control' : 'Enable Remote Control'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default RemoteQRCode;
