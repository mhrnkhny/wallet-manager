'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { prefersReducedMotion, transitions } from '../animations/AnimationConfig';

export interface TransactionCardProps {
  id: number;
  title: string;
  description?: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
  bankName: string;
  cardNumber: string;
  onDelete?: (id: number) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  id,
  title,
  description,
  amount,
  type,
  date,
  bankName,
  cardNumber,
  onDelete,
}) => {
  const shouldReduceMotion = prefersReducedMotion();
  const [showDelete, setShowDelete] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0.5, 1]);
  const deleteButtonOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const formatCardNumber = (number: string) => {
    return number.slice(-4);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const isDeposit = type === 'deposit';

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (shouldReduceMotion) return;

    // RTL: swipe left (negative x) to delete
    if (info.offset.x < -100 && onDelete) {
      setShowDelete(true);
    } else {
      x.set(0);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete button background */}
      {onDelete && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 bg-error-600 flex items-center justify-start px-6 rounded-xl"
          style={{ opacity: deleteButtonOpacity }}
        >
          <div className="flex items-center gap-2 text-white font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>حذف</span>
          </div>
        </motion.div>
      )}

      {/* Main card */}
      <motion.div
        className="bg-dark-surface rounded-3xl shadow-xl p-4 border-r-4 relative"
        style={{
          borderColor: isDeposit ? '#4CAF50' : '#F44336',
          x: shouldReduceMotion ? 0 : x,
          opacity: shouldReduceMotion ? 1 : opacity,
        }}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0, x: -100, transition: { duration: 0.2 } }}
        drag={!shouldReduceMotion && onDelete ? 'x' : false}
        dragConstraints={{ left: -150, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.12)',
                y: -2,
                transition: transitions.fast,
              }
        }
      >
        <div className="flex items-start justify-between">
          {/* Right side: Icon and details */}
          <div className="flex gap-3 flex-1">
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDeposit
                  ? 'bg-success-500 text-white'
                  : 'bg-error-500 text-white'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                {isDeposit ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 12H4"
                  />
                )}
              </svg>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1 text-base">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                  {description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1 bg-gray-700/30 px-2 py-1 rounded-lg">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                  </svg>
                  <span className="font-medium">{date}</span>
                </span>
                <span className="flex items-center gap-1 bg-gray-700/30 px-2 py-1 rounded-lg">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {bankName} - {formatCardNumber(cardNumber)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Left side: Amount and actions */}
          <div className="flex flex-col items-end gap-2 mr-3">
            <div
              className={`px-3 py-1.5 rounded-lg font-bold text-base text-white ${
                isDeposit
                  ? 'bg-success-500'
                  : 'bg-error-500'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{isDeposit ? '+' : '-'}</span>
                <span>{formatAmount(amount)}</span>
              </div>
              <p className="text-xs opacity-90 text-center">ریال</p>
            </div>

            {onDelete && (
              <motion.button
                onClick={handleDelete}
                className="px-2.5 py-1 text-error-600 hover:text-white hover:bg-error-500 border border-error-300 hover:border-error-500 rounded-md transition-all text-xs font-medium"
                aria-label="حذف تراکنش"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                حذف
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionCard;
