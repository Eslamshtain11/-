<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` (or `.env`) and adjust the values if needed.
   The mock AI provider runs without any keys.
3. Run the app:
   `npm run dev`

## AI Provider Configuration

The application uses an AI provider adapter that defaults to a deterministic
mock implementation. To switch to Gemini, set the environment variables
`AI_PROVIDER=gemini` and `GEMINI_API_KEY=<your-key>`.
