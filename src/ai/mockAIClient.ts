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

const deterministicNumber = (input: string, index: number): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 9973;
  }
  return ((hash + index * 131) % 2000) / 1000 - 1; // range [-1, 1)
};

const deterministicSummary = (prompt: string): string => {
  const preview = prompt.trim().replace(/\s+/g, ' ').slice(0, 120);
  return preview
    ? `ملخص تجريبي للعرض: ${preview}${preview.length === 120 ? '...' : ''}`
    : 'استجابة تجريبية من المزود الوهمي.';
};

export class MockAIClient implements AIClient {
  constructor(private readonly providerName: string = 'mock') {}

  async generateText(
    prompt: string,
    _options: GenerateTextOptions = {},
  ): Promise<GenerateTextResponse> {
    const text = deterministicSummary(prompt);
    return {
      text,
      raw: {
        provider: this.providerName,
        promptPreview: prompt.slice(0, 100),
      },
    };
  }

  async embed(
    input: string | string[],
    _options: EmbedOptions = {},
  ): Promise<EmbedResponse> {
    const items = Array.isArray(input) ? input : [input];
    const embeddings = items.map((item) =>
      Array.from({ length: 8 }, (_, index) => deterministicNumber(item, index)),
    );

    return {
      embeddings,
      raw: {
        provider: this.providerName,
        count: items.length,
      },
    };
  }

  async *chatStream(
    messages: ChatMessage[],
    options: ChatStreamOptions = {},
  ): AsyncIterable<ChatStreamChunk> {
    const combined = messages.map((message) => message.content).join('\n');
    const text = deterministicSummary(combined);
    const chunk: ChatStreamChunk = {
      text,
      raw: {
        provider: this.providerName,
        messageCount: messages.length,
      },
      done: true,
    };

    options.onChunk?.(chunk);
    yield chunk;
  }
}
