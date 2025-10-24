'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { prefersReducedMotion, scaleVariants } from '../animations/AnimationConfig';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Icon */}
      {icon ? (
        <motion.div
          className="text-gray-500 mb-4"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          variants={scaleVariants}
        >
          {icon}
        </motion.div>
      ) : (
        <motion.div
          className="w-16 h-16 rounded-full bg-dark-bg flex items-center justify-center mb-4"
          initial={shouldReduceMotion ? undefined : { scale: 0, rotate: -180 }}
          animate={shouldReduceMotion ? undefined : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </motion.svg>
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        className="text-xl font-semibold text-white mb-2"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-gray-400 mb-6 max-w-md"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>

      {/* Action button */}
      {actionLabel && onAction && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <Button onClick={onAction} variant="filled" color="primary">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
