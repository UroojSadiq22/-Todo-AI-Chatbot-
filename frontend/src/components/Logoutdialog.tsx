'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Heart } from 'lucide-react';
import { useEffect } from 'react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Dialog */}
            <motion.div
              className="relative bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti Animation */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                      opacity: 1,
                    }}
                    animate={{
                      x: `${Math.random() * 200 - 100}%`,
                      y: `${Math.random() * 200 - 100}%`,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Success Icon */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(16, 185, 129, 0.4)',
                        '0 0 0 20px rgba(16, 185, 129, 0)',
                        '0 0 0 0 rgba(16, 185, 129, 0)',
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  >
                    <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
                  </motion.div>

                  {/* Sparkles around icon */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: ['0%', '100%', '100%', '0%'][i],
                        left: ['0%', '0%', '100%', '100%'][i],
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                  Successfully Logged Out!
                </h2>
                <p className="text-slate-600 text-lg mb-6">
                  Thank you for using{' '}
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    AuraTask
                  </span>
                </p>

                <motion.div
                  className="flex items-center justify-center gap-2 text-slate-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>We hope to see you again soon</span>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-300 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Home
              </motion.button>

              {/* Auto-close indicator */}
              <motion.div
                className="mt-4 text-center text-xs text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  className="inline-block"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Redirecting to home in 3 seconds...
                </motion.div>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}