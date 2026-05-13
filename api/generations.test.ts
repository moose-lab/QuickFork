import { describe, expect, it } from "vitest";

import { normalizeCreateGenerationInput } from "./generations";

describe("/api/generations input contract", () => {
  it("normalizes a valid project launch generation request", () => {
    expect(
      normalizeCreateGenerationInput({
        repoUrl: " https://github.com/QwenLM/FlashQLA ",
        locales: ["en", "zh"],
        preset: "github-readme",
        provider: "mock",
        imageQuality: "high",
        models: {
          llm: "gpt-5.5",
          image: "gpt-image-2",
        },
      }),
    ).toMatchObject({
      repoUrl: "https://github.com/QwenLM/FlashQLA",
      locales: ["en", "zh"],
      preset: "github-readme",
      provider: "mock",
      imageQuality: "high",
      models: {
        llm: "gpt-5.5",
        image: "gpt-image-2",
      },
    });
  });

  it("rejects unsupported locales before orchestration", () => {
    expect(() =>
      normalizeCreateGenerationInput({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        locales: ["en", "ko"],
      }),
    ).toThrow(/locales/i);
  });
});
