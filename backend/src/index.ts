import { createApp } from './create-app';

/**
 * Vercel serverless entry point.
 *
 * Vercel's Express runtime uses the conventional `src/index.ts` location as
 * the function handler, so this is the default export it expects: the app
 * object itself. The local listening server lives in src/dev.ts, and
 * `createApp()` wires in the lazy MongoDB bootstrap.
 *
 * Vercel's runtime inspects the module's raw CommonJS export. With
 * TypeScript, `export default app` lands on `exports.default`, which fails
 * that check ("Invalid export"), so export the app object itself.
 */
const app = createApp();

export = app;
