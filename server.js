import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from './wizard-prompts.js';

const app = express();
app.use(express.json());
app.use(express.static('prototype'));

const anthropic = new Anthropic();  // reads ANTHROPIC_API_KEY from env

// POST /api/wizard — send conversation to Claude, get next wizard response
app.post('/api/wizard', async (req, res) => {
  const { messages, studentProfile, scaffoldingLevel, moduleId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const systemPrompt = buildSystemPrompt({
    scaffoldingLevel: scaffoldingLevel || 5,
    moduleId: moduleId || 1,
    studentProfile: studentProfile || {},
  });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6-20250219',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    res.json({ response: text });
  } catch (err) {
    console.error('Anthropic API error:', err.message);
    res.status(502).json({ error: 'Failed to get response from AI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
