# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StreamCross is an interactive crossword game integrated with Twitch chat. Viewers guess words in chat to fill the crossword board. The game uses Google Gemini AI to generate themed word puzzles.

## Development Commands

All commands run from the `/app` directory:

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Required Environment Variables

Create `.env.local` in the `/app` directory:
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET` - NextAuth configuration
- `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` - Twitch OAuth credentials
- `GEMINI_API_KEY` - Google Gemini API for word generation

## Architecture

### Tech Stack
- Next.js 16 with Pages Router (not App Router)
- React 19 with TypeScript 5
- Tailwind CSS 4 + CSS Modules for styling
- NextAuth 4 for Twitch OAuth authentication
- tmi.js for Twitch chat integration

### Key Directories (under `/app`)

- `pages/` - Next.js pages and API routes
  - `index.tsx` - Login page
  - `game.tsx` - Main game page (requires auth)
  - `api/auth/[...nextauth]/` - NextAuth API routes
  - `api/generate-words/` - Word generation endpoint

- `components/` - React components
  - `Main.tsx` - Core game logic and state orchestration
  - `Grid.tsx` - Crossword grid renderer
  - `modal/` - Modal dialogs (Alert, Info, Settings)

- `services/` - External integrations
  - `genai.ts` - Google Gemini API wrapper for themed word generation
  - `layoutEngine.ts` - Algorithm that positions words on the crossword grid

- `hooks/` - Custom hooks
  - `useTwitch.ts` - Twitch chat connection and message handling
  - `useTranslation.ts` - i18n with localStorage persistence

- `locales/` - 15 language JSON files (default: Portuguese)

### Core Types (`types.ts`)

- `WordData` - Word with position, direction (H/V), and reveal state
- `CellData` - Grid cell with character and word associations
- `GameState` - Game status, words, score, winner
- `RawLevel` - AI response (theme + word list, no positions)
- `Level` - Processed level (theme + positioned words)

### Grid Configuration (`constants.ts`)

- Grid: 14 rows x 24 columns
- Base resolution: 1920x1080 (scales responsively)
- Default round duration: 120 seconds

### Game Flow

1. User authenticates via Twitch OAuth
2. Game fetches themed words from Gemini API (`genai.ts`)
3. Layout engine positions words on grid (`layoutEngine.ts`)
4. Twitch chat messages are matched against unrevealed words
5. Correct guesses reveal words with confetti animation
6. Scores tracked per user (round and total)

### Styling Pattern

Components use CSS Modules (`*.module.css`) alongside Tailwind utilities. Animations use Framer Motion and Lottie.

### i18n

Default locale is Portuguese (`pt`). Locale stored in localStorage and loaded via `useTranslation` hook. Add new translations by creating a JSON file in `locales/` and updating `next.config.ts`.
