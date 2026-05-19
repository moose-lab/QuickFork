import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { MockCrmAdapter } from "./mock-adapter";
import type { CrmAdapter } from "./types";

const firstTouch = {
  source: "github",
  medium: "referral",
  campaign: "repo_to_card_demo",
  content: "readme_badge",
  landingPage: "https://seekersai.com/resources/github-project-marketing-card-guide",
  capturedAt: "2026-05-19T07:00:00.000Z",
};

const lastTouch = {
  source: "linkedin",
  medium: "organic_social",
  campaign: "founder_led_sales",
  content: "demo_cta",
  landingPage: "https://seekersai.com/contact?intent=demo",
  capturedAt: "2026-05-19T08:00:00.000Z",
};

describe("CRM adapter contract", () => {
  it("upserts leads by normalized email while preserving first-touch attribution", async () => {
    const crm: CrmAdapter = new MockCrmAdapter({ now: () => "2026-05-19T08:30:00.000Z" });

    const created = await crm.upsertLead({
      identity: {
        email: "Founder@Example.dev",
        name: "Founding User",
        companyDomain: "example.dev",
        roleSegment: "founder",
      },
      lifecycleStage: "lead",
      firstTouch,
      lastTouch: firstTouch,
      fitScore: 38,
      engagementScore: 22,
      sourcePage: firstTouch.landingPage,
    });
    const updated = await crm.upsertLead({
      identity: {
        email: "founder@example.dev",
        name: "Founding User",
        companyDomain: "example.dev",
        roleSegment: "founder",
      },
      lifecycleStage: "product_qualified_lead",
      firstTouch: lastTouch,
      lastTouch,
      fitScore: 44,
      engagementScore: 68,
      sourcePage: lastTouch.landingPage,
    });

    expect(updated.id).toBe(created.id);
    expect(updated.identity.email).toBe("founder@example.dev");
    expect(updated.firstTouch).toEqual(firstTouch);
    expect(updated.lastTouch).toEqual(lastTouch);
    expect(updated.lifecycleStage).toBe("product_qualified_lead");
    expect(updated.fitScore).toBe(44);
    expect(updated.engagementScore).toBe(68);
  });

  it("records activities and lifecycle handoffs without binding to a specific CRM vendor", async () => {
    const crm = new MockCrmAdapter({ now: () => "2026-05-19T09:00:00.000Z" });
    const lead = await crm.upsertLead({
      identity: { email: "maintainer@example.dev", roleSegment: "open_source_maintainer" },
      lifecycleStage: "lead",
      firstTouch,
      lastTouch: firstTouch,
      fitScore: 42,
      engagementScore: 60,
      sourcePage: firstTouch.landingPage,
    });

    const activity = await crm.createActivity({
      leadId: lead.id,
      type: "lead_magnet_requested",
      occurredAt: "2026-05-19T09:01:00.000Z",
      properties: {
        resourceSlug: "github-project-marketing-card-guide",
        captureLocation: "resource_page",
        crmCampaign: "2026_q2_repo_to_card_demo",
      },
    });
    const qualified = await crm.updateLifecycleStage({
      leadId: lead.id,
      lifecycleStage: "marketing_qualified_lead",
      qualificationReason: "High-intent resource request and product usage",
      fitScore: 52,
      engagementScore: 74,
    });

    expect(activity).toEqual(
      expect.objectContaining({
        id: "activity_1",
        leadId: lead.id,
        type: "lead_magnet_requested",
      }),
    );
    expect(qualified.lifecycleStage).toBe("marketing_qualified_lead");
    expect(qualified.qualificationReason).toBe("High-intent resource request and product usage");
    expect(qualified.fitScore).toBe(52);
    expect(qualified.engagementScore).toBe(74);
  });

  it("creates estimated opportunities for ROI reporting before payments exist", async () => {
    const crm = new MockCrmAdapter({ now: () => "2026-05-19T10:00:00.000Z" });
    const lead = await crm.upsertLead({
      identity: { email: "buyer@example.dev", companyDomain: "example.dev", roleSegment: "founder" },
      lifecycleStage: "sales_qualified_lead",
      firstTouch,
      lastTouch,
      fitScore: 70,
      engagementScore: 82,
      sourcePage: lastTouch.landingPage,
    });

    const opportunity = await crm.createOpportunity({
      leadId: lead.id,
      name: "Example.dev launch workflow pilot",
      estimatedValue: 2500,
      currency: "USD",
      sourceCampaign: "founder_led_sales",
      stage: "qualified",
    });

    expect(opportunity).toEqual({
      id: "opportunity_1",
      leadId: lead.id,
      name: "Example.dev launch workflow pilot",
      estimatedValue: 2500,
      currency: "USD",
      sourceCampaign: "founder_led_sales",
      stage: "qualified",
      createdAt: "2026-05-19T10:00:00.000Z",
      updatedAt: "2026-05-19T10:00:00.000Z",
    });
  });

  it("keeps browser analytics and server-side CRM PII storage as separate modules", () => {
    const crmSources = ["src/server/crm/types.ts", "src/server/crm/mock-adapter.ts"].map((path) =>
      readFileSync(join(process.cwd(), path), "utf8"),
    );

    for (const source of crmSources) {
      expect(source).not.toContain("trackEvent");
      expect(source).not.toContain("../lib/analytics");
      expect(source).not.toContain("../../lib/analytics");
    }
  });
});
