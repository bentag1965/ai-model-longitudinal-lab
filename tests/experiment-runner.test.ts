import test from "node:test";
import assert from "node:assert/strict";
import { MockProvider } from "../src/providers/mock-provider";
import { runExperiment } from "../src/runner/experiment-runner";

test("successful provider execution returns a normalized observation", async () => {
  const provider = new MockProvider();

  const observation = await runExperiment(provider, {
    repeatIndex: 0,
    request: {
      seedId: "seed-test-001",
      prompt: "Explain a tradeoff.",
      model: "mock-model",
      temperature: 0.2,
    },
  });

  assert.equal(observation.status, "succeeded");
  assert.equal(observation.seedId, "seed-test-001");
  assert.equal(observation.repeatIndex, 0);
  assert.equal(observation.result?.provider, "mock");
  assert.equal(observation.result?.model, "mock-model");
  assert.match(observation.result?.outputText ?? "", /seed-test-001/);
  assert.ok((observation.result?.latencyMs ?? -1) >= 0);
});

test("provider failures are captured as failed observations", async () => {
  const provider = {
    name: "failing-provider",
    async generate() {
      throw new Error("simulated provider outage");
    },
  };

  const observation = await runExperiment(provider, {
    repeatIndex: 1,
    request: {
      seedId: "seed-test-002",
      prompt: "Test failure handling.",
      model: "failing-model",
    },
  });

  assert.equal(observation.status, "failed");
  assert.match(observation.error ?? "", /simulated provider outage/);
});
