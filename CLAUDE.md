# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StreamCross is a multiplayer crossword game designed for Twitch streamers. Players in chat solve crossword puzzles together in real-time. The game features AI-generated crosswords, subscription-based player limits, and multi-language support.

## Commands

All commands should be run from the `/app` directory:

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Prisma commands (from root):
```bash
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Run migrations
```

## Architecture

### Tech Stack
- **Framework:** Next.js 16 with Pages Router (not App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js with Twitch OAuth
- **Styling:** Tailwind CSS 4 + CSS Modules
- **Real-time:** tmi.js for Twitch chat integration
- **AI:** Google Gemini API for crossword generation
- **Payments:** Stripe subscriptions

### Key Directories

```
app/
├── components/     # React components (Grid, Main, GameArea, Modal/)
├── pages/          # Next.js pages and API routes
│   └── api/        # Backend endpoints (level.ts, auth/, stripe/)
├── services/       # Business logic (genai.ts, layoutEngine.ts)
├── hooks/          # Custom hooks (useTranslation, useTwitch, useTwitchAuth)
├── lib/            # Utilities (Context.js, prisma.ts, stripe.ts)
├── styles/         # CSS Modules
├── locales/        # i18n JSON files (16 languages)
└── types.ts        # TypeScript interfaces
```

### Core Game Flow

1. **Grid Generation:** `services/layoutEngine.ts` creates crossword layout from word list
2. **AI Words:** `services/genai.ts` calls Gemini API to generate themed word/clue pairs
3. **Real-time Play:** `hooks/useTwitch.ts` connects to Twitch chat via tmi.js
4. **Scoring:** Players earn points when their chat message matches a word answer

### Data Models

- `User` - Twitch-authenticated users with subscription tier
- `Subscription` - Stripe subscription linked to user

### Subscription Tiers

- Free: 6 concurrent players
- Pro: 12 concurrent players
- Unlimited: No player limit

### Game Constants

Grid dimensions: 14 rows × 26 columns (defined in `constants.ts`)
Default game duration: 120 seconds

## Patterns

- Components use CSS Modules with matching names (`Grid.tsx` + `Grid.module.css`)
- Prisma client is a singleton in `lib/prisma.ts`
- Auth tokens include subscription tier via NextAuth callbacks
- Fallback crossword data exists in `constants.ts` for offline/dev use
- Answers are normalized (spaces/hyphens removed) before comparison

## Environment Variables

Required in `.env` or `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string
- `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` - OAuth credentials
- `NEXTAUTH_SECRET` - Session encryption key
- `GEMINI_API_KEY` - Google AI API key
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_UNLIMITED` - Payment config
