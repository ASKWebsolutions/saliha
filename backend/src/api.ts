import { createApp } from './app';

/**
 * Vercel serverless entry point for the Express service.
 *
 * `waitForReady` middleware inside createApp() makes sure MongoDB is usable
 * before any route runs. The full listening server lives in src/index.ts for
 * local development.
 */
const app = createApp();

// Vercel's Express runtime inspects the module's raw CommonJS export. With
// TypeScript's default `export default app` lands on `exports.default`, which
// fails that check ("Invalid export"), so export the app object itself.
export = app;
