import { Router, Request, Response } from 'express';
import { nlpService } from '../services/nlp';

export const chatRouter = Router();

interface ChatRequest {
  message: string;
  sessionId?: string;
}

const sessions: Map<string, Array<{ role: string; content: string }>> = new Map();

chatRouter.post('/', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const currentSessionId = sessionId || `session_${Date.now()}`;
    
    let history = sessions.get(currentSessionId) || [];
    history.push({ role: 'user', content: message });

    const response = await nlpService.generateResponse(message, history);
    
    history.push({ role: 'assistant', content: response });
    sessions.set(currentSessionId, history.slice(-20));

    res.json({
      response,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
