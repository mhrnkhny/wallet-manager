# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Persian-language bank transaction management system built with Next.js 16, TypeScript, and MySQL. The application provides complete authentication, bank card management, and transaction tracking with Jalali (Persian) date support.

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Setup MySQL database (requires MySQL Server on port 8080)
mysql -h 127.0.0.1 -P 8080 -u root -p < database.sql
```

### Development
```bash
# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

## Environment Configuration

Required `.env.local` variables:
```
DB_HOST=127.0.0.1
DB_PORT=8080
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bank_transactions
JWT_SECRET=your-secret-key-change-this-in-production
```

Note: MySQL runs on port 8080 (not default 3306).

## Architecture

### Database Layer

- **Connection**: MySQL connection pool configured in `lib/db.ts`
- **Database**: Hardcoded to 127.0.0.1:8080 in connection pool
- **Schema**: Three main tables (users, bank_cards, transactions) with foreign key relationships
- **Character Set**: utf8mb4_unicode_ci for full Unicode support including Persian text

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

**Cards endpoints:**
- `GET /api/cards` - List user's bank cards
- `POST /api/cards` - Add new card (16-digit card number)
- `DELETE /api/cards/[id]` - Delete card (cascades to transactions)

**Transactions endpoints:**
- `GET /api/transactions` - List user's transactions with card details
- `POST /api/transactions` - Create transaction (deposit/withdrawal)
- `DELETE /api/transactions/[id]` - Delete transaction

### Frontend Structure

- **Layout**: Right-to-left (RTL) Persian interface using `dir="rtl"`
- **Styling**: Tailwind CSS v4 with PostCSS
- **Pages**: App Router with layout nesting
  - `/` - Landing page
  - `/register`, `/login` - Authentication
  - `/dashboard` - Protected dashboard layout with nav
  - `/dashboard/cards` - Card management
  - `/dashboard/transactions` - Transaction list
  - `/dashboard/transactions/new` - Create transaction form
- **Navigation**: Client-side routing with shared dashboard layout (lib/dashboard/layout.tsx:6)
- **Date Handling**: moment-jalaali for Persian calendar support

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
- Deleting a user cascades to their cards and transactions
- Deleting a card cascades to its transactions
- Always query by user_id to enforce ownership

### Client Components
- Dashboard layout uses `'use client'` directive for router hooks
- Form pages use client components for state management
- Server components used for data fetching where possible

### Transaction Types
- Database ENUM: 'deposit' or 'withdrawal'
- Amount stored as DECIMAL(15, 2) for precise financial calculations
- Dates stored as DATE type, displayed in Jalali format

### Security Considerations
- JWT_SECRET must be changed in production
- Cookies set with httpOnly flag
- Secure flag enabled in production (NODE_ENV check)
- Passwords hashed before storage
- Session-based authorization on all protected routes
