export interface GenerationRequest {
  seedId: string;
  prompt: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GenerationResult {
  provider: string;
  model: string;
  outputText: string;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  providerRequestId?: string;
  rawMetadata?: Record<string, unknown>;
}

export interface ModelProvider {
  readonly name: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
}
