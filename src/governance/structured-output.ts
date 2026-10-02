export type JsonPrimitiveType = "string" | "number" | "boolean" | "object" | "array";

export interface StructuredOutputSchema {
  version: string;
  required: Record<string, JsonPrimitiveType>;
  allowAdditionalProperties?: boolean;
}

export interface StructuredValidationResult {
  valid: boolean;
  value?: Record<string, unknown>;
  errors: string[];
}

function actualType(value: unknown): JsonPrimitiveType | "null" {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return typeof value as JsonPrimitiveType;
}

export function validateStructuredJson(
  raw: string,
  schema: StructuredOutputSchema
): StructuredValidationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { valid: false, errors: ["response is not valid JSON"] };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { valid: false, errors: ["response must be a JSON object"] };
  }

  const value = parsed as Record<string, unknown>;
  const errors: string[] = [];

  for (const [key, expected] of Object.entries(schema.required)) {
    if (!(key in value)) {
      errors.push(`missing required property: ${key}`);
      continue;
    }

    const received = actualType(value[key]);
    if (received !== expected) {
      errors.push(
        `property ${key} expected ${expected} but received ${received}`
      );
    }
  }

  if (schema.allowAdditionalProperties === false) {
    const allowed = new Set(Object.keys(schema.required));
    for (const key of Object.keys(value)) {
      if (!allowed.has(key)) {
        errors.push(`unexpected property: ${key}`);
      }
    }
  }

  return errors.length === 0
    ? { valid: true, value, errors: [] }
    : { valid: false, errors };
}
