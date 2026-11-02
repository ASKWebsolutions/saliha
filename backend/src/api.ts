import { createApp } from './app';

/**
 * Vercel serverless entry point for the Express service.
 *
 * `waitForReady` middleware inside createApp() makes sure MongoDB is usable
 * before any route runs. The full listening server lives in src/index.ts for
 * local development.
 */
const app = createApp();

export default app;
