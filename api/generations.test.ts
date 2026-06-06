import { describe, expect, it } from "vitest";

import { normalizeCreateGenerationInput } from "./generations.js";

describe("/api/generations input contract", () => {
  it("normalizes a valid project launch generation request", () => {
    expect(
      normalizeCreateGenerationInput({
        repoUrl: " https://github.com/QwenLM/FlashQLA ",
        locales: ["en", "zh"],
        preset: "4:3",
        provider: "mock",
        imageQuality: "low",
        models: {
          llm: "openai/gpt-5.5",
          image: "openai/gpt-image-2/text-to-image",
        },
      }),
    ).toMatchObject({
      repoUrl: "https://github.com/QwenLM/FlashQLA",
      locales: ["en", "zh"],
      preset: "4:3",
      provider: "mock",
      imageQuality: "low",
      models: {
        llm: "openai/gpt-5.5",
        image: "openai/gpt-image-2/text-to-image",
      },
    });
  });

  it("accepts Wavespeed aspect ratio presets that are sent from the landing page", () => {
    for (const preset of ["1:1", "3:2", "2:3", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]) {
      expect(
        normalizeCreateGenerationInput({
          repoUrl: "https://github.com/QwenLM/FlashQLA",
          preset,
        }).preset,
      ).toBe(preset);
    }
  });

  it("only accepts low image quality for local Hero generation", () => {
    for (const imageQuality of ["medium", "high", "auto"]) {
      expect(() =>
        normalizeCreateGenerationInput({
          repoUrl: "https://github.com/QwenLM/FlashQLA",
          imageQuality,
        }),
      ).toThrow("imageQuality must be low.");
    }
  });

  it("rejects unsupported locales before orchestration", () => {
    expect(() =>
      normalizeCreateGenerationInput({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        locales: ["en", "ko"],
      }),
    ).toThrow(/locales/i);
  });

  it("uses the production provider requirement in validation errors", () => {
    expect(() =>
      normalizeCreateGenerationInput({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        provider: "openai",
      }),
    ).toThrow("provider must be wavespeed.");
  });
});
