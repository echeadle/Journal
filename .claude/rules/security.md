# Security Rules

- No user accounts or authentication — single-user, privacy-first
- All journal data in browser localStorage only
- API key NEVER exposed to frontend (server-only via .env)
- CORS restricts API to configured CLIENT_URL
- Rate limiting on all API endpoints (100 requests per 15 minutes per IP)
- Input validation and sanitization on all forms and API inputs
- Error messages must not leak sensitive information
- XSS prevention via React's default escaping
- Never commit .env files or expose API keys in logs
