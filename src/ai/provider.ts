import { AIClient } from './AIClient';
import { GoogleGeminiClient } from './googleGeminiClient';
import { MockAIClient } from './mockAIClient';

let cachedClient: AIClient | null = null;

const resolveEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process?.env && key in process.env) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
    const metaEnv = (import.meta as any).env;
    if (key in metaEnv) {
      return metaEnv[key];
    }
    const viteKey = `VITE_${key}`;
    if (viteKey in metaEnv) {
      return metaEnv[viteKey];
    }
  }
  return undefined;
};

const normaliseProviderName = (name?: string) =>
  (name || '').trim().toLowerCase();

export const getAIClient = (): AIClient => {
  if (cachedClient) {
    return cachedClient;
  }

  const providerName = normaliseProviderName(resolveEnv('AI_PROVIDER')) || 'mock';

  switch (providerName) {
    case 'gemini':
      cachedClient = new GoogleGeminiClient();
      break;
    case 'mock':
    default:
      cachedClient = new MockAIClient(providerName || 'mock');
      break;
  }

  return cachedClient;
};

export const resetAIClientForTests = () => {
  cachedClient = null;
};
