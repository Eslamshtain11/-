export interface GenerateTextOptions extends Record<string, unknown> {
  /**
   * Gemini model identifier (e.g. `gemini-1.5-flash-latest`).
   * When omitted the adapter will use a sensible default for the provider.
   */
  model?: string;
  /** Optional AbortSignal to cancel an in-flight request. */
  signal?: AbortSignal;
  /**
   * Optional system instruction passed through to the provider. When using a
   * string it will be converted to the provider specific format automatically.
   */
  systemInstruction?: string | {
    role: string;
    parts: Array<{ text: string }>;
  };
  /** Additional generation configuration passed to the provider. */
  generationConfig?: Record<string, unknown>;
  /** Safety settings payload expected by the provider. */
  safetySettings?: unknown;
}

export interface GenerateTextResponse {
  /** The provider formatted text output. */
  text: string;
  /** Raw payload returned from the provider for advanced consumers. */
  raw: unknown;
  /** When populated, contains a description of any handled error. */
  error?: string;
}

export interface EmbedOptions extends Record<string, unknown> {
  model?: string;
  signal?: AbortSignal;
}

export interface EmbedResponse {
  embeddings: number[][];
  raw: unknown;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface ChatStreamChunk {
  text: string;
  raw: unknown;
  done?: boolean;
  error?: string;
}

export interface ChatStreamOptions extends Record<string, unknown> {
  model?: string;
  signal?: AbortSignal;
  onChunk?: (chunk: ChatStreamChunk) => void;
}

export interface AIClient {
  generateText(prompt: string, options?: GenerateTextOptions): Promise<GenerateTextResponse>;
  embed(input: string | string[], options?: EmbedOptions): Promise<EmbedResponse>;
  chatStream?(messages: ChatMessage[], options?: ChatStreamOptions): AsyncIterable<ChatStreamChunk>;
}
