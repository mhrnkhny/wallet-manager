# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A comprehensive Persian-language financial management Progressive Web App (PWA) built with Next.js 16, TypeScript, and MySQL. Features include:
- Complete authentication system with profile management
- Bank card management with real-time balance tracking
- Transaction recording (deposits/withdrawals) with Jalali calendar support
- Friend cards storage for quick transfers
- Installment payment tracking with payment schedules
- Material Design 3 inspired UI with smooth animations
- Responsive design with mobile-first approach
- Data visualization with charts and analytics

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Setup MySQL database (default port 3306, but check .env.local for actual port)
mysql -h 127.0.0.1 -P 3306 -u root -p < database.sql

# Apply migrations (run in order after database.sql)
mysql -h 127.0.0.1 -P 3306 -u root -p bank_transactions < database_add_balance.sql
mysql -h 127.0.0.1 -P 3306 -u root -p bank_transactions < database_migration_add_card_fields.sql
mysql -h 127.0.0.1 -P 3306 -u root -p bank_transactions < database_migration_friend_cards.sql
mysql -h 127.0.0.1 -P 3306 -u root -p bank_transactions < database_migration_installments.sql
mysql -h 127.0.0.1 -P 3306 -u root -p bank_transactions < database_migration_installment_payments.sql
```

### Development
```bash
# Run development server with Turbopack (localhost:3000) - faster HMR
npm run dev

# Build for production with Webpack (for PWA support)
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

**Note**: We use a hybrid approach to get the best of both worlds:
- **Development**: Turbopack for faster Hot Module Replacement (HMR) and dev server startup (~1.6s)
  - PWA plugin is NOT applied in dev mode to avoid webpack/turbopack conflicts
  - No webpack warnings with Turbopack
- **Production Build**: Webpack for full PWA support with @ducanh2912/next-pwa
  - Service worker generation and workbox caching strategies
  - Full offline support and installability

## Environment Configuration

Required `.env.local` variables:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bank_transactions
JWT_SECRET=your-secret-key-change-this-in-production
```

**Note**: Default MySQL port is 3306. The database connection in `lib/db.ts` reads from environment variables with 3306 as fallback.

## Architecture

### Database Layer

- **Connection**: MySQL connection pool configured in `lib/db.ts` using mysql2/promise
- **Schema**: Five main tables with foreign key relationships:
  - `users` - User accounts with authentication
  - `bank_cards` - User's bank cards with balance tracking
  - `transactions` - Deposit/withdrawal transactions linked to cards
  - `friend_cards` - Stored card info of friends for easy transfers
  - `installments` - Installment payment tracking
  - `installment_payments` - Individual payments for installments
- **Character Set**: utf8mb4_unicode_ci for full Unicode support including Persian text
- **Migrations**: Database updates are in separate SQL files (`database_migration_*.sql`)

### Authentication System

Located in `lib/auth.ts`:
- JWT-based authentication using `jose` library
- Tokens stored in HTTP-only cookies (7-day expiration)
- Session helpers: `getSession()`, `requireAuth()`
- Password hashing with bcryptjs (cost factor: 10)

### API Routes Structure

All routes follow Next.js 16 App Router conventions (`app/api/`):

**Auth endpoints:**
- `POST /api/auth/register` - Create user, hash password, return JWT
- `POST /api/auth/login` - Verify credentials, return JWT
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/change-password` - Change user password

**Cards endpoints:**
- `GET /api/cards` - List user's bank cards with balances
- `POST /api/cards` - Add new card (validates 16-digit number, CVV2, Sheba, expiry date)
- `DELETE /api/cards/[id]` - Delete card (cascades to transactions)

**Transactions endpoints:**
- `GET /api/transactions` - List user's transactions with card details (includes Jalali dates)
- `POST /api/transactions` - Create transaction (deposit/withdrawal, updates card balance)
- `DELETE /api/transactions/[id]` - Delete transaction

**Friend Cards endpoints:**
- `GET /api/friend-cards` - List saved friend cards
- `POST /api/friend-cards` - Add friend card (card number, Sheba, title)
- `PUT /api/friend-cards/[id]` - Update friend card
- `DELETE /api/friend-cards/[id]` - Delete friend card

**Installments endpoints:**
- `GET /api/installments` - List installments with payment summary
- `POST /api/installments` - Create new installment plan
- `PUT /api/installments/[id]` - Update installment
- `DELETE /api/installments/[id]` - Delete installment
- `GET /api/installments/[id]/payments` - Get payments for installment
- `POST /api/installments/[id]/payments` - Record installment payment

### Frontend Structure

- **Layout**: Right-to-left (RTL) Persian interface using `dir="rtl"`
- **Styling**: Tailwind CSS v3 with custom design system
  - Dark theme with primary colors (dark-bg: #0F1419, dark-card: #1A1D2E, dark-surface: #262A3F)
  - Material Design 3 inspired color palette (primary, secondary, success, warning, error, info)
  - Accent colors for highlights (pink, purple, blue gradients)
  - Persian font: Vazir as default sans-serif
  - Custom animations: slide-up, fade-in, scale-in
  - Responsive shadows: sm, md, lg, xl, 2xl
- **UI Components** (`components/` directory):
  - `ui/` - Reusable components (Button, TextField, Select, Card, Modal, DatePicker, IconButton, Snackbar)
  - `layout/` - Layout components (AppBar, BottomNavigation, NavigationDrawer, Container, FAB)
  - `banking/` - Domain-specific components (BankCard, TransactionCard, FriendCard, InstallmentCard, BalanceDisplay, EmptyState, LoadingState)
  - `animations/` - Animation wrappers (FadeIn, PageTransition, AnimatedList, CountingNumber)
  - `charts/` - Data visualization (PieChart, BarChart, TrendChart using recharts)
- **Pages**: App Router with layout nesting
  - `/` - Landing page
  - `/register`, `/login` - Authentication
  - `/dashboard` - Protected dashboard with navigation
  - `/dashboard/cards` - Bank card management
  - `/dashboard/transactions` - Transaction list
  - `/dashboard/transactions/new` - Create transaction
  - `/dashboard/friend-cards` - Manage friend cards
  - `/dashboard/friend-cards/new` - Add friend card
  - `/dashboard/friend-cards/edit/[id]` - Edit friend card
  - `/dashboard/installments` - Installment tracking
  - `/dashboard/installments/new` - Create installment
  - `/dashboard/installments/edit/[id]` - Edit installment
  - `/dashboard/profile` - User profile management
- **Navigation**: Client-side routing with shared dashboard layout (`app/dashboard/layout.tsx`)
  - Bottom navigation bar for mobile
  - Side drawer navigation with backdrop
  - Desktop top bar with action buttons
- **Date Handling**: moment-jalaali for Persian calendar support
- **Animations**: Framer Motion for page transitions and UI animations
- **PWA Support**: Configured with next-pwa, service worker caching for offline support

### Key Patterns

**Authentication Flow:**
1. API route calls `requireAuth()` helper
2. Helper extracts JWT from cookies
3. Verifies token and returns user payload
4. Throws error if unauthorized (caught by route handler)

**Database Queries:**
- Use mysql2/promise for async/await
- Parameterized queries to prevent SQL injection
- Type assertions: `const [result]: any = await db.query()`
- Foreign key constraints ensure referential integrity
- Database transactions for atomic operations (e.g., creating transaction + updating balance)
  ```typescript
  const connection = await db.getConnection();
  await connection.beginTransaction();
  try {
    // ... queries
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
  ```

**Error Handling:**
- Persian error messages in API responses
- 400 for validation errors
- 401 for auth failures
- 500 for server errors
- All errors logged to console

## Important Implementation Notes

### TypeScript Path Aliases
- `@/*` maps to root directory (configured in tsconfig.json)
- Import example: `import db from '@/lib/db'`

### Database Foreign Keys
- Deleting a user cascades to their cards, transactions, friend cards, and installments
- Deleting a card cascades to its transactions
- Deleting an installment cascades to its payments
- Always query by user_id to enforce ownership

### Card Balance Management
- Each bank card tracks its balance in DECIMAL(15, 2) format
- Transaction POST creates transaction AND updates card balance atomically
- Withdrawal validation prevents negative balances
- Balance displayed with Persian number formatting (`.toLocaleString('fa-IR')`)

### Client Components
- Dashboard layout uses `'use client'` directive for router hooks
- All form pages use client components for state management
- Server components used for data fetching where possible
- Animation components wrap client-side Framer Motion animations

### Transaction & Date Handling
- Transaction types: Database ENUM 'deposit' or 'withdrawal'
- Amounts stored as DECIMAL(15, 2) for precise financial calculations
- Dates stored as DATE type (Gregorian), converted to/from Jalali format
- Format: `jYYYY/jMM/jDD` for Persian calendar dates
- Conversion: `moment(jalaliDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')`

### Validation Patterns
- **Card Number**: 16 digits (`/^\d{16}$/`)
- **CVV2**: 3-4 digits (`/^\d{3,4}$/`)
- **Sheba Number**: 24 digits, optional IR prefix (`/^(IR)?\d{24}$/`)
- **Expiry Date**: MM/YY format (`/^\d{2}\/\d{2}$/`)
- All user-facing validation errors in Persian

### PWA Configuration
- Uses @ducanh2912/next-pwa (v10+)
- **Hybrid Approach**:
  - Development: PWA plugin is NOT loaded to allow clean Turbopack usage
  - Production: Full PWA support with webpack
  - This eliminates webpack/turbopack conflict warnings
- Service worker generated at `public/sw.js` (production only)
- Caching strategies:
  - Static assets (fonts, images, CSS, JS): StaleWhileRevalidate
  - API routes: NetworkFirst with 1-minute cache
  - External fonts (Google, jsDelivr): CacheFirst with 1-year expiration
- Additional features:
  - Cache on frontend navigation for faster page transitions
  - Automatic reload when connection restored
  - Skip waiting and clients claim for instant service worker activation
- **Implementation Detail**: The config conditionally applies `withPWA()` only in production:
  ```typescript
  export default process.env.NODE_ENV === "development"
    ? nextConfig
    : withPWA(nextConfig);
  ```

### Security Considerations
- JWT_SECRET must be changed in production
- Cookies set with httpOnly flag
- Secure flag enabled in production (NODE_ENV check)
- Passwords hashed with bcryptjs (cost factor: 10)
- Session-based authorization on all protected routes
- All database queries use parameterized statements
