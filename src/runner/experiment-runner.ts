import { ModelProvider, GenerationRequest } from "../providers/provider-interface";
import { buildRunProvenance, RunProvenance } from "../governance/provenance";

export interface ExperimentTask {
  request: GenerationRequest;
  repeatIndex: number;
}

export interface ExperimentObservation {
  seedId: string;
  repeatIndex: number;
  status: "succeeded" | "failed";
  result?: Awaited<ReturnType<ModelProvider["generate"]>>;
  provenance?: RunProvenance;
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
      provenance: buildRunProvenance(task.request, result),
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
