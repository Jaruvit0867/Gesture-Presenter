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
        {/* Glow effect behind button */}
        <motion.div
          className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-500 ${
            isEnabled
              ? remoteConnected
                ? 'bg-gradient-to-r from-aurora-cyan/50 to-aurora-emerald/50'
                : 'bg-gradient-to-r from-aurora-purple/50 to-aurora-pink/50'
              : 'bg-gradient-to-r from-aurora-purple/30 to-aurora-cyan/30 opacity-0 group-hover:opacity-100'
          }`}
          animate={isEnabled && !remoteConnected ? {
            opacity: [0.5, 0.8, 0.5],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Main button */}
        <div className={`
          relative py-4 px-5 rounded-xl flex items-center justify-between gap-3
          font-semibold text-sm transition-all duration-300 overflow-hidden
          ${isEnabled
            ? remoteConnected
              ? 'bg-gradient-to-r from-aurora-cyan/20 to-aurora-emerald/20 text-aurora-cyan border border-aurora-cyan/40'
              : 'bg-gradient-to-r from-aurora-purple/20 to-aurora-pink/20 text-aurora-purple border border-aurora-purple/40'
            : 'bg-gradient-to-r from-aurora-purple/10 to-aurora-cyan/10 text-white border border-white/20 group-hover:border-aurora-purple/40'
          }
        `}>
          {/* Animated background shimmer */}
          {!isEnabled && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <div className="relative flex items-center gap-3">
            <div className={`
              p-2 rounded-lg transition-all duration-300
              ${isEnabled
                ? remoteConnected
                  ? 'bg-aurora-cyan/20'
                  : 'bg-aurora-purple/20'
                : 'bg-white/10 group-hover:bg-aurora-purple/20'
              }
            `}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block">
                {isEnabled
                  ? remoteConnected ? 'Remote Connected' : 'Waiting for Remote...'
                  : 'Mobile Remote'
                }
              </span>
              <span className={`text-xs font-normal ${
                isEnabled ? 'opacity-60' : 'text-white/50'
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
                className={`w-3 h-3 rounded-full ${remoteConnected ? 'bg-aurora-cyan' : 'bg-aurora-purple'}`}
                animate={{
                  scale: remoteConnected ? [1, 1.2, 1] : [1, 1.5, 1],
                  opacity: remoteConnected ? 1 : [1, 0.5, 1],
                  boxShadow: remoteConnected
                    ? ['0 0 10px #00f5ff', '0 0 20px #00f5ff', '0 0 10px #00f5ff']
                    : ['0 0 10px #8b5cf6', '0 0 20px #8b5cf6', '0 0 10px #8b5cf6'],
                }}
                transition={{ duration: remoteConnected ? 2 : 1.5, repeat: Infinity }}
              />
            ) : (
              <motion.div
                className="flex items-center gap-1 py-1 px-2 rounded-full bg-aurora-purple/20 text-aurora-purple text-xs"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <QrCode className="w-3 h-3" />
                <span>QR</span>
              </motion.div>
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
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={() => setIsModalOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative z-10 rounded-3xl p-8 max-w-md w-full border border-white/20 bg-dark-950/95 backdrop-blur-xl shadow-2xl shadow-aurora-purple/20"
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-aurora-purple to-aurora-cyan mb-4"
                    animate={{
                      boxShadow: [
                        '0 0 30px rgba(139, 92, 246, 0.5)',
                        '0 0 50px rgba(0, 245, 255, 0.5)',
                        '0 0 30px rgba(139, 92, 246, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <QrCode className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mobile Remote</h3>
                  <p className="text-base text-white/60">Scan to control your presentation</p>
                </div>

                <div className={`
                  flex items-center justify-center gap-2 py-2 px-4 rounded-lg mb-4
                  ${isConnected
                    ? remoteConnected
                      ? 'bg-aurora-cyan/10 text-aurora-cyan'
                      : 'bg-aurora-purple/10 text-aurora-purple'
                    : 'bg-red-500/10 text-red-400'
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
                      className="p-5 bg-white rounded-2xl mb-6 shadow-lg shadow-white/10"
                      initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
                      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                      transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                    >
                      <QRCodeSVG value={remoteUrl} size={200} level="H" bgColor="#ffffff" fgColor="#030014" />
                    </motion.div>

                    <div className="text-center mb-6">
                      <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Session ID</p>
                      <p className="text-2xl font-mono font-bold text-white tracking-[0.3em]">{sessionId}</p>
                    </div>

                    <motion.button
                      onClick={handleCopyUrl}
                      className={`
                        flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300
                        ${copied ? 'bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'}
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
                      className="w-16 h-16 rounded-full border-4 border-aurora-purple/30 border-t-aurora-purple"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-sm text-white/50 mt-4">Starting session...</p>
                  </div>
                )}

                <motion.button
                  onClick={handleToggle}
                  className={`
                    w-full mt-6 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300
                    ${isEnabled
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                      : 'bg-gradient-to-r from-aurora-purple to-aurora-cyan text-white shadow-lg shadow-aurora-purple/30'
                    }
                  `}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
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
