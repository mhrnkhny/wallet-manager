'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, listItemVariants, prefersReducedMotion } from './AnimationConfig';

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

/**
 * Wrapper component for animated lists
 * Handles stagger animations for list items
 */
const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  stagger = true,
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={stagger ? staggerContainer : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={listItemVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedList;
