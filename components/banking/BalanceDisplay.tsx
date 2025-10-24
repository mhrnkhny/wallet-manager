'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CountingNumber from '../animations/CountingNumber';
import { prefersReducedMotion, slideUpVariants, staggerContainer } from '../animations/AnimationConfig';

export interface BalanceDisplayProps {
  balance: number;
  income?: number;
  expenses?: number;
  currency?: string;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  income,
  expenses,
  currency = 'ریال',
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background patterns */}
      <motion.div
        className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Main balance */}
      <motion.div
        className="mb-6 relative z-10"
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          className="text-sm opacity-80 mb-2"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
          animate={shouldReduceMotion ? undefined : { opacity: 0.8, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          موجودی کل
        </motion.p>
        <div className="flex items-baseline gap-2">
          <motion.p
            className="text-4xl font-bold"
            initial={shouldReduceMotion ? undefined : { scale: 0.5 }}
            animate={shouldReduceMotion ? undefined : { scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CountingNumber value={balance} duration={1.5} format={formatAmount} />
          </motion.p>
          <motion.span
            className="text-lg opacity-80"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 0.8 }}
            transition={{ delay: 0.6 }}
          >
            {currency}
          </motion.span>
        </div>
      </motion.div>

      {/* Income and expenses */}
      {(income !== undefined || expenses !== undefined) && (
        <motion.div
          className="grid grid-cols-2 gap-4 relative z-10"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          variants={staggerContainer}
        >
          {income !== undefined && (
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              variants={slideUpVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }
              }
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center"
                  whileHover={shouldReduceMotion ? {} : { rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </motion.div>
                <span className="text-xs opacity-80">درآمد</span>
              </div>
              <p className="text-xl font-semibold">
                <CountingNumber value={income} duration={1.5} format={formatAmount} />
              </p>
            </motion.div>
          )}

          {expenses !== undefined && (
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              variants={slideUpVariants}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }
              }
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-8 h-8 rounded-full bg-error-500/20 flex items-center justify-center"
                  whileHover={shouldReduceMotion ? {} : { rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </motion.div>
                <span className="text-xs opacity-80">هزینه</span>
              </div>
              <p className="text-xl font-semibold">
                <CountingNumber value={expenses} duration={1.5} format={formatAmount} />
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BalanceDisplay;
