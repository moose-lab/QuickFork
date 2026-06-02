import { afterEach, describe, expect, it, vi } from "vitest";

import { getPageAnalyticsProperties, getRepoAnalyticsProperties, initializeAnalytics, trackEvent } from "./analytics";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
  }
}

describe("analytics", () => {
  const originalPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const originalReferrer = document.referrer;

  afterEach(() => {
    delete window.dataLayer;
    delete window.gtag;
    window.sessionStorage.clear();
    window.history.replaceState({}, "", originalPath);
    Object.defineProperty(document, "referrer", { configurable: true, value: originalReferrer });
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

  it("supports full-funnel marketing events while filtering PII and secret-like properties", () => {
    window.dataLayer = [];
    window.gtag = vi.fn();
    window.history.pushState(
      {},
      "",
      "/contact?intent=demo&utm_source=linkedin&utm_medium=organic_social&utm_campaign=founder_led_sales&utm_content=demo_cta",
    );

    trackEvent("demo_requested", {
      request_type: "founder_demo",
      company_domain: "example.dev",
      role_segment: "founder",
      email: "moose@example.dev",
      auth_token: "token=secret",
      raw_query: "intent=demo&token=secret",
    });

    expect(window.dataLayer).toEqual([
      {
        event: "demo_requested",
        request_type: "founder_demo",
        company_domain: "example.dev",
        role_segment: "founder",
        utm_source: "linkedin",
        utm_medium: "organic_social",
        utm_campaign: "founder_led_sales",
        utm_content: "demo_cta",
      },
    ]);
    expect(JSON.stringify(window.dataLayer)).not.toContain("moose@example.dev");
    expect(JSON.stringify(window.dataLayer)).not.toContain("token=secret");
    expect(window.gtag).toHaveBeenCalledWith("event", "demo_requested", {
      request_type: "founder_demo",
      company_domain: "example.dev",
      role_segment: "founder",
      utm_source: "linkedin",
      utm_medium: "organic_social",
      utm_campaign: "founder_led_sales",
      utm_content: "demo_cta",
    });
  });

  it("tracks tool page views while filtering PII and secret-like properties", () => {
    window.dataLayer = [];
    window.gtag = vi.fn();
    window.history.pushState(
      {},
      "",
      "/tools/github-repo-launch-readiness-score?utm_source=product_hunt&utm_campaign=repo_launch&token=secret",
    );

    trackEvent("tool_page_viewed", {
      tool_slug: "github-repo-launch-readiness-score",
      tool_type: "scorecard",
      buyer_stage: "consideration",
      page_type: "tool",
      intent_cluster: "launch_readiness_score",
      email: "founder@example.dev",
      raw_query: "utm_source=product_hunt&token=secret",
    });

    expect(window.dataLayer).toEqual([
      {
        event: "tool_page_viewed",
        tool_slug: "github-repo-launch-readiness-score",
        tool_type: "scorecard",
        buyer_stage: "consideration",
        page_type: "tool",
        intent_cluster: "launch_readiness_score",
        utm_source: "product_hunt",
        utm_campaign: "repo_launch",
      },
    ]);
    expect(JSON.stringify(window.dataLayer)).not.toContain("founder@example.dev");
    expect(JSON.stringify(window.dataLayer)).not.toContain("token=secret");
    expect(window.gtag).toHaveBeenCalledWith("event", "tool_page_viewed", {
      tool_slug: "github-repo-launch-readiness-score",
      tool_type: "scorecard",
      buyer_stage: "consideration",
      page_type: "tool",
      intent_cluster: "launch_readiness_score",
      utm_source: "product_hunt",
      utm_campaign: "repo_launch",
    });
  });

  it("adds page intent metadata for current and future SEO routes without preserving raw query strings", () => {
    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "https://example.com/source?token=secret#section",
    });
    window.history.pushState(
      {},
      "",
      "/resources/open-source-launch-checklist?utm_source=x&token=secret",
    );

    expect(getPageAnalyticsProperties()).toEqual({
      page_path: "/resources/open-source-launch-checklist",
      page_title: document.title,
      page_referrer: "https://example.com/source",
      page_type: "resource",
      page_intent: "education",
      buyer_stage: "awareness",
      intent_cluster: "open_source_launch_checklist",
    });
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
