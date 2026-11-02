import type { RequestHandler } from 'express';
import { connectDatabase } from './config/db';
import { ensureSeedData } from './services/bootstrap';

/**
 * One-shot bootstrapping shared by both entry points.
 *
 * - Local dev: backend/src/index.ts connects to the database itself, so the
 *   middleware below is a no-op (connectDatabase returns immediately when the
 *   connection is already open).
 * - Vercel: the promise starts when the function module is first loaded, and
 *   the middleware awaits it before any route runs.
 */
let readyPromise: Promise<void> | null = null;

function prepare(): Promise<void> {
  if (!readyPromise) {
    readyPromise = connectDatabase()
      .then(() => ensureSeedData())
      .catch((error) => {
        // Allow a later request to retry the connection.
        readyPromise = null;
        throw error;
      });
  }
  return readyPromise;
}

// Kick the connection off as early as possible on a cold start.
if (process.env.VERCEL) {
  prepare();
}

/** Express middleware that awaits the database connection before routing. */
export const waitReady: RequestHandler = async (_req, res, next) => {
  try {
    await prepare();
  } catch (error) {
    console.error('[api] Failed to prepare serverless instance:', error);
    res.status(503).json({ error: 'API is starting up, try again in a moment.' });
    return;
  }
  next();
};
