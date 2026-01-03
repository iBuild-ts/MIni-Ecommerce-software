import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { chatRouter } from './routes/chat';
import { healthRouter } from './routes/health';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.AI_ASSISTANT_PORT || 4001;

app.use(cors({
  origin: [
    process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/health', healthRouter);
app.use('/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`🤖 AI Assistant running on http://localhost:${PORT}`);
});

export default app;
