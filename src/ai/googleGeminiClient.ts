import {
  AIClient,
  ChatMessage,
  ChatStreamChunk,
  ChatStreamOptions,
  EmbedOptions,
  EmbedResponse,
  GenerateTextOptions,
  GenerateTextResponse,
} from './AIClient';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_TEXT_MODEL = 'gemini-1.5-flash-latest';
const DEFAULT_EMBED_MODEL = 'text-embedding-004';

const systemInstructionToParts = (
  instruction: GenerateTextOptions['systemInstruction'],
) => {
  if (!instruction) {
    return undefined;
  }
  if (typeof instruction === 'string') {
    return { role: 'system', parts: [{ text: instruction }] };
  }
  return instruction;
};

const buildModelPath = (model: string) =>
  model.startsWith('models/') ? model : `models/${model}`;

const readEnv = (key: string): string | undefined => {
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

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  [key: string]: unknown;
}

interface GeminiEmbedResponse {
  embedding?: { values?: number[] };
  embeddings?: Array<{ values?: number[] }>;
  [key: string]: unknown;
}

export class GoogleGeminiClient implements AIClient {
  private readonly apiKey?: string;

  constructor(apiKey = readEnv('GEMINI_API_KEY')) {
    this.apiKey = apiKey;
  }

  private ensureApiKey(): string {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }
    return this.apiKey;
  }

  private async performRequest<T>(
    path: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<T> {
    const apiKey = this.ensureApiKey();
    try {
      const response = await fetch(`${API_BASE_URL}/${path}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(async () => ({
          error: { message: await response.text() },
        }));
        throw new Error(
          (errorBody as { error?: { message?: string } })?.error?.message ||
            `Gemini API request failed with status ${response.status}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw new Error(
        error instanceof Error ? error.message : 'Unknown Gemini API error',
      );
    }
  }

  async generateText(
    prompt: string,
    options: GenerateTextOptions = {},
  ): Promise<GenerateTextResponse> {
    const { model = DEFAULT_TEXT_MODEL, signal, systemInstruction, ...rest } =
      options;
    try {
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: systemInstructionToParts(systemInstruction),
        ...rest,
      };

      const result = await this.performRequest<GeminiGenerateResponse>(
        `${buildModelPath(model)}:generateContent`,
        payload,
        signal,
      );

      const text =
        result?.candidates
          ?.flatMap((candidate) => candidate.content?.parts || [])
          .map((part) => part?.text || '')
          .join('')
          .trim() || '';

      return { text, raw: result };
    } catch (error) {
      console.error('Gemini generateText failed:', error);
      return {
        text: '',
        raw: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async embed(
    input: string | string[],
    options: EmbedOptions = {},
  ): Promise<EmbedResponse> {
    const { model = DEFAULT_EMBED_MODEL, signal, ...rest } = options;
    try {
      if (Array.isArray(input)) {
        const payload = {
          requests: input.map((text) => ({
            content: { parts: [{ text }] },
            ...rest,
          })),
        };

        const response = await this.performRequest<GeminiEmbedResponse>(
          `${buildModelPath(model)}:batchEmbedContents`,
          payload,
          signal,
        );

        const embeddings =
          response.embeddings?.map((embedding) => embedding.values || []) || [];

        return { embeddings, raw: response };
      }

      const payload = {
        content: { parts: [{ text: input }] },
        ...rest,
      };

      const response = await this.performRequest<GeminiEmbedResponse>(
        `${buildModelPath(model)}:embedContent`,
        payload,
        signal,
      );

      const embedding = response.embedding?.values || [];

      return { embeddings: [embedding], raw: response };
    } catch (error) {
      console.error('Gemini embed failed:', error);
      return {
        embeddings: [new Array(3).fill(0)],
        raw: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async *chatStream(
    messages: ChatMessage[],
    options: ChatStreamOptions = {},
  ): AsyncIterable<ChatStreamChunk> {
    const conversation = messages
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');

    const result = await this.generateText(conversation, options);

    const chunk: ChatStreamChunk = {
      text: result.text,
      raw: result.raw,
      done: true,
      error: result.error,
    };

    options.onChunk?.(chunk);
    yield chunk;
  }
}
