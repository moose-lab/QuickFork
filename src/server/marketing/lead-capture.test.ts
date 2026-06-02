import { describe, expect, it } from "vitest";

import { MockCrmAdapter } from "../crm/mock-adapter";
import type { CrmAdapter } from "../crm/types";
import { captureLead, LeadCaptureError, normalizeLeadCaptureInput } from "./lead-capture";

describe("lead capture", () => {
  it("normalizes resource lead capture and syncs a server-side CRM lead plus activity", async () => {
    const crm = new MockCrmAdapter({ now: () => "2026-05-19T11:00:00.000Z" });

    const result = await captureLead(
      {
        intent: "resource",
        email: " Maintainer@Example.dev ",
        name: "Repo Maintainer",
        companyDomain: "example.dev",
        roleSegment: "open_source_maintainer",
        resourceSlug: "github-project-marketing-card-guide",
        captureLocation: "resource_page",
        crmCampaign: "2026_q2_repo_to_card_demo",
        firstTouch: {
          source: "github",
          medium: "referral",
          campaign: "repo_to_card_demo",
          content: "readme_badge",
          landingPage: "https://seekersai.com/resources/github-project-marketing-card-guide",
          capturedAt: "2026-05-19T07:00:00.000Z",
        },
        lastTouch: {
          source: "x",
          medium: "organic_social",
          campaign: "launch_checklist",
          content: "thread_cta",
          landingPage: "https://seekersai.com/resources/open-source-launch-checklist",
          capturedAt: "2026-05-19T10:00:00.000Z",
        },
      },
      { crm },
    );

    expect(result).toEqual({
      leadId: "lead_1",
      lifecycleStage: "lead",
      activityId: "activity_1",
    });
    expect(crm.listLeads()[0]).toEqual(
      expect.objectContaining({
        identity: {
          email: "maintainer@example.dev",
          name: "Repo Maintainer",
          companyDomain: "example.dev",
          roleSegment: "open_source_maintainer",
        },
        firstTouch: expect.objectContaining({ campaign: "repo_to_card_demo" }),
        lastTouch: expect.objectContaining({ campaign: "launch_checklist" }),
        sourcePage: "https://seekersai.com/resources/github-project-marketing-card-guide",
      }),
    );
    expect(crm.listActivities()[0]).toEqual(
      expect.objectContaining({
        type: "lead_magnet_requested",
        properties: expect.objectContaining({
          resourceSlug: "github-project-marketing-card-guide",
          captureLocation: "resource_page",
          crmCampaign: "2026_q2_repo_to_card_demo",
        }),
      }),
    );
  });

  it("routes demo and contact requests into sales-ready CRM activities", async () => {
    const crm = new MockCrmAdapter({ now: () => "2026-05-19T12:00:00.000Z" });

    const result = await captureLead(
      {
        intent: "demo",
        email: "founder@example.dev",
        companyDomain: "example.dev",
        roleSegment: "founder",
        requestType: "founder_demo",
        contactReason: "launch_workflow_review",
        crmCampaign: "2026_q2_founder_led_sales",
      },
      { crm },
    );

    expect(result.lifecycleStage).toBe("sales_qualified_lead");
    expect(crm.listActivities()[0]).toEqual(
      expect.objectContaining({
        type: "demo_requested",
        properties: expect.objectContaining({
          requestType: "founder_demo",
          contactReason: "launch_workflow_review",
          crmCampaign: "2026_q2_founder_led_sales",
        }),
      }),
    );
  });

  it("preserves full launch package qualification in sales contact CRM activity", async () => {
    const crm = new MockCrmAdapter({ now: () => "2026-06-02T09:00:00.000Z" });

    const result = await captureLead(
      {
        intent: "sales_contact",
        email: "founder@example.dev",
        companyDomain: "example.dev",
        roleSegment: "founder",
        requestType: "full_launch_package",
        contactReason: "full_launch_package",
        crmCampaign: "2026_q2_full_launch_package",
        qualification: {
          repoUrl: " https://github.com/moose-lab/QuickFork ",
          launchTimeline: "within_30_days",
          packageModel: "single_launch",
          buyingTrigger: "launch_deadline",
          packageScope: ["readme", "social", "deck", "outreach", "visual_explainer"],
          humanReviewNeeded: true,
          notes: "Launching an AI repo and need source-backed README, deck, and outreach review.",
        },
        firstTouch: {
          source: "quickfork",
          medium: "product",
          campaign: "full_launch_package",
          content: "artifact_review_cta",
          landingPage: "https://seekersai.com/contact",
          capturedAt: "2026-06-02T08:55:00.000Z",
        },
        lastTouch: {
          source: "quickfork",
          medium: "product",
          campaign: "full_launch_package",
          content: "artifact_review_cta",
          landingPage: "https://seekersai.com/contact",
          capturedAt: "2026-06-02T08:58:00.000Z",
        },
      },
      { crm },
    );

    expect(result.lifecycleStage).toBe("sales_qualified_lead");
    expect(crm.listActivities()[0]).toEqual(
      expect.objectContaining({
        type: "sales_contact_requested",
        properties: expect.objectContaining({
          requestType: "full_launch_package",
          contactReason: "full_launch_package",
          qualification: {
            repoUrl: "https://github.com/moose-lab/QuickFork",
            repoHost: "github.com",
            repoFullName: "moose-lab/QuickFork",
            launchTimeline: "within_30_days",
            packageModel: "single_launch",
            buyingTrigger: "launch_deadline",
            packageScope: ["readme", "social", "deck", "outreach", "visual_explainer"],
            humanReviewNeeded: true,
            notes: "Launching an AI repo and need source-backed README, deck, and outreach review.",
          },
        }),
      }),
    );
  });

  it("rejects missing or malformed lead capture input before CRM sync", () => {
    expect(() => normalizeLeadCaptureInput({ intent: "resource", email: "not-an-email" })).toThrow(
      "email must be a valid email address.",
    );
    expect(() => normalizeLeadCaptureInput({ intent: "resource", email: "lead@example.dev" })).toThrow(
      "resourceSlug is required for resource lead capture.",
    );
    expect(() => normalizeLeadCaptureInput({ intent: "unknown", email: "lead@example.dev" })).toThrow(
      "intent is not supported.",
    );
  });

  it("returns safe CRM sync errors without leaking provider details or secrets", async () => {
    const failingCrm: CrmAdapter = {
      async upsertLead() {
        throw new Error("Provider token=secret failed for maintainer@example.dev");
      },
      async createActivity() {
        throw new Error("should not run");
      },
      async updateLifecycleStage() {
        throw new Error("should not run");
      },
      async createOpportunity() {
        throw new Error("should not run");
      },
    };

    await expect(
      captureLead(
        {
          intent: "demo",
          email: "maintainer@example.dev",
          requestType: "founder_demo",
          crmCampaign: "2026_q2_founder_led_sales",
        },
        { crm: failingCrm },
      ),
    ).rejects.toMatchObject({
      code: "CRM_SYNC_FAILED",
      message: "Lead capture could not be completed.",
    });

    try {
      await captureLead(
        {
          intent: "demo",
          email: "maintainer@example.dev",
          requestType: "founder_demo",
          crmCampaign: "2026_q2_founder_led_sales",
        },
        { crm: failingCrm },
      );
    } catch (error) {
      expect(error).toBeInstanceOf(LeadCaptureError);
      expect(JSON.stringify(error)).not.toContain("token=secret");
      expect(JSON.stringify(error)).not.toContain("maintainer@example.dev");
    }
  });
});
