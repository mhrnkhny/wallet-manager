'use client';

import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { tapScale, hoverScale, transitions, prefersReducedMotion } from '../animations/AnimationConfig';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'color'> {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      fullWidth = false,
      startIcon,
      endIcon,
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    const shouldReduceMotion = prefersReducedMotion();

    // Size classes
    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm h-8',
      medium: 'px-6 py-2.5 text-base h-10',
      large: 'px-8 py-3 text-lg h-12',
    };

    // Variant and color classes
    const getVariantClasses = () => {
      if (variant === 'filled') {
        const colorMap = {
          primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
          secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-sm hover:shadow-md',
          success: 'bg-success-500 text-white hover:bg-success-700 active:bg-success-700 shadow-sm hover:shadow-md',
          error: 'bg-error-500 text-white hover:bg-error-700 active:bg-error-700 shadow-sm hover:shadow-md',
          warning: 'bg-warning-500 text-white hover:bg-warning-700 active:bg-warning-700 shadow-sm hover:shadow-md',
        };
        return colorMap[color];
      }

      if (variant === 'outlined') {
        const colorMap = {
          primary: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-600/20 hover:border-primary-400 active:bg-primary-600/30',
          secondary: 'border-2 border-secondary-500 text-secondary-400 hover:bg-secondary-600/20 hover:border-secondary-400 active:bg-secondary-600/30',
          success: 'border-2 border-success-500 text-success-400 hover:bg-success-600/20 hover:border-success-400 active:bg-success-600/30',
          error: 'border-2 border-error-500 text-error-400 hover:bg-error-600/20 hover:border-error-400 active:bg-error-600/30',
          warning: 'border-2 border-warning-500 text-warning-400 hover:bg-warning-600/20 hover:border-warning-400 active:bg-warning-600/30',
        };
        return colorMap[color];
      }

      // text variant
      const colorMap = {
        primary: 'text-primary-400 hover:bg-primary-600/20 active:bg-primary-600/30',
        secondary: 'text-secondary-400 hover:bg-secondary-600/20 active:bg-secondary-600/30',
        success: 'text-success-400 hover:bg-success-600/20 active:bg-success-600/30',
        error: 'text-error-400 hover:bg-error-600/20 active:bg-error-600/30',
        warning: 'text-warning-400 hover:bg-warning-600/20 active:bg-warning-600/30',
      };
      return colorMap[color];
    };

    const baseClasses = 'relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${getVariantClasses()} ${widthClass} ${className}`;

    // Ripple effect handler
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldReduceMotion || disabled || loading) return;

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev, ripple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);

      // Call original onClick if provided
      if (props.onClick) {
        props.onClick(e);
      }
    };

    const animationProps = shouldReduceMotion
      ? {}
      : {
          whileHover: disabled || loading ? {} : { scale: 1.02 },
          whileTap: disabled || loading ? {} : tapScale,
          transition: transitions.fast,
        };

    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
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
              width: 500,
              height: 500,
              x: ripple.x - 250,
              y: ripple.y - 250,
              opacity: 0,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {loading ? (
          <>
            <motion.svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </motion.svg>
            <span>در حال بارگذاری...</span>
          </>
        ) : (
          <>
            {startIcon && (
              <motion.span
                className="flex-shrink-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={transitions.fast}
              >
                {startIcon}
              </motion.span>
            )}
            {children}
            {endIcon && (
              <motion.span
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={transitions.fast}
              >
                {endIcon}
              </motion.span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
