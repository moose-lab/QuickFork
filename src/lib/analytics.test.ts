import { afterEach, describe, expect, it, vi } from "vitest";

import { getRepoAnalyticsProperties, initializeAnalytics, trackEvent } from "./analytics";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
  }
}

describe("analytics", () => {
  const originalPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  afterEach(() => {
    delete window.dataLayer;
    delete window.gtag;
    window.sessionStorage.clear();
    window.history.replaceState({}, "", originalPath);
    document.querySelectorAll("script[data-quickfork-analytics]").forEach((script) => script.remove());
    vi.restoreAllMocks();
  });

  it("emits events to dataLayer, gtag, and a DOM event", () => {
    const listener = vi.fn();
    window.dataLayer = [];
    window.gtag = vi.fn();
    window.addEventListener("quickfork:analytics", listener);

    trackEvent("generation_started", {
      repo_host: "github.com",
      repo_full_name: "QwenLM/FlashQLA",
      locale_count: 1,
    });

    expect(window.dataLayer).toEqual([
      {
        event: "generation_started",
        repo_host: "github.com",
        repo_full_name: "QwenLM/FlashQLA",
        locale_count: 1,
      },
    ]);
    expect(window.gtag).toHaveBeenCalledWith("event", "generation_started", {
      repo_host: "github.com",
      repo_full_name: "QwenLM/FlashQLA",
      locale_count: 1,
    });
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      event: "generation_started",
      properties: {
        repo_host: "github.com",
        repo_full_name: "QwenLM/FlashQLA",
        locale_count: 1,
      },
    });

    window.removeEventListener("quickfork:analytics", listener);
  });

  it("does not throw when analytics destinations are absent", () => {
    expect(() => trackEvent("page_view", { page_path: "/" })).not.toThrow();
    expect(window.dataLayer).toEqual([
      {
        event: "page_view",
        page_path: "/",
      },
    ]);
  });

  it("attaches and persists UTM campaign parameters without preserving unrelated query strings", () => {
    window.dataLayer = [];
    window.history.pushState(
      {},
      "",
      "/?utm_source=github&utm_medium=social&utm_campaign=launch&utm_content=hero%20cta&utm_term=repo%20card&token=secret",
    );

    trackEvent("page_view", { page_path: "/" });
    window.history.pushState({}, "", "/sign-up");
    trackEvent("signup_started", { method: "email_otp" });

    expect(window.dataLayer).toEqual([
      {
        event: "page_view",
        page_path: "/",
        utm_source: "github",
        utm_medium: "social",
        utm_campaign: "launch",
        utm_content: "hero cta",
        utm_term: "repo card",
      },
      {
        event: "signup_started",
        method: "email_otp",
        utm_source: "github",
        utm_medium: "social",
        utm_campaign: "launch",
        utm_content: "hero cta",
        utm_term: "repo card",
      },
    ]);
    expect(JSON.stringify(window.dataLayer)).not.toContain("token=secret");
  });

  it("normalizes GitHub repository properties without preserving raw query strings", () => {
    expect(getRepoAnalyticsProperties(" https://github.com/QwenLM/FlashQLA.git?token=secret ")).toEqual({
      repo_host: "github.com",
      repo_full_name: "QwenLM/FlashQLA",
    });
  });

  it("returns unknown-safe properties for invalid repository input", () => {
    expect(getRepoAnalyticsProperties("not a repo")).toEqual({
      repo_host: "unknown",
      repo_full_name: "unknown",
    });
  });

  it("does not load Google tag when no measurement id is configured", () => {
    initializeAnalytics();

    expect(document.querySelector("script[data-quickfork-analytics]")).toBeNull();
    expect(window.dataLayer).toEqual([]);
    expect(window.gtag).toBeUndefined();
  });

  it("loads Google tag once and configures GA4 when a measurement id is configured", () => {
    initializeAnalytics("G-QUICKFORK1");
    initializeAnalytics("G-QUICKFORK1");

    const script = document.querySelector("script[data-quickfork-analytics]");
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("async");
    expect(script).toHaveAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-QUICKFORK1");
    expect(document.querySelectorAll("script[data-quickfork-analytics]")).toHaveLength(1);
    const dataLayer = window.dataLayer as Array<unknown[]>;
    expect(dataLayer[0]?.[0]).toBe("js");
    expect(dataLayer[0]?.[1]).toBeInstanceOf(Date);
    expect(dataLayer[1]).toEqual(["config", "G-QUICKFORK1"]);
  });
});
