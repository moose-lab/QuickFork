import { describe, expect, it } from "vitest";

import { scoreLead } from "./lead-scoring";

describe("lead scoring", () => {
  it("marks successful product usage as a product-qualified lead", () => {
    expect(
      scoreLead({
        roleSegment: "open_source_maintainer",
        companyDomain: "example.dev",
        activities: [
          { type: "generation_started", count: 1 },
          { type: "generation_completed", count: 1 },
          { type: "generated_image_downloaded", count: 1 },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        fitScore: 43,
        engagementScore: 80,
        recommendedLifecycleStage: "product_qualified_lead",
        reasonCodes: expect.arrayContaining(["fit:open_source_maintainer", "engagement:generation_completed", "stage:pql"]),
      }),
    );
  });

  it("requires both fit and engagement before recommending an MQL handoff", () => {
    const contentOnly = scoreLead({
      roleSegment: "student",
      emailDomain: "gmail.com",
      activities: [{ type: "lead_magnet_requested", count: 3 }],
    });
    const qualified = scoreLead({
      roleSegment: "developer_advocate",
      companyDomain: "example.dev",
      activities: [
        { type: "lead_magnet_requested", count: 2 },
        { type: "signup_completed", count: 1 },
        { type: "generation_started", count: 1 },
      ],
    });

    expect(contentOnly.recommendedLifecycleStage).toBe("lead");
    expect(contentOnly.reasonCodes).toContain("negative:personal_email_domain");
    expect(qualified).toEqual(
      expect.objectContaining({
        fitScore: 41,
        engagementScore: 80,
        recommendedLifecycleStage: "marketing_qualified_lead",
      }),
    );
  });

  it("routes demo and sales contact requests as sales-qualified when fit is strong enough", () => {
    expect(
      scoreLead({
        roleSegment: "founder",
        companyDomain: "example.dev",
        activities: [{ type: "demo_requested", count: 1 }],
      }),
    ).toEqual(
      expect.objectContaining({
        fitScore: 45,
        engagementScore: 45,
        recommendedLifecycleStage: "sales_qualified_lead",
        reasonCodes: expect.arrayContaining(["engagement:demo_requested", "stage:sql"]),
      }),
    );
  });
});
