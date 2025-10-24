# Quick Start Guide - Animations

## Installation
```bash
npm install framer-motion  # Already installed
```

## Import Animations
```tsx
// Page transitions
import { PageTransition } from '@/components/animations';

// List animations
import { AnimatedList, AnimatedListItem } from '@/components/animations';

// Fade animations
import { FadeIn } from '@/components/animations';

// Number counting
import { CountingNumber } from '@/components/animations';

// Direct Framer Motion
import { motion } from 'framer-motion';
import { slideUpVariants, fadeInVariants } from '@/components/animations';
```

## Quick Examples

### 1. Wrap a Page
```tsx
export default function MyPage() {
  return (
    <PageTransition>
      <h1>Page Content</h1>
    </PageTransition>
  );
}
```

### 2. Animate a List
```tsx
<AnimatedList>
  {items.map((item) => (
    <AnimatedListItem key={item.id}>
      <div>{item.name}</div>
    </AnimatedListItem>
  ))}
</AnimatedList>
```

### 3. Fade In Component
```tsx
<FadeIn variant="slideUp" delay={0.2}>
  <Card>Content</Card>
</FadeIn>
```

### 4. Counting Number
```tsx
<CountingNumber 
  value={10000} 
  format={(v) => v.toLocaleString('fa-IR')}
/>
```

### 5. Custom Motion Element
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### 6. Use Predefined Variants
```tsx
import { slideUpVariants } from '@/components/animations';

<motion.div
  initial="hidden"
  animate="visible"
  variants={slideUpVariants}
>
  Content
</motion.div>
```

## Component Features

### Button
- Automatic ripple effect on click
- Hover scale (1.02)
- Tap scale (0.95)
- Loading spinner animation

### Card
- Add `hoverable` prop for hover lift
- Add `animate={false}` to disable entrance

### Modal
- Automatic backdrop + scale animation
- Staggered content reveal
- Press ESC to close with animation

### BankCard
- Hover to flip (3D rotation)
- Shimmer gradient effect
- Use `variant="compact"` for simple version

### TransactionCard
- Swipe left to reveal delete
- Drag threshold: -100px
- Auto snap-back if not enough swipe

### BalanceDisplay
- Automatic number counting
- Pulsing background circles
- Hover effects on stat cards

## Animation Presets

```tsx
// Available variants
slideUpVariants    // Slide from bottom
slideDownVariants  // Slide from top
slideLeftVariants  // Slide from left (RTL aware)
slideRightVariants // Slide from right (RTL aware)
fadeInVariants     // Simple fade
scaleVariants      // Scale in
modalVariants      // Modal entrance
drawerVariants     // Drawer slide (RTL)
snackbarVariants   // Snackbar from bottom
```

## Transitions

```tsx
import { transitions } from '@/components/animations';

// Available transitions
transitions.fast       // 200ms
transitions.normal     // 300ms
transitions.slow       // 400ms
transitions.spring     // Spring physics
transitions.springSnappy  // Quick spring
transitions.springBouncy  // Bouncy spring
```

## Accessibility

All animations automatically respect `prefers-reduced-motion`:

```tsx
import { prefersReducedMotion } from '@/components/animations';

const shouldReduce = prefersReducedMotion();
// Returns true if user prefers reduced motion
```

## Best Practices

1. **Duration**: 200-400ms for UI, 400-600ms for pages
2. **Easing**: Use spring physics for natural feel
3. **Stagger**: 50-100ms delay between list items
4. **Performance**: Use transform & opacity (GPU accelerated)
5. **Cleanup**: Framer Motion handles cleanup automatically

## Common Patterns

### Hover Effect
```tsx
<motion.div whileHover={{ scale: 1.05 }}>
  Hover me
</motion.div>
```

### Tap Effect
```tsx
<motion.button whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```

### Stagger Children
```tsx
import { staggerContainer } from '@/components/animations';

<motion.div variants={staggerContainer}>
  {items.map(item => (
    <motion.div key={item.id} variants={listItemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### Exit Animation
```tsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {show && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

## Troubleshooting

**Animation not working?**
- Check if component has 'use client' directive
- Verify Framer Motion is installed
- Check console for errors

**Performance issues?**
- Reduce animation complexity
- Use transform/opacity only
- Check if too many simultaneous animations

**RTL issues?**
- Use provided variants (they're RTL aware)
- Test slide directions in RTL mode

## Files to Reference
- `/components/animations/AnimationConfig.ts` - All presets
- `/ANIMATIONS.md` - Full documentation
- `/ANIMATION_SUMMARY.md` - Implementation summary
