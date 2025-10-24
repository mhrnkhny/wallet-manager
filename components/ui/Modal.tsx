'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants, prefersReducedMotion } from '../animations/AnimationConfig';
import IconButton from './IconButton';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
  closeOnBackdrop = true,
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const modalContent = (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            exit={shouldReduceMotion ? undefined : 'exit'}
            variants={backdropVariants}
          />

          {/* Modal */}
          <motion.div
            className={`relative w-full ${maxWidthClasses[maxWidth]} bg-dark-surface rounded-3xl shadow-2xl overflow-hidden border border-gray-700/30`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            exit={shouldReduceMotion ? undefined : 'exit'}
            variants={modalVariants}
          >
            {/* Header */}
            {title && (
              <motion.div
                className="flex items-center justify-between p-6 border-b border-gray-700/30"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 id="modal-title" className="text-xl font-semibold text-white">
                  {title}
                </h2>
                <IconButton
                  onClick={onClose}
                  aria-label="بستن"
                  size="small"
                  color="default"
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
                </IconButton>
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              className="p-6 max-h-[60vh] overflow-y-auto"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>

            {/* Actions */}
            {actions && (
              <motion.div
                className="flex items-center justify-end gap-2 p-6 border-t border-gray-700/30"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {actions}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document root
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default Modal;
