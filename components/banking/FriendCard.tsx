'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../animations/AnimationConfig';
import Snackbar from '../ui/Snackbar';

export interface FriendCardProps {
  id: number;
  cardTitle: string;
  cardNumber: string;
  shebaNumber: string;
  description?: string;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  id,
  cardTitle,
  cardNumber,
  shebaNumber,
  description,
  onDelete,
  onEdit,
}) => {
  const shouldReduceMotion = prefersReducedMotion();
  const [showFullCard, setShowFullCard] = useState(false);
  const [showFullSheba, setShowFullSheba] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  const formatCardNumber = (number: string) => {
    if (showFullCard) {
      return number.replace(/(\d{4})(?=\d)/g, '$1-');
    }
    return `****-****-****-${number.slice(-4)}`;
  };

  const formatShebaNumber = (sheba: string) => {
    if (showFullSheba) {
      const clean = sheba.replace(/IR/i, '');
      return `IR${clean.replace(/(\d{4})(?=\d)/g, '$1-')}`;
    }
    return `IR**-****-****-****-****-**${sheba.slice(-2)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({
        open: true,
        message: `${label} با موفقیت کپی شد`,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در کپی کردن',
      });
    }
  };

  return (
    <motion.div
      className="bg-dark-surface rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.2)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {cardTitle.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{cardTitle}</h3>
            {description && (
              <p className="text-sm text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <motion.button
              onClick={() => onEdit(id)}
              className="p-2 text-primary-400 hover:text-white hover:bg-primary-500/20 border border-primary-500/30 hover:border-primary-500 rounded-xl transition-all"
              aria-label="ویرایش"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={() => onDelete(id)}
              className="p-2 text-error-400 hover:text-white hover:bg-error-500/20 border border-error-500/30 hover:border-error-500 rounded-xl transition-all"
              aria-label="حذف"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Card Number */}
        <div className="bg-dark-card rounded-xl p-3 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">شماره کارت</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullCard(!showFullCard)}
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showFullCard ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => copyToClipboard(cardNumber, 'شماره کارت')}
                className="text-gray-400 hover:text-success-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-white font-mono text-sm direction-ltr text-left">
            {formatCardNumber(cardNumber)}
          </p>
        </div>

        {/* Sheba Number */}
        <div className="bg-dark-card rounded-xl p-3 border border-gray-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">شماره شبا</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullSheba(!showFullSheba)}
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showFullSheba ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => copyToClipboard(shebaNumber, 'شماره شبا')}
                className="text-gray-400 hover:text-success-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-white font-mono text-sm direction-ltr text-left">
            {formatShebaNumber(shebaNumber)}
          </p>
        </div>
      </div>

      {/* Snackbar for copy notifications */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity="success"
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </motion.div>
  );
};

export default FriendCard;
