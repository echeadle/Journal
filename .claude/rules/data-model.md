# Data Model

## Storage Keys
- `healthJournal_config` — journal configuration
- `healthJournal_entries` — all daily entries
- `healthJournal_chatHistory` — chat messages

## Time Slots (5 per day)
WAKING, AFTER_FAST, NOON, AFTER_DINNER, BEDTIME
Each slot specifies which to track: mood, energy, food (see constants.js)

## Check-in Structure
- Mood: descriptors[] (happy, calm, etc.) + score (1–5)
- Energy: score (1–5)
- Food: type, foods[], notes

## Entry Update Pattern
1. Get full entries array from localStorage
2. Find entry by entryId
3. Modify the entry
4. Save entire array back
5. Context reloads to sync state

## Data Flow
User Action → Component → Context Provider → Service Layer → localStorage/API

All state changes go through Context providers, which delegate to services.
storageService is the single source of truth for localStorage operations.
