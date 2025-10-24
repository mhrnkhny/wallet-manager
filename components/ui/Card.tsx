'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { slideUpVariants, transitions, prefersReducedMotion } from '../animations/AnimationConfig';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'color'> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  animate?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'medium',
      hoverable = false,
      animate = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = prefersReducedMotion();

    // Variant classes - Dark Theme
    const variantClasses = {
      default: 'bg-dark-surface shadow-sm border border-gray-700/30',
      outlined: 'bg-dark-surface border-2 border-gray-600/30',
      elevated: 'bg-dark-surface shadow-xl',
    };

    // Padding classes
    const paddingClasses = {
      none: '',
      small: 'p-3',
      medium: 'p-5',
      large: 'p-7',
    };

    const combinedClasses = `rounded-3xl transition-all duration-200 ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

    const animationProps = shouldReduceMotion
      ? {}
      : {
          initial: animate ? 'hidden' : undefined,
          animate: animate ? 'visible' : undefined,
          exit: animate ? 'exit' : undefined,
          variants: animate ? slideUpVariants : undefined,
          whileHover: hoverable
            ? {
                y: -4,
                boxShadow: '0 12px 24px -6px rgb(0 0 0 / 0.15)',
                transition: transitions.fast,
              }
            : undefined,
          transition: transitions.spring,
        };

    return (
      <motion.div
        ref={ref}
        className={combinedClasses}
        style={{ cursor: hoverable ? 'pointer' : 'default' }}
        {...animationProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
