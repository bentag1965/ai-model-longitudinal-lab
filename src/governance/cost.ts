export interface ModelPricing {
  provider: string;
  model: string;
  currency: "USD";
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
  effectiveFrom: string;
  sourceNote?: string;
}

export interface UsageCost {
  inputTokens: number;
  outputTokens: number;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
}

export function estimateUsageCost(
  inputTokens: number,
  outputTokens: number,
  pricing: ModelPricing
): UsageCost {
  const inputCostUsd =
    (inputTokens / 1_000_000) * pricing.inputUsdPerMillionTokens;
  const outputCostUsd =
    (outputTokens / 1_000_000) * pricing.outputUsdPerMillionTokens;

  return {
    inputTokens,
    outputTokens,
    inputCostUsd,
    outputCostUsd,
    totalCostUsd: inputCostUsd + outputCostUsd,
  };
}
