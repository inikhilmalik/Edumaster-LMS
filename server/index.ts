import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import progressRoutes from './routes/progress';

dotenv.config({ path: '.env' });

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edumaster-lms';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully',mongoUri);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'EduMaster LMS API is running' });
});

// AI content generation endpoint (optional)
app.post('/api/ai/generate-content', async (req: Request, res: Response) => {
  try {
    const { prompt, type } = req.body;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      res.status(200).json({
        success: false,
        message: 'AI features are not configured. Please add OPENAI_API_KEY to use AI features.',
        fallback: true,
      });
      return;
    }

    // Dynamic import to handle cases where AI SDK might not be available
    try {
      const { generateText } = await import('ai');
      const { openai } = await import('@ai-sdk/openai');

      const result = await generateText({
        model: openai('gpt-4-turbo'),
        prompt: prompt,
      });

      res.json({
        success: true,
        content: result.text,
        type,
      });
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      res.status(200).json({
        success: false,
        message: 'AI service temporarily unavailable',
        fallback: true,
      });
    }
  } catch (error) {
    console.error('AI endpoint error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📚 EduMaster LMS API Ready`);
    console.log(`🔌 Port: ${PORT}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false);
    });
  });
};

startServer();

export default app;
