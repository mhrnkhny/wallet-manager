# Design System Specification
## Persian Bank Transaction Management - Material Design Implementation

---

## 1. Design Philosophy

### Core Principles
1. **Trust First** - Professional, secure, reliable appearance
2. **Clarity** - Information hierarchy optimized for financial data
3. **Efficiency** - Minimize friction in common tasks
4. **Accessibility** - WCAG AA compliant, Persian-optimized
5. **Responsiveness** - Mobile-first, seamless across devices

### Material Design 3 Foundation
Following Google's Material Design guidelines with Persian banking customizations.

---

## 2. Color System

### 2.1 Primary Palette (Trust & Reliability)
```css
/* Primary Blue - Main brand color */
--primary-50: #E3F2FD;
--primary-100: #BBDEFB;
--primary-200: #90CAF9;
--primary-300: #64B5F6;
--primary-400: #42A5F5;
--primary-500: #2196F3;  /* Main */
--primary-600: #1E88E5;
--primary-700: #1976D2;
--primary-800: #1565C0;
--primary-900: #0D47A1;
```

### 2.2 Secondary Palette (Accents)
```css
/* Teal - Modern banking accent */
--secondary-50: #E0F2F1;
--secondary-100: #B2DFDB;
--secondary-200: #80CBC4;
--secondary-300: #4DB6AC;
--secondary-400: #26A69A;
--secondary-500: #009688;  /* Main */
--secondary-600: #00897B;
--secondary-700: #00796B;
--secondary-800: #00695C;
--secondary-900: #004D40;
```

### 2.3 Semantic Colors
```css
/* Success - Deposits, Confirmations */
--success-50: #E8F5E9;
--success-500: #4CAF50;
--success-700: #388E3C;

/* Warning - Alerts, Pending */
--warning-50: #FFF3E0;
--warning-500: #FF9800;
--warning-700: #F57C00;

/* Error - Withdrawals, Errors */
--error-50: #FFEBEE;
--error-500: #F44336;
--error-700: #D32F2F;

/* Info - Informational messages */
--info-50: #E3F2FD;
--info-500: #2196F3;
--info-700: #1976D2;
```

### 2.4 Neutral Palette
```css
/* Grays for UI elements */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #EEEEEE;
--gray-300: #E0E0E0;
--gray-400: #BDBDBD;
--gray-500: #9E9E9E;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;
```

### 2.5 Background & Surface
```css
--background-default: #FAFAFA;  /* Page background */
--surface-default: #FFFFFF;     /* Card/paper background */
--surface-raised: #FFFFFF;      /* Elevated cards */
--surface-overlay: rgba(0, 0, 0, 0.5);  /* Modal backdrop */
```

### 2.6 Text Colors
```css
--text-primary: rgba(0, 0, 0, 0.87);    /* Main text */
--text-secondary: rgba(0, 0, 0, 0.60);  /* Secondary text */
--text-disabled: rgba(0, 0, 0, 0.38);   /* Disabled text */
--text-hint: rgba(0, 0, 0, 0.38);       /* Hints/placeholders */

/* On colored backgrounds */
--text-on-primary: #FFFFFF;
--text-on-secondary: #FFFFFF;
--text-on-error: #FFFFFF;
```

---

## 3. Typography

### 3.1 Font Stack (Persian-Optimized)
```css
--font-primary: 'Vazir', 'Shabnam', 'Yekan', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Vazir Code', 'SF Mono', Monaco, 'Courier New', monospace;
```

### 3.2 Type Scale
```css
/* Display - Hero sections */
--text-display-large: 57px / 3.5625rem;
--text-display-medium: 45px / 2.8125rem;
--text-display-small: 36px / 2.25rem;

/* Headline - Page titles */
--text-headline-large: 32px / 2rem;      /* H1 */
--text-headline-medium: 28px / 1.75rem;  /* H2 */
--text-headline-small: 24px / 1.5rem;    /* H3 */

/* Title - Section headers */
--text-title-large: 22px / 1.375rem;
--text-title-medium: 16px / 1rem;
--text-title-small: 14px / 0.875rem;

/* Body - Main content */
--text-body-large: 16px / 1rem;
--text-body-medium: 14px / 0.875rem;
--text-body-small: 12px / 0.75rem;

/* Label - Buttons, labels */
--text-label-large: 14px / 0.875rem;
--text-label-medium: 12px / 0.75rem;
--text-label-small: 11px / 0.6875rem;
```

### 3.3 Font Weights
```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 3.4 Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

### 3.5 Letter Spacing
```css
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
```

---

## 4. Spacing System (8px Grid)

```css
--spacing-0: 0;
--spacing-1: 4px;   /* 0.25rem */
--spacing-2: 8px;   /* 0.5rem */
--spacing-3: 12px;  /* 0.75rem */
--spacing-4: 16px;  /* 1rem */
--spacing-5: 20px;  /* 1.25rem */
--spacing-6: 24px;  /* 1.5rem */
--spacing-8: 32px;  /* 2rem */
--spacing-10: 40px; /* 2.5rem */
--spacing-12: 48px; /* 3rem */
--spacing-16: 64px; /* 4rem */
--spacing-20: 80px; /* 5rem */
--spacing-24: 96px; /* 6rem */
```

**Usage Guidelines:**
- Component padding: 16px (md) or 24px (lg)
- Section spacing: 32px (xl) or 48px (2xl)
- Grid gaps: 16px (md) or 24px (lg)
- Button padding: 8px 16px (sm md)

---

## 5. Border Radius

```css
--radius-none: 0;
--radius-sm: 4px;   /* Buttons, small elements */
--radius-md: 8px;   /* Cards, inputs */
--radius-lg: 12px;  /* Large cards */
--radius-xl: 16px;  /* Modals, sheets */
--radius-2xl: 24px; /* Extra large containers */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 6. Elevation (Material Shadows)

```css
/* Level 0 - No elevation */
--shadow-none: none;

/* Level 1 - Resting cards */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Level 2 - Raised cards */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Level 3 - Dropdown menus */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Level 4 - Modals, Dialogs */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Level 5 - Floating Action Button */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## 7. Component Specifications

### 7.1 Buttons

#### **Filled Button (Primary CTA)**
```css
Padding: 10px 24px (height: 40px)
Border Radius: 4px (sm)
Font: 14px / medium weight
Text Transform: none (preserve Persian)
Colors:
  - Primary: bg-primary-600, text-white
  - Hover: bg-primary-700
  - Active: bg-primary-800
  - Disabled: bg-gray-300, text-gray-500
Elevation: 2dp → 4dp on hover
```

#### **Outlined Button (Secondary)**
```css
Padding: 10px 24px
Border: 1px solid primary-600
Colors:
  - Default: border-primary-600, text-primary-700
  - Hover: bg-primary-50
Elevation: none → 1dp on hover
```

#### **Text Button (Tertiary)**
```css
Padding: 10px 16px
Colors:
  - Default: text-primary-600
  - Hover: bg-primary-50
Elevation: none
```

#### **Icon Button**
```css
Size: 40x40px (minimum touch target 48x48px)
Border Radius: full
Icon Size: 24x24px
Hover: bg-gray-100
```

#### **FAB (Floating Action Button)**
```css
Size: 56x56px
Border Radius: 16px (lg)
Icon Size: 24x24px
Colors: bg-primary-600, text-white
Elevation: 6dp → 12dp on hover
Position: fixed bottom-16 right-16 (LTR)
```

### 7.2 Cards

#### **Basic Card**
```css
Background: surface-default (#FFFFFF)
Border Radius: 8px (md)
Padding: 16px
Elevation: 1dp (shadow-sm)
Hover: 2dp (shadow-md)
```

#### **Outlined Card**
```css
Background: transparent
Border: 1px solid gray-200
Border Radius: 8px
Padding: 16px
```

#### **Bank Card Visual**
```css
Width: 100% (max 340px)
Height: 200px
Border Radius: 16px (xl)
Gradient: bank-specific
Padding: 20px
Typography:
  - Card Number: 18px mono
  - Bank Name: 16px medium
  - Holder Name: 14px regular
```

### 7.3 Text Fields

#### **Outlined TextField**
```css
Height: 56px
Border: 1px solid gray-400
Border Radius: 4px (sm)
Padding: 16px
Font: 16px / regular

States:
  - Default: border-gray-400
  - Focus: border-primary-600, ring-2 ring-primary-200
  - Error: border-error-500, ring-error-200
  - Disabled: bg-gray-100, border-gray-300

Label:
  - Position: absolute top-0 (floating label)
  - Font: 12px when floating, 16px when inline
```

#### **Helper Text**
```css
Font: 12px / regular
Color: text-secondary
Margin Top: 4px
```

#### **Error Text**
```css
Font: 12px / regular
Color: error-700
Icon: error icon 16px
```

### 7.4 Select / Dropdown

```css
Same as TextField with:
  - Dropdown icon: chevron-down 24px
  - Menu: shadow-lg, max-height 300px
  - Menu Items: padding 12px 16px, hover bg-gray-100
```

### 7.5 Navigation

#### **App Bar (Top)**
```css
Height: 64px
Background: surface-default
Elevation: 0dp (bordered) or 1dp
Padding: 0 16px

Content:
  - Menu Icon: 40x40px button (mobile only)
  - Title: 20px / medium
  - Actions: 40x40px icon buttons
```

#### **Bottom Navigation (Mobile)**
```css
Height: 56px
Background: surface-default
Elevation: 3dp
Position: fixed bottom-0

Items (3-5):
  - Width: equal flex
  - Icon: 24x24px
  - Label: 12px / medium
  - Active: primary-600 color
  - Inactive: gray-600 color
```

#### **Navigation Drawer**
```css
Width: 280px (mobile full-width)
Background: surface-default
Elevation: 4dp

Header: 64px height, user info
Items: 48px height, padding 0 16px
Active: bg-primary-50, text-primary-700
Divider: border-t border-gray-200
```

### 7.6 Modals / Dialogs

```css
Max Width: 560px
Border Radius: 16px (xl)
Padding: 24px
Elevation: 5dp (shadow-2xl)

Title: 24px / medium, mb-16
Content: scrollable, max-height 60vh
Actions: flex justify-end, gap-8px, mt-24px
```

### 7.7 Snackbar / Toast

```css
Min Width: 344px (mobile: 100% - 32px)
Height: auto (min 48px)
Border Radius: 4px (sm)
Padding: 14px 16px
Position: fixed bottom-16 left-50% (transform)

Variants:
  - Info: bg-gray-800, text-white
  - Success: bg-success-700, text-white
  - Warning: bg-warning-700, text-white
  - Error: bg-error-700, text-white

Action Button: text-white, padding 8px
Close Icon: 20x20px, opacity-70
```

### 7.8 Empty State

```css
Container: text-center, padding 48px 24px
Icon: 64x64px, color-gray-400
Title: 20px / medium, color-gray-700
Description: 14px / regular, color-gray-600
CTA Button: mt-24px
```

### 7.9 Loading State

#### **Skeleton Loader**
```css
Background: linear-gradient(90deg, gray-200 0%, gray-300 50%, gray-200 100%)
Animation: shimmer 1.5s infinite
Border Radius: matches content (4px, 8px, full)
```

#### **Circular Progress**
```css
Size: 40px (md), 32px (sm), 24px (xs)
Color: primary-600
Stroke Width: 4px
```

### 7.10 Lists

```css
List Item:
  - Height: 56px (single line), 72px (two lines)
  - Padding: 16px
  - Border Bottom: 1px solid gray-200
  - Hover: bg-gray-50

List Item Avatar: 40x40px, border-radius full
List Item Icon: 24x24px, margin-right 16px
List Item Text:
  - Primary: 16px / regular
  - Secondary: 14px / regular, color-gray-600
```

---

## 8. Layout System

### 8.1 Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Max width with padding */
max-width: 1280px;
margin: 0 auto;
padding: 0 16px (mobile), 0 24px (tablet+);
```

### 8.2 Grid System
```css
/* 12-column grid */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 16px (mobile), 24px (desktop);

/* Responsive spans */
Mobile: col-span-12 (full width)
Tablet: col-span-6 (half), col-span-4 (third)
Desktop: col-span-3 (quarter), col-span-4 (third)
```

### 8.3 Breakpoints
```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
```

---

## 9. Motion & Animation

### 9.1 Duration
```css
--duration-fast: 150ms;      /* Small UI changes */
--duration-normal: 250ms;    /* Standard transitions */
--duration-slow: 400ms;      /* Complex animations */
```

### 9.2 Easing Functions
```css
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);  /* General */
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1); /* Enter */
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);   /* Exit */
```

### 9.3 Common Transitions
```css
/* Buttons, cards */
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Hover scale */
transform: scale(1.02);

/* Fade in/out */
opacity: 0 → 1;
transition: opacity 250ms;
```

---

## 10. Iconography

### 10.1 Icon Sizes
```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;  /* Default */
--icon-lg: 32px;
--icon-xl: 48px;
```

### 10.2 Icon Usage
- **Navigation:** 24px
- **Buttons:** 18px-20px
- **List Items:** 24px
- **Input Adornments:** 20px
- **Empty States:** 64px

### 10.3 Recommended Icons (Material Symbols)
```
- home
- credit_card
- account_balance_wallet
- add
- delete
- edit
- more_vert
- arrow_back
- menu
- close
- check_circle
- error
- info
- warning
```

---

## 11. Banking-Specific Components

### 11.1 Transaction Card
```css
Container:
  - Card with md radius
  - Padding: 16px
  - Border-left: 4px solid (green for deposit, red for withdrawal)

Layout:
  - Flex row space-between
  - Left: Icon + Title/Date
  - Right: Amount (bold, colored)

Typography:
  - Title: 16px / medium
  - Date: 12px / regular, gray-600
  - Amount: 18px / bold, colored
```

### 11.2 Balance Display
```css
Container:
  - Large card with gradient background
  - Padding: 24px
  - Border Radius: 16px

Typography:
  - Label: 14px / medium, opacity-80
  - Amount: 36px / bold
  - Currency: 18px / medium
```

### 11.3 Card Selector
```css
Visual card representation (mini)
Width: 100%
Height: 100px
Border Radius: 12px
Gradient: bank-specific
Active: ring-2 ring-primary-600
```

---

## 12. Accessibility Guidelines

### 12.1 Color Contrast
- Text on background: ≥ 4.5:1
- Large text (18px+): ≥ 3:1
- UI components: ≥ 3:1

### 12.2 Focus States
```css
outline: 2px solid primary-600;
outline-offset: 2px;
```

### 12.3 Touch Targets
Minimum: 48x48px (including padding)

### 12.4 ARIA Labels
```html
<!-- Buttons -->
<button aria-label="افزودن تراکنش جدید">...</button>

<!-- Icon-only buttons -->
<button aria-label="حذف">
  <DeleteIcon aria-hidden="true" />
</button>

<!-- Form fields -->
<input aria-describedby="email-helper" aria-invalid="false" />
```

---

## 13. Persian-Specific Considerations

### 13.1 RTL Layout
```css
direction: rtl;
text-align: right;

/* Tailwind utilities */
mr-4 → ml-4 (auto-reversed)
```

### 13.2 Number Formatting
```javascript
// Use Persian numerals in UI
new Intl.NumberFormat('fa-IR').format(amount);

// But keep Latin numerals in forms for better input
```

### 13.3 Date Display
```javascript
// Always use Jalali calendar
import moment from 'moment-jalaali';
moment().format('jYYYY/jMM/jDD');
```

---

## 14. Implementation Priority

### Week 1: Foundation
✅ Color system in Tailwind config
✅ Typography setup (Vazir font)
✅ Spacing utilities
✅ Button components (all variants)
✅ Card components
✅ TextField components

### Week 1-2: Layout
✅ AppBar component
✅ Navigation Drawer
✅ Bottom Navigation
✅ Container/Grid system
✅ Page layouts

### Week 2: Data Display
✅ Transaction card
✅ Bank card visual
✅ Lists
✅ Empty states
✅ Loading states

### Week 2: Feedback
✅ Snackbar/Toast
✅ Modal/Dialog
✅ Validation messages
✅ Progress indicators

---

## 15. Tailwind Configuration

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* 50-900 */ },
        secondary: { /* 50-900 */ },
        success: { /* 50-900 */ },
        error: { /* 50-900 */ },
        warning: { /* 50-900 */ },
      },
      fontFamily: {
        sans: ['Vazir', 'Shabnam', 'sans-serif'],
        mono: ['Vazir Code', 'monospace'],
      },
      spacing: { /* 8px grid */ },
      borderRadius: { /* sm to 2xl */ },
      boxShadow: { /* elevation levels */ },
    },
  },
  plugins: [],
}
```

---

**Document Status:** Ready for Implementation
**Version:** 1.0
**Date:** 2025-10-23
