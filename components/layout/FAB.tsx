'use client';

import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { prefersReducedMotion, transitions } from '../animations/AnimationConfig';

export interface FABProps extends Omit<HTMLMotionProps<'button'>, 'color'> {
  icon?: React.ReactNode;
  label?: string;
  extended?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

const FAB: React.FC<FABProps> = ({
  icon,
  label,
  extended = false,
  position = 'bottom-right',
  className = '',
  children,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const shouldReduceMotion = prefersReducedMotion();

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-24 lg:bottom-6 left-4 lg:left-6',
    'bottom-left': 'bottom-24 lg:bottom-6 right-4 lg:right-6',
    'bottom-center': 'bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2',
  };

  // Size classes
  const sizeClasses = extended
    ? 'h-14 px-6 gap-3 rounded-2xl'
    : 'w-14 h-14 rounded-2xl';

  const baseClasses = 'fixed z-50 flex items-center justify-center bg-primary-600 text-white shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 overflow-hidden';

  const combinedClasses = `${baseClasses} ${sizeClasses} ${positionClasses[position]} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, ripple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        whileHover: {
          scale: 1.1,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
        },
        whileTap: { scale: 0.9 },
        transition: transitions.springBouncy,
      };

  return (
    <motion.button
      className={combinedClasses}
      aria-label={label || 'عملیات اصلی'}
      {...animationProps}
      {...props}
      onClick={handleClick}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{
            width: 200,
            height: 200,
            x: ripple.x - 100,
            y: ripple.y - 100,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ pointerEvents: 'none' }}
        />
      ))}

      {icon && (
        <motion.span
          className="flex-shrink-0"
          initial={shouldReduceMotion ? undefined : { rotate: -180 }}
          animate={shouldReduceMotion ? undefined : { rotate: 0 }}
          transition={{ delay: 0.1 }}
        >
          {icon}
        </motion.span>
      )}
      {extended && label && (
        <motion.span
          className="font-semibold text-sm"
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {label}
        </motion.span>
      )}
      {children as any}
    </motion.button>
  );
};

export default FAB;
