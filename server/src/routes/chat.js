import express from 'express';
import { sendMessage, streamMessage } from '../services/claudeService.js';

const router = express.Router();

// Validate and sanitize journalContext to prevent injection
function sanitizeJournalContext(context) {
  if (!context || typeof context !== 'object') {
    return null;
  }

  const sanitized = {};

  // Validate numeric fields with reasonable bounds
  if (typeof context.currentDay === 'number' && context.currentDay >= 0 && context.currentDay <= 100) {
    sanitized.currentDay = Math.floor(context.currentDay);
  }
  if (typeof context.totalDays === 'number' && context.totalDays >= 1 && context.totalDays <= 30) {
    sanitized.totalDays = Math.floor(context.totalDays);
  }
  if (typeof context.completionPercentage === 'number' && context.completionPercentage >= 0 && context.completionPercentage <= 100) {
    sanitized.completionPercentage = Math.round(context.completionPercentage);
  }

  // Validate string arrays (limit size to prevent abuse)
  if (Array.isArray(context.completedCheckIns)) {
    sanitized.completedCheckIns = context.completedCheckIns
      .filter(item => typeof item === 'string')
      .slice(0, 50);
  }
  if (Array.isArray(context.pendingCheckIns)) {
    sanitized.pendingCheckIns = context.pendingCheckIns
      .filter(item => typeof item === 'string')
      .slice(0, 50);
  }

  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

// POST /api/chat - Send a message to Claude
router.post('/', async (req, res, next) => {
  try {
    const { message, journalContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message cannot be empty'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message is too long (max 2000 characters)'
      });
    }

    const sanitizedContext = sanitizeJournalContext(journalContext);
    const result = await sendMessage(message.trim(), sanitizedContext);

    res.json({
      success: true,
      response: result.message,
      usage: result.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/chat/stream - Stream a message from Claude
router.post('/stream', async (req, res, next) => {
  try {
    const { message, journalContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sanitizedContext = sanitizeJournalContext(journalContext);
    const stream = await streamMessage(message.trim(), sanitizedContext);

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
});

export default router;
