---
paths:
  - "server/src/services/claudeService.js"
  - "server/src/routes/chat.js"
---
# Claude AI Service Rules

- Use @anthropic-ai/sdk for all Anthropic API calls
- Model: claude-3-5-sonnet-20241022
- System prompt defines cheerful health journal assistant persona
- Responses must be concise (2–3 paragraphs max)
- NEVER provide medical advice — remind users to consult healthcare providers
- Optional journalContext parameter provides completion status to Claude
- Both streaming (streamMessage) and standard (sendMessage) methods available
- Track and return token usage (inputTokens, outputTokens)
- Handle API errors gracefully with user-friendly messages
