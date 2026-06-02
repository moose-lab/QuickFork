import { describe, expect, it } from "vitest";

import { productOutreachPackage } from "./product-outreach-package";

describe("product outreach package", () => {
  it("maps outreach outputs to reviewable launch surfaces", () => {
    expect(productOutreachPackage.outputs.map((output) => output.id)).toEqual([
      "launch_email_draft",
      "community_feedback_post",
      "partner_newsletter_note",
      "product_hunt_first_comment",
      "human_review_checklist",
    ]);
    expect(productOutreachPackage.outputs.every((output) => output.sourceUrl.startsWith("https://"))).toBe(true);
    expect(productOutreachPackage.outputs.every((output) => output.activationMetric)).toBe(true);
  });

  it("keeps outreach guardrails away from spam and guaranteed-result claims", () => {
    const serialized = JSON.stringify(productOutreachPackage);

    expect(serialized).toContain("human-reviewed");
    expect(serialized).toContain("source-backed");
    expect(serialized).not.toMatch(/scraped leads|automatic sending|guaranteed|reply rate|deliverability|revenue/i);
  });
});
