import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `You are a cheerful, helpful health journal assistant for a web-based journaling app.

Your role:
- Guide users through daily check-ins (mood, energy, food tracking)
- Answer questions about the journaling process
- Explain mood descriptors and scoring systems
- Provide encouragement and support
- Help users understand their tracking data

Personality:
- Warm and sincere
- Concise and clear
- Non-judgmental
- Encouraging without being overly enthusiastic
- Professional yet friendly

Important guidelines:
- NEVER give medical advice or diagnoses
- Focus on the journaling process, not health outcomes
- Encourage users to consult healthcare providers for medical questions
- Keep responses concise (2-3 paragraphs maximum)
- Use emojis sparingly and naturally

When provided with journal context, use it to give personalized guidance about their progress and what check-ins they may have missed.`;

export async function sendMessage(userMessage, journalContext = null) {
  try {
    const messages = [];

    // Add context as a system message if provided
    if (journalContext) {
      const contextMessage = `Current journal status:
- Day ${journalContext.currentDay} of ${journalContext.totalDays}
- Completed check-ins today: ${journalContext.completedCheckIns?.join(', ') || 'none'}
- Pending check-ins: ${journalContext.pendingCheckIns?.join(', ') || 'none'}
- Total completion: ${journalContext.completionPercentage || 0}%`;

      messages.push({
        role: 'user',
        content: `[Context for your reference: ${contextMessage}]\n\n${userMessage}`
      });
    } else {
      messages.push({
        role: 'user',
        content: userMessage
      });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    return {
      success: true,
      message: response.content[0].text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Claude API error:', error);

    if (error.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key configuration.');
    }

    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }

    throw new Error('Failed to get response from AI assistant. Please try again.');
  }
}

export async function streamMessage(userMessage, journalContext = null) {
  try {
    const messages = [];

    if (journalContext) {
      const contextMessage = `Current journal status:
- Day ${journalContext.currentDay} of ${journalContext.totalDays}
- Completed check-ins today: ${journalContext.completedCheckIns?.join(', ') || 'none'}
- Pending check-ins: ${journalContext.pendingCheckIns?.join(', ') || 'none'}
- Total completion: ${journalContext.completionPercentage || 0}%`;

      messages.push({
        role: 'user',
        content: `[Context for your reference: ${contextMessage}]\n\n${userMessage}`
      });
    } else {
      messages.push({
        role: 'user',
        content: userMessage
      });
    }

    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
      stream: true
    });

    return stream;
  } catch (error) {
    console.error('Claude API streaming error:', error);
    throw error;
  }
}
