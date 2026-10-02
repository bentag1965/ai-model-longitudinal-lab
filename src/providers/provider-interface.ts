export interface GenerationRequest {
  seedId: string;
  prompt: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  promptVersion?: string;
  schemaVersion?: string;
  responseFormat?: "text" | "json_object";
  sourceRefs?: string[];
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
