import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRunProvenance,
  fingerprintRequest,
} from "../src/governance/provenance";
import { validateStructuredJson } from "../src/governance/structured-output";
import { estimateUsageCost } from "../src/governance/cost";

test("request fingerprint is deterministic", () => {
  const request = {
    seedId: "seed-1",
    prompt: "Return a concise answer.",
    model: "model-a",
    temperature: 0.2,
    promptVersion: "prompt-v1",
    schemaVersion: "schema-v1",
    sourceRefs: ["source-b", "source-a"],
  };

  assert.equal(fingerprintRequest(request), fingerprintRequest(request));
});

test("request fingerprint changes when experiment conditions change", () => {
  const base = {
    seedId: "seed-1",
    prompt: "Return a concise answer.",
    model: "model-a",
    temperature: 0.2,
    promptVersion: "prompt-v1",
  };

  assert.notEqual(
    fingerprintRequest(base),
    fingerprintRequest({ ...base, promptVersion: "prompt-v2" })
  );

  assert.notEqual(
    fingerprintRequest(base),
    fingerprintRequest({ ...base, model: "model-b" })
  );
});

test("run provenance captures request and output fingerprints", () => {
  const request = {
    seedId: "seed-2",
    prompt: "Evaluate the claim.",
    model: "model-a",
    promptVersion: "p3",
    schemaVersion: "s2",
    sourceRefs: ["doc-17"],
  };

  const result = {
    provider: "mock",
    model: "model-a",
    outputText: "Example output",
    startedAt: "2026-10-02T00:00:00.000Z",
    completedAt: "2026-10-02T00:00:01.000Z",
    latencyMs: 1000,
  };

  const provenance = buildRunProvenance(request, result);

  assert.equal(provenance.promptVersion, "p3");
  assert.equal(provenance.schemaVersion, "s2");
  assert.deepEqual(provenance.sourceRefs, ["doc-17"]);
  assert.match(provenance.requestFingerprint, /^[a-f0-9]{64}$/);
  assert.match(provenance.outputHash, /^[a-f0-9]{64}$/);
});

test("structured output accepts a matching JSON object", () => {
  const result = validateStructuredJson(
    JSON.stringify({ title: "Example", score: 0.8 }),
    {
      version: "v1",
      required: {
        title: "string",
        score: "number",
      },
      allowAdditionalProperties: false,
    }
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("structured output rejects malformed or incompatible output", () => {
  const malformed = validateStructuredJson("{not-json", {
    version: "v1",
    required: { title: "string" },
  });

  assert.equal(malformed.valid, false);

  const wrongShape = validateStructuredJson(
    JSON.stringify({ title: 42, extra: true }),
    {
      version: "v1",
      required: { title: "string" },
      allowAdditionalProperties: false,
    }
  );

  assert.equal(wrongShape.valid, false);
  assert.match(wrongShape.errors.join(" "), /expected string/);
  assert.match(wrongShape.errors.join(" "), /unexpected property/);
});

test("usage cost separates input and output pricing", () => {
  const cost = estimateUsageCost(500_000, 250_000, {
    provider: "example",
    model: "model-a",
    currency: "USD",
    inputUsdPerMillionTokens: 2,
    outputUsdPerMillionTokens: 8,
    effectiveFrom: "2026-10-01",
  });

  assert.equal(cost.inputCostUsd, 1);
  assert.equal(cost.outputCostUsd, 2);
  assert.equal(cost.totalCostUsd, 3);
});
