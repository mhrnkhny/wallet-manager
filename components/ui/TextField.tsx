'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '../animations/AnimationConfig';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorText,
      fullWidth = false,
      startAdornment,
      endAdornment,
      className = '',
      id,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const shouldReduceMotion = prefersReducedMotion();
    const inputId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = `${inputId}-helper`;
    const errorTextId = `${inputId}-error`;

    const widthClass = fullWidth ? 'w-full' : '';
    const hasValue = value !== undefined && value !== '';
    const isLabelFloating = isFocused || hasValue;

    const getInputClasses = () => {
      return `
        w-full px-4 ${label ? 'pt-6 pb-2' : 'py-3'} text-base rounded-2xl
        bg-dark-surface text-white
        border-2 ${error ? 'border-error-500' : isFocused ? 'border-primary-500' : 'border-gray-600/30'}
        transition-all duration-200
        focus:outline-none
        disabled:bg-gray-800 disabled:cursor-not-allowed disabled:border-gray-700
        ${startAdornment ? 'pr-12' : ''}
        ${endAdornment ? 'pl-12' : ''}
        placeholder-transparent
      `.trim();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={`${widthClass} ${className}`}>
        <div className="relative">
          {/* Floating Label */}
          {label && (
            <motion.label
              htmlFor={inputId}
              className={`absolute right-4 pointer-events-none transition-all duration-200 ${
                error
                  ? 'text-error-500'
                  : isFocused
                    ? 'text-primary-400 font-medium'
                    : 'text-gray-400'
              }`}
              initial={false}
              animate={{
                top: isLabelFloating ? '0.5rem' : '50%',
                fontSize: isLabelFloating ? '0.75rem' : '1rem',
                translateY: isLabelFloating ? '0' : '-50%',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {label}
            </motion.label>
          )}

          <div className="relative">
            {/* Start Adornment */}
            {startAdornment && (
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 ${
                  error
                    ? 'text-error-500'
                    : isFocused
                      ? 'text-primary-400'
                      : 'text-gray-400'
                }`}
              >
                {startAdornment}
              </div>
            )}

            {/* Input Field */}
            <input
              ref={ref}
              id={inputId}
              className={getInputClasses()}
              aria-invalid={error}
              aria-describedby={
                error && errorText
                  ? errorTextId
                  : helperText
                  ? helperTextId
                  : undefined
              }
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />

            {/* End Adornment */}
            {endAdornment && (
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
                  error
                    ? 'text-error-500'
                    : isFocused
                      ? 'text-primary-400'
                      : 'text-gray-400'
                }`}
              >
                {endAdornment}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence mode="wait">
          {error && errorText && (
            <motion.p
              id={errorTextId}
              className="mt-2 text-sm text-error-500 flex items-center gap-1.5"
              role="alert"
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10, y: -5 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, x: 10, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                initial={shouldReduceMotion ? undefined : { scale: 0, rotate: -180 }}
                animate={shouldReduceMotion ? undefined : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </motion.svg>
              {errorText}
            </motion.p>
          )}

          {!error && helperText && (
            <motion.p
              id={helperTextId}
              className="mt-2 text-sm text-gray-400"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
