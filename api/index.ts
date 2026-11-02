/**
 * Vercel serverless entry point.
 *
 * The full server (backend/src/index.ts) keeps listening on a port for local
 * development. In production Vercel calls this handler per-request, so we:
 *   1. create the Express app once per cold start,
 *   2. connect to MongoDB once per cold start (the promise is cached),
 *   3. forward the request into Express.
 */
import type { RequestHandler } from 'express';
import { createApp } from '../backend/src/app';
import { connectDatabase } from '../backend/src/config/db';
import { ensureSeedData } from '../backend/src/services/bootstrap';

const app = createApp();

let readyPromise: Promise<void> | null = null;

function prepare(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      await connectDatabase();
      await ensureSeedData();
    })();
  }
  return readyPromise;
}

const handler: RequestHandler = async (req, res) => {
  try {
    await prepare();
  } catch (error) {
    console.error('[api] Failed to prepare serverless instance:', error);
    res.status(503).json({ error: 'API is starting up, try again in a moment.' });
    return;
  }

  app(req, res);
};

export default handler;
