'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { prefersReducedMotion } from './AnimationConfig';

interface CountingNumberProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

/**
 * Animated number counter component
 * Smoothly animates from 0 to target value
 */
const CountingNumber: React.FC<CountingNumberProps> = ({
  value,
  duration = 1,
  className = '',
  format = (v) => v.toLocaleString('fa-IR'),
}) => {
  const shouldReduceMotion = prefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0);

  const spring = useSpring(shouldReduceMotion ? value : 0, {
    stiffness: 75,
    damping: 15,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
    } else {
      spring.set(value);
      const unsubscribe = spring.on('change', (latest) => {
        setDisplayValue(Math.round(latest));
      });
      return () => unsubscribe();
    }
  }, [value, spring, shouldReduceMotion]);

  return <span className={className}>{format(displayValue)}</span>;
};

export default CountingNumber;
