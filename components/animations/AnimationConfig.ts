/**
 * Centralized animation configuration
 * All durations and easing functions in one place
 */

import { Transition, Variants } from 'framer-motion';

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Duration constants (in seconds)
export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
  slower: 0.6,
  slowest: 0.8,
} as const;

// Easing functions
export const EASINGS = {
  ease: [0.4, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  sharp: [0.4, 0.0, 0.6, 1],
} as const;

// Spring configurations
export const SPRINGS = {
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
} as const;

// Common transition presets
export const transitions = {
  fast: {
    duration: DURATIONS.fast,
    ease: EASINGS.easeOut,
  },
  normal: {
    duration: DURATIONS.normal,
    ease: EASINGS.easeInOut,
  },
  slow: {
    duration: DURATIONS.slow,
    ease: EASINGS.easeInOut,
  },
  spring: SPRINGS.gentle,
  springSnappy: SPRINGS.snappy,
  springBouncy: SPRINGS.bouncy,
} as const;

// Animation variants for common patterns
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: transitions.fast,
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: transitions.fast,
  },
};

export const scaleInVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: transitions.springBouncy,
  },
  exit: {
    scale: 0,
    transition: transitions.fast,
  },
};

// Stagger children configuration
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Hover and tap animations
export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast,
};

export const tapScale = {
  scale: 0.95,
  transition: transitions.fast,
};

export const hoverLift = {
  y: -4,
  transition: transitions.fast,
};

// Modal/Overlay animations
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.normal },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast },
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...transitions.spring,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitions.fast,
  },
};

// Drawer animations (for RTL)
export const drawerVariants: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeIn,
    },
  },
};

// Snackbar animations
export const snackbarVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.springSnappy,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: transitions.fast,
  },
};

// List item animations
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

// Page transition variants
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// Card flip animation
export const flipVariants = {
  front: {
    rotateY: 0,
    transition: transitions.normal,
  },
  back: {
    rotateY: 180,
    transition: transitions.normal,
  },
};

// Ripple effect configuration
export const rippleTransition: Transition = {
  duration: 0.6,
  ease: 'easeOut',
};
