import {
  GenerationRequest,
  GenerationResult,
  ModelProvider,
} from "./provider-interface";

export class MockProvider implements ModelProvider {
  readonly name = "mock";

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const started = new Date();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const completed = new Date();

    return {
      provider: this.name,
      model: request.model,
      outputText:
        "Mock response for seed " +
        request.seedId +
        ": " +
        request.prompt.slice(0, 120),
      startedAt: started.toISOString(),
      completedAt: completed.toISOString(),
      latencyMs: completed.getTime() - started.getTime(),
      rawMetadata: {
        referenceImplementation: true,
      },
    };
  }
}
