'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, drawerVariants, staggerContainer, listItemVariants, prefersReducedMotion } from '../animations/AnimationConfig';

export interface DrawerItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  items: DrawerItem[];
  currentPath?: string;
  userInfo?: {
    name: string;
    email: string;
  };
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  items,
  currentPath,
  userInfo,
}) => {
  const shouldReduceMotion = prefersReducedMotion();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            exit={shouldReduceMotion ? undefined : 'exit'}
            variants={backdropVariants}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 z-50 h-full w-80 bg-dark-surface shadow-2xl lg:hidden overflow-y-auto border-l border-gray-700/30"
            role="dialog"
            aria-modal="true"
            aria-label="منوی ناوبری"
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            exit={shouldReduceMotion ? undefined : 'exit'}
            variants={drawerVariants}
          >
            {/* User info header */}
            {userInfo && (
              <motion.div
                className="p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  initial={shouldReduceMotion ? undefined : { rotate: 0 }}
                  animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="currentColor" />
                  </svg>
                </motion.div>

                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold"
                    initial={shouldReduceMotion ? undefined : { scale: 0 }}
                    animate={shouldReduceMotion ? undefined : { scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                  >
                    {userInfo.name.charAt(0)}
                  </motion.div>
                  <div>
                    <motion.p
                      className="font-semibold text-lg"
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      {userInfo.name}
                    </motion.p>
                    <motion.p
                      className="text-sm text-white/80"
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {userInfo.email}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation items */}
            <motion.nav
              className="p-4"
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              variants={staggerContainer}
            >
              <ul className="space-y-2">
                {items.map((item, index) => {
                  const isActive = currentPath === item.href;

                  if (item.onClick) {
                    // Button item (like logout)
                    return (
                      <motion.li
                        key={`${item.href}-${index}`}
                        variants={listItemVariants}
                      >
                        <motion.button
                          onClick={() => {
                            item.onClick?.();
                            onClose();
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors text-gray-300 hover:bg-dark-bg hover:text-white"
                          whileHover={shouldReduceMotion ? {} : { x: 5 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <span className="flex-shrink-0 w-6 h-6">{item.icon}</span>
                          <span>{item.label}</span>
                        </motion.button>
                      </motion.li>
                    );
                  }

                  // Link item
                  return (
                    <motion.li key={item.href} variants={listItemVariants}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors relative overflow-hidden ${
                          isActive
                            ? 'bg-primary-600/20 text-primary-400 font-semibold border border-primary-500/30'
                            : 'text-gray-300 hover:bg-dark-bg hover:text-white'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Active indicator */}
                        {isActive && !shouldReduceMotion && (
                          <motion.div
                            className="absolute right-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-full"
                            layoutId="activeDrawerItem"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        <motion.span
                          className="flex-shrink-0 w-6 h-6 relative z-10"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 10 }}
                        >
                          {item.icon}
                        </motion.span>
                        <motion.span
                          className="relative z-10"
                          whileHover={shouldReduceMotion ? {} : { x: 5 }}
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:bg-dark-bg hover:text-white rounded-full transition-colors"
              aria-label="بستن منو"
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 90 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationDrawer;
