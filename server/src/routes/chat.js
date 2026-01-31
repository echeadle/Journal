import express from 'express';
import { sendMessage, streamMessage } from '../services/claudeService.js';

const router = express.Router();

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

    const result = await sendMessage(message.trim(), journalContext);

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

    const stream = await streamMessage(message.trim(), journalContext);

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
