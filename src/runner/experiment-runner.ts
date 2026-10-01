import { ModelProvider, GenerationRequest } from "../providers/provider-interface";

export interface ExperimentTask {
  request: GenerationRequest;
  repeatIndex: number;
}

export interface ExperimentObservation {
  seedId: string;
  repeatIndex: number;
  status: "succeeded" | "failed";
  result?: Awaited<ReturnType<ModelProvider["generate"]>>;
  error?: string;
}

export async function runExperiment(
  provider: ModelProvider,
  task: ExperimentTask
): Promise<ExperimentObservation> {
  try {
    const result = await provider.generate(task.request);

    return {
      seedId: task.request.seedId,
      repeatIndex: task.repeatIndex,
      status: "succeeded",
      result,
    };
  } catch (error) {
    return {
      seedId: task.request.seedId,
      repeatIndex: task.repeatIndex,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
