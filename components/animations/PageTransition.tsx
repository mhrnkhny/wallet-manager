'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, prefersReducedMotion } from './AnimationConfig';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for page transitions
 * Handles enter/exit animations for route changes
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const shouldReduceMotion = prefersReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
