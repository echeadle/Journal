---
paths:
  - "client/src/**/*.jsx"
  - "client/src/**/*.js"
---
# React Component Rules

- Functional components with hooks only
- Props in, mutations via context hooks
- Context pattern: load from service on mount → provide state + methods → call service to persist → reload
- JournalContext exposes: addCheckIn(entryId, checkInData), loadJournalData(), etc.
- ChatContext manages chatbot state and message history
- Router: / (Landing), /dashboard, /day/:dayNumber, /review, /export
- Use React.memo when appropriate to prevent unnecessary re-renders
- Never access localStorage directly — always use storageService
- Component organization: pages/ for routes, components/ for reusable UI, organized by domain
