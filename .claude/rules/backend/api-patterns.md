---
paths:
  - "server/src/**/*.js"
---
# Backend API Rules

- Express with CORS, rate limiting (100 req/15 min per IP), JSON body parsing
- POST /api/chat — accepts { message, journalContext }, returns { success, message, usage }
- POST /api/chat/stream — SSE streaming variant
- GET /api/health — returns { status: 'ok', timestamp }
- claudeService uses @anthropic-ai/sdk with claude-3-5-sonnet-20241022
- System prompt defines "cheerful health journal assistant" persona
- Always validate input, never leak error details to client
- Error handling: catch all errors, log server-side, return user-friendly messages
