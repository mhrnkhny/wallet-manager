# Animation System Documentation

This document describes the professional animation system implemented in the Persian Bank Transaction Management application using Framer Motion.

## Overview

The application now features a comprehensive animation system that provides smooth, delightful interactions while respecting user preferences and maintaining excellent performance.

## Core Animation Features

### 1. Centralized Configuration

All animations are configured in `/components/animations/AnimationConfig.ts`:

- **Durations**: Standardized timing (fast: 200ms, normal: 300ms, slow: 400ms)
- **Easing Functions**: Consistent easing curves across the app
- **Spring Physics**: Natural motion with configurable stiffness and damping
- **Variants**: Reusable animation patterns for common use cases
- **Accessibility**: Automatic detection of `prefers-reduced-motion`

### 2. Animation Utilities

#### PageTransition
- Location: `/components/animations/PageTransition.tsx`
- Purpose: Smooth page transitions for route changes
- Usage: Wrap page content for fade-in effects

#### AnimatedList
- Location: `/components/animations/AnimatedList.tsx`
- Purpose: Stagger animations for list items
- Features:
  - Automatic staggered children animations
  - Configurable delay between items
  - Exit animations for removed items

#### FadeIn
- Location: `/components/animations/FadeIn.tsx`
- Purpose: Generic fade-in wrapper
- Variants: fade, slideUp, scale

#### CountingNumber
- Location: `/components/animations/CountingNumber.tsx`
- Purpose: Animated number counting
- Features:
  - Smooth spring-based animation
  - Persian number formatting
  - Configurable duration

## Component Animations

### UI Components

#### Button (`/components/ui/Button.tsx`)
**Animations:**
- Ripple effect on click
- Scale animation on press (0.95)
- Hover scale (1.02)
- Smooth loading spinner rotation
- Icon fade-in for startIcon/endIcon

**Performance:**
- Hardware-accelerated transforms
- Optimized ripple cleanup
- Respects reduced motion preferences

#### Card (`/components/ui/Card.tsx`)
**Animations:**
- Slide-up entrance animation
- Hover lift effect (translateY: -4px)
- Shadow transitions on hover
- Optional entrance/exit animations

**Props:**
- `animate`: Enable/disable entrance animation
- `hoverable`: Enable hover effects

#### Modal (`/components/ui/Modal.tsx`)
**Animations:**
- Backdrop fade-in (opacity 0 → 1)
- Modal scale and fade from center
- Staggered content reveal (header → content → actions)
- Smooth exit animations
- AnimatePresence for proper unmounting

**Timing:**
- Backdrop: 300ms
- Modal entrance: Spring physics with delay
- Content stagger: 50ms between sections

#### Snackbar (`/components/ui/Snackbar.tsx`)
**Animations:**
- Slide-up from bottom with spring physics
- Icon pop-in animation
- Animated progress bar
- Auto-dismiss with smooth exit
- Close button hover scale

**Features:**
- Severity-based icons with animations
- Progress bar shows remaining time
- Smooth exit on close or timeout

#### TextField (`/components/ui/TextField.tsx`)
**Animations:**
- Label color transition on focus
- Input subtle scale on focus (1.01)
- Focus ring fade-in/out
- Error icon spin-in animation
- Error message slide-in from left

**Interactions:**
- Smooth border color transitions
- Adornment fade-in
- Error shake animation (via icon rotation)

### Layout Components

#### FAB (`/components/layout/FAB.tsx`)
**Animations:**
- Scale-in entrance from 0 with rotation
- Ripple effect on click
- Hover scale (1.1)
- Tap scale (0.9)
- Icon rotation on entrance

**Features:**
- Extended variant with label fade-in
- Position-aware animations
- Bouncy spring physics

#### BottomNavigation (`/components/layout/BottomNavigation.tsx`)
**Animations:**
- Slide-up from bottom on mount
- Active indicator smooth transition (layoutId)
- Icon scale on selection
- Ripple effect on tap
- Staggered item entrance

**Interactions:**
- Active tab scale (1.1) and lift (y: -2)
- Smooth color transitions
- Tap feedback

#### NavigationDrawer (`/components/layout/NavigationDrawer.tsx`)
**Animations:**
- Backdrop fade-in
- Drawer slide-in from right (RTL)
- User avatar scale-in with rotation
- Staggered menu items
- Active indicator transition (layoutId)
- Close button rotate on hover (90deg)

**Interactions:**
- Menu item hover slide effect (x: 5)
- Icon hover scale and rotation
- Background pattern rotation (30s loop)

### Banking Components

#### BankCard (`/components/banking/BankCard.tsx`)
**Animations:**
- Flip animation on hover (3D rotateY)
- Shimmer gradient effect (infinite loop)
- Slide-up entrance
- Hover shadow enhancement
- Background pattern slow rotation
- Staggered content reveal

**Variants:**
- Default: Full card with flip
- Compact: Simplified without flip

**Features:**
- Card front with all details
- Card back with CVV section
- 3D transform with backface-visibility
- Gradient shimmer (3s loop)

#### TransactionCard (`/components/banking/TransactionCard.tsx`)
**Animations:**
- Swipe-to-delete gesture (drag to left)
- Slide-in entrance
- Icon bounce-in
- Amount scale-in
- Hover shadow
- Delete background reveal on swipe

**Interactions:**
- Drag constraint: -150px to 0
- Delete threshold: -100px
- Smooth snap-back on cancel
- Opacity fade based on drag distance

#### BalanceDisplay (`/components/banking/BalanceDisplay.tsx`)
**Animations:**
- Animated number counting
- Pulsing background circles
- Staggered stats reveal
- Hover scale on stat cards (1.05)
- Icon rotation on hover (180deg)

**Features:**
- Two animated background orbs
- CountingNumber integration
- Income/expenses cards with hover effects

#### EmptyState (`/components/banking/EmptyState.tsx`)
**Animations:**
- Icon scale-in with rotation
- Staggered text reveal
- Button fade-in with scale
- Smooth entrance

**Timing:**
- Icon: Spring physics
- Title: 200ms delay
- Description: 300ms delay
- Button: 400ms delay + spring

#### LoadingState (`/components/banking/LoadingState.tsx`)
**Animations:**
- Spinning loader (360deg continuous)
- Pulsing skeleton elements (opacity: 0.4 ↔ 0.6)
- Staggered skeleton cards

**Variants:**
- Page: Centered spinner
- List: Row skeletons
- Card: Grid skeletons

## Performance Optimizations

### Hardware Acceleration
All transforms use GPU-accelerated properties:
- `transform` (translateX, translateY, scale, rotate)
- `opacity`
- Avoid animating `width`, `height`, `margin`, `padding`

### Reduced Motion Support
```typescript
const shouldReduceMotion = prefersReducedMotion();
```
- Checks `prefers-reduced-motion` media query
- Disables animations when user prefers reduced motion
- All components respect this preference

### Animation Cleanup
- Ripple effects auto-cleanup after 600ms
- Proper unmounting with AnimatePresence
- Event listener cleanup in useEffect

### Debouncing
- Expensive animations are debounced
- Gesture velocity considered for smooth interactions

## Usage Examples

### Basic Component Animation
```tsx
import { motion } from 'framer-motion';
import { slideUpVariants } from '@/components/animations';

<motion.div
  initial="hidden"
  animate="visible"
  variants={slideUpVariants}
>
  Content
</motion.div>
```

### Page Transition
```tsx
import { PageTransition } from '@/components/animations';

export default function Page() {
  return (
    <PageTransition>
      <YourPageContent />
    </PageTransition>
  );
}
```

### Animated List
```tsx
import { AnimatedList, AnimatedListItem } from '@/components/animations';

<AnimatedList>
  {items.map((item) => (
    <AnimatedListItem key={item.id}>
      <ItemComponent {...item} />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

### Counting Numbers
```tsx
import { CountingNumber } from '@/components/animations';

<CountingNumber
  value={balance}
  duration={1.5}
  format={(v) => v.toLocaleString('fa-IR')}
/>
```

## Animation Guidelines

### Duration Guidelines
- **Micro-interactions**: 200ms (hover, tap)
- **Component entrance**: 300-400ms
- **Page transitions**: 400-600ms
- **Number counting**: 1000-1500ms

### Easing Guidelines
- **Entrance**: easeOut
- **Exit**: easeIn
- **Two-way**: easeInOut
- **Bouncy**: Spring physics

### Motion Principles
1. **Purposeful**: Every animation has a reason
2. **Subtle**: Enhances, doesn't distract
3. **Consistent**: Same duration/easing for similar actions
4. **Responsive**: Fast feedback on interactions
5. **Accessible**: Respects user preferences

## RTL Considerations
All animations work correctly in RTL mode:
- Drawer slides from right
- Swipe gestures reversed (swipe left to delete)
- Horizontal animations respect text direction

## Browser Compatibility
- Modern browsers with CSS transform support
- Framer Motion handles fallbacks
- Reduced motion as progressive enhancement

## File Structure
```
/components/animations/
├── AnimationConfig.ts    # Central configuration
├── PageTransition.tsx    # Page transitions
├── AnimatedList.tsx      # List animations
├── FadeIn.tsx           # Fade utilities
├── CountingNumber.tsx   # Number animations
└── index.ts             # Exports

/components/ui/          # Animated UI components
/components/layout/      # Animated layout components
/components/banking/     # Animated banking components
```

## Testing Animations

### Manual Testing
1. Test with `prefers-reduced-motion` enabled
2. Test on mobile devices (touch gestures)
3. Test page transitions between routes
4. Test list animations with many items
5. Verify performance (60fps)

### Performance Monitoring
- Chrome DevTools Performance panel
- Check for layout thrashing
- Monitor frame rates during animations
- Verify GPU acceleration (green layers)

## Future Enhancements
- [ ] Page transition variants (slide, fade, scale)
- [ ] More gesture controls
- [ ] Shared element transitions
- [ ] Loading progress animations
- [ ] Success/error animations
- [ ] Haptic feedback integration

## Credits
Built with [Framer Motion](https://www.framer.com/motion/) v11+
