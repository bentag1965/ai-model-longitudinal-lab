import { createHash } from "node:crypto";
import { GenerationRequest, GenerationResult } from "../providers/provider-interface";

export interface RunProvenance {
  seedId: string;
  provider: string;
  model: string;
  promptVersion?: string;
  schemaVersion?: string;
  requestFingerprint: string;
  outputHash: string;
  sourceRefs: string[];
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return "[" + value.map(stableJson).join(",") + "]";
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => JSON.stringify(key) + ":" + stableJson(item));
    return "{" + entries.join(",") + "}";
  }

  return JSON.stringify(value);
}

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function fingerprintRequest(request: GenerationRequest): string {
  return sha256(
    stableJson({
      seedId: request.seedId,
      prompt: request.prompt,
      promptVersion: request.promptVersion ?? null,
      schemaVersion: request.schemaVersion ?? null,
      model: request.model,
      temperature: request.temperature ?? null,
      maxOutputTokens: request.maxOutputTokens ?? null,
      responseFormat: request.responseFormat ?? null,
      sourceRefs: [...(request.sourceRefs ?? [])].sort(),
    })
  );
}

export function buildRunProvenance(
  request: GenerationRequest,
  result: GenerationResult
): RunProvenance {
  return {
    seedId: request.seedId,
    provider: result.provider,
    model: result.model,
    promptVersion: request.promptVersion,
    schemaVersion: request.schemaVersion,
    requestFingerprint: fingerprintRequest(request),
    outputHash: sha256(result.outputText),
    sourceRefs: [...(request.sourceRefs ?? [])],
  };
}
