'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { snackbarVariants, prefersReducedMotion } from '../animations/AnimationConfig';

export interface SnackbarProps {
  open: boolean;
  message: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
  action?: React.ReactNode;
}

const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  severity = 'info',
  duration = 4000,
  onClose,
  action,
}) => {
  const shouldReduceMotion = prefersReducedMotion();
  const [progress, setProgress] = useState(100);

  // Auto close after duration
  useEffect(() => {
    if (open && duration > 0) {
      // Reset progress
      setProgress(100);

      // Animate progress bar
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 16); // ~60fps

      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [open, duration, onClose]);

  // Severity classes
  const severityClasses = {
    info: 'bg-gray-800 text-white',
    success: 'bg-success-700 text-white',
    warning: 'bg-warning-700 text-white',
    error: 'bg-error-700 text-white',
  };

  const snackbarContent = (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-60"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          variants={snackbarVariants}
        >
          <div
            className={`relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl min-w-[280px] max-w-[568px] ${severityClasses[severity]}`}
            role="alert"
            aria-live="polite"
          >
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            )}

            {/* Icon based on severity */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            >
              {severity === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {severity === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {severity === 'warning' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {severity === 'info' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </motion.div>

            <p className="text-sm font-medium flex-1">{message}</p>

            {action && <div className="flex-shrink-0">{action}</div>}

            <motion.button
              onClick={onClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-2"
              aria-label="بستن"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(snackbarContent, document.body)
    : null;
};

export default Snackbar;
