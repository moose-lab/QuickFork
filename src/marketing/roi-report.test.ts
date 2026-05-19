import { describe, expect, it } from "vitest";

import { buildCampaignRoiReport } from "./roi-report";

describe("campaign ROI report", () => {
  it("separates pipeline ROI from booked ROI for bottom-funnel reporting", () => {
    expect(
      buildCampaignRoiReport([
        {
          campaign: "founder_led_sales",
          source: "linkedin",
          medium: "organic_social",
          cost: 400,
          activations: 8,
          leads: 5,
          mqls: 3,
          sqls: 2,
          opportunities: 1,
          pipelineValue: 2500,
          closedWonValue: 0,
          currency: "USD",
        },
      ]),
    ).toEqual([
      {
        campaign: "founder_led_sales",
        source: "linkedin",
        medium: "organic_social",
        cost: 400,
        currency: "USD",
        activations: 8,
        leads: 5,
        mqls: 3,
        sqls: 2,
        opportunities: 1,
        pipelineValue: 2500,
        closedWonValue: 0,
        costPerActivation: 50,
        costPerLead: 80,
        costPerMql: 133.33,
        costPerOpportunity: 400,
        pipelineRoi: 5.25,
        bookedRoi: -1,
        valueBasis: "pipeline_estimate",
        warnings: ["closed_won_value_zero"],
      },
    ]);
  });

  it("handles missing cost or opportunity values explicitly", () => {
    expect(
      buildCampaignRoiReport([
        {
          campaign: "repo_to_card_demo",
          source: "github",
          medium: "referral",
          activations: 12,
          leads: 4,
          mqls: 1,
          sqls: 0,
          opportunities: 0,
          currency: "USD",
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        campaign: "repo_to_card_demo",
        cost: null,
        pipelineValue: null,
        closedWonValue: null,
        costPerActivation: null,
        costPerLead: null,
        costPerMql: null,
        costPerOpportunity: null,
        pipelineRoi: null,
        bookedRoi: null,
        valueBasis: "activation_only",
        warnings: ["cost_missing", "pipeline_value_missing", "closed_won_value_missing", "opportunities_zero"],
      }),
    ]);
  });

  it("aggregates repeated campaign rows before calculating ratios", () => {
    const [report] = buildCampaignRoiReport([
      {
        campaign: "launch_checklist",
        source: "x",
        medium: "organic_social",
        cost: 100,
        activations: 2,
        leads: 2,
        mqls: 1,
        sqls: 0,
        opportunities: 0,
        pipelineValue: 0,
        closedWonValue: 0,
        currency: "USD",
      },
      {
        campaign: "launch_checklist",
        source: "x",
        medium: "organic_social",
        cost: 50,
        activations: 4,
        leads: 3,
        mqls: 1,
        sqls: 1,
        opportunities: 1,
        pipelineValue: 900,
        closedWonValue: 300,
        currency: "USD",
      },
    ]);

    expect(report).toEqual(
      expect.objectContaining({
        cost: 150,
        activations: 6,
        leads: 5,
        mqls: 2,
        sqls: 1,
        opportunities: 1,
        pipelineValue: 900,
        closedWonValue: 300,
        costPerActivation: 25,
        costPerLead: 30,
        costPerMql: 75,
        costPerOpportunity: 150,
        pipelineRoi: 5,
        bookedRoi: 1,
        valueBasis: "booked_revenue",
      }),
    );
  });
});
