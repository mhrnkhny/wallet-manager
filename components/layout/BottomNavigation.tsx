'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { prefersReducedMotion, transitions } from '../animations/AnimationConfig';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface BottomNavigationProps {
  items: NavItem[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ items }) => {
  const pathname = usePathname();
  const shouldReduceMotion = prefersReducedMotion();

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-dark-surface border-t border-gray-700/30 shadow-2xl lg:hidden backdrop-blur-lg"
      role="navigation"
      aria-label="ناوبری اصلی"
      initial={shouldReduceMotion ? undefined : { y: 100 }}
      animate={shouldReduceMotion ? undefined : { y: 0 }}
      transition={transitions.spring}
    >
      <div className="flex items-center justify-around h-16 relative">
        {items.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator */}
              {isActive && !shouldReduceMotion && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-accent-pink via-accent-purple to-accent-blue rounded-b-full"
                  layoutId="activeTab"
                  transition={transitions.spring}
                />
              )}

              <motion.div
                className={`transition-colors ${
                  isActive ? 'text-primary-400' : 'text-gray-400'
                }`}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : isActive
                      ? { scale: 1.1, y: -2 }
                      : { scale: 1, y: 0 }
                  }
                  transition={transitions.spring}
                >
                  {item.icon}
                </motion.div>
                <motion.span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? 'font-semibold' : ''
                  }`}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : isActive
                      ? { scale: 1.05 }
                      : { scale: 1 }
                  }
                  transition={transitions.fast}
                >
                  {item.label}
                </motion.span>
              </motion.div>

              {/* Ripple effect on tap */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  whileTap={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    scale: 1.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
