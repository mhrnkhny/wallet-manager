'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion, staggerContainer, slideUpVariants } from '../animations/AnimationConfig';

export interface LoadingStateProps {
  variant?: 'card' | 'list' | 'page';
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'card',
  count = 3,
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  if (variant === 'page') {
    return (
      <motion.div
        className="flex items-center justify-center py-12"
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 border-4 border-primary-900/20 border-t-primary-500 rounded-full"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.p
            className="text-gray-400"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            در حال بارگذاری...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div
        className="space-y-4"
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        variants={staggerContainer}
      >
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-dark-surface rounded-2xl p-4 shadow-sm overflow-hidden border border-gray-700/30"
            variants={slideUpVariants}
          >
            <div className="flex items-center gap-4">
              {/* Circle skeleton */}
              <motion.div
                className="w-10 h-10 bg-gray-700/50 rounded-full"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: [0.3, 0.5, 0.3],
                      }
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <motion.div
                  className="h-4 bg-gray-700/50 rounded w-3/4"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          opacity: [0.3, 0.5, 0.3],
                        }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.1,
                  }}
                />
                <motion.div
                  className="h-3 bg-gray-700/50 rounded w-1/2"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          opacity: [0.3, 0.5, 0.3],
                        }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
              </div>

              {/* Amount skeleton */}
              <motion.div
                className="w-20 h-6 bg-gray-700/50 rounded"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: [0.3, 0.5, 0.3],
                      }
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
      variants={staggerContainer}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-dark-surface rounded-2xl p-6 shadow-sm overflow-hidden border border-gray-700/30"
          variants={slideUpVariants}
        >
          <div className="space-y-4">
            <motion.div
              className="h-4 bg-gray-700/50 rounded w-1/3"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: [0.3, 0.5, 0.3],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="h-8 bg-gray-700/50 rounded"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: [0.3, 0.5, 0.3],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            />
            <motion.div
              className="h-4 bg-gray-700/50 rounded w-2/3"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: [0.3, 0.5, 0.3],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingState;
