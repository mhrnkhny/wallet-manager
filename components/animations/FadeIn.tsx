'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, slideUpVariants, scaleVariants, prefersReducedMotion } from './AnimationConfig';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fade' | 'slideUp' | 'scale';
}

/**
 * Generic fade-in animation component
 * Supports multiple animation variants
 */
const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  variant = 'fade',
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  const variants = {
    fade: fadeInVariants,
    slideUp: slideUpVariants,
    scale: scaleVariants,
  }[variant];

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
