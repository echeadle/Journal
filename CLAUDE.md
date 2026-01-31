# Health Journal

Privacy-first web app for tracking mood, energy, and food intake with Claude AI chatbot.
React + Vite frontend (port 5173) | Express backend (port 3000) | localStorage for data.

## Quick Reference

See @README.md for project overview.
See @docs/architecture.md for full architecture details.
See @docs/implementation-plan.md for phase status and next tasks.
See @docs/original-request.md for the doctor's original tracking request.

## Commands

- `npm run dev` — run both client (5173) and server (3000)
- `npm run dev:client` — frontend only
- `npm run dev:server` — backend only
- `npm run build` — build frontend to client/dist/
- `cd client && npm run lint` — lint frontend

## Project Layout

- `client/src/pages/` — Route components (Landing, Dashboard, DailyCheckIn, Review, Export)
- `client/src/components/` — Reusable UI (journal/, chatbot/, common/)
- `client/src/context/` — JournalContext + ChatContext (state management)
- `client/src/services/` — storageService.js (localStorage) + chatService.js (API)
- `client/src/utils/` — constants.js (TIME_SLOTS, MOOD_DESCRIPTORS) + dateUtils.js
- `server/src/` — Express server, /api/chat route, claudeService

## Key Rules

- NEVER access localStorage directly — always use storageService
- All state changes go through Context providers → Service layer → localStorage/API
- One CSS file per component, BEM naming, mobile-first (44px min tap targets)
- AI responses must be concise (2–3 paragraphs max), never medical advice
- API key stays server-side only, never exposed to frontend

## Current Status

Phases 1–3 complete (foundation, core tracking, chatbot).
Next: Phase 4 (visualizations with Recharts).
See @docs/implementation-plan.md for detailed checklist.

## Environment

Server requires `server/.env`:
- `ANTHROPIC_API_KEY` (required)
- `PORT` (default: 3000)
- `NODE_ENV` (development/production)
- `CLIENT_URL` (default: http://localhost:5173)
