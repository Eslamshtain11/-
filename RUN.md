# Running the app

The existing npm scripts remain unchanged. Use the standard workflow:

1. Install dependencies with `npm install`.
2. Create a local environment file (`.env.local` or `.env`) based on `.env.example`.
3. Start the development server with `npm run dev`.
4. Build production assets with `npm run build`.

## AI provider behaviour

* By default `AI_PROVIDER=mock`, which enables a deterministic mock client that
  requires no API keys and keeps the UI fully functional.
* To use Google Gemini set `AI_PROVIDER=gemini` and provide `GEMINI_API_KEY` in
  the same environment file. No code changes are needed—restart the dev server
  after updating the variables.
