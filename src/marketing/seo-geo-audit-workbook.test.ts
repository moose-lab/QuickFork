import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  aiSearchAuditSurfaces,
  searchAiBaselineRows,
  searchBaselineSurfaces,
  type SearchBaselineSurface,
} from "./search-ai-baseline";
import {
  buildSeoGeoAuditWorkbookRows,
  getSeoGeoAuditWorkbookRowsForExperiment,
  renderSeoGeoAuditWorkbook,
} from "./seo-geo-audit-workbook";

const csvPath = "docs/marketing/data/seo-geo-audit-workbook.csv";
const requiredHeaders = [
  "audit_id",
  "baseline_id",
  "experiment_id",
  "route_role",
  "canonical_path",
  "target_user",
  "query",
  "query_cluster",
  "surface",
  "task_kind",
  "evidence_fields",
  "success_criteria",
  "forbidden_claims",
  "status",
  "next_action",
] as const;

function parseRows() {
  const source = readFileSync(join(process.cwd(), csvPath), "utf8").trim();
  const [headerLine, ...lines] = source.split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });

  return { headers, rows };
}

describe("SEO/GEO audit workbook", () => {
  it("expands every Search/AI baseline row into one audit task per surface", () => {
    const rows = buildSeoGeoAuditWorkbookRows();
    const expectedCount = searchAiBaselineRows.reduce((count, row) => count + row.surfaces.length, 0);

    expect(rows).toHaveLength(expectedCount);

    for (const baseline of searchAiBaselineRows) {
      for (const surface of baseline.surfaces) {
        const row = rows.find((candidate) => candidate.auditId === `${baseline.id}_${surface}`);

        expect(row).toEqual(
          expect.objectContaining({
            baselineId: baseline.id,
            experimentId: baseline.experimentId,
            routeRole: baseline.routeRole,
            canonicalPath: baseline.canonicalPath,
            targetUser: baseline.targetUser,
            query: baseline.query,
            queryCluster: baseline.queryCluster,
            surface,
            expectedTerms: baseline.expectedTerms,
            forbiddenClaims: baseline.forbiddenClaims,
            status: "pending",
          }),
        );
        expect(row?.evidenceFields.length).toBeGreaterThan(4);
        expect(row?.successCriteria).not.toContain("validated");
        expect(row?.nextAction).not.toHaveLength(0);
      }
    }
  });

  it("uses Search Console and AI answer task kinds with surface-specific evidence fields", () => {
    const rows = buildSeoGeoAuditWorkbookRows();
    const searchConsoleRows = rows.filter((row) => row.surface === "google_search_console");
    const aiRows = rows.filter((row) => row.taskKind === "ai_answer_audit");

    expect(searchConsoleRows).toHaveLength(searchAiBaselineRows.length);
    expect(aiRows).toHaveLength(searchAiBaselineRows.length * aiSearchAuditSurfaces.length);

    for (const row of searchConsoleRows) {
      expect(row.taskKind).toBe("search_console_query_baseline");
      expect(row.evidenceFields).toEqual(
        expect.arrayContaining([
          "window_start",
          "window_end",
          "query",
          "page",
          "impressions",
          "clicks",
          "ctr",
          "average_position",
        ]),
      );
      expect(row.successCriteria).toBe("query_data_collected_and_mapped_to_canonical_page");
    }

    for (const surface of aiSearchAuditSurfaces) {
      const surfaceRows = rows.filter((row) => row.surface === surface);

      expect(surfaceRows).toHaveLength(searchAiBaselineRows.length);
      for (const row of surfaceRows) {
        expect(row.taskKind).toBe("ai_answer_audit");
        expect(row.evidenceFields).toEqual(
          expect.arrayContaining([
            "audit_date",
            "mentioned",
            "cited",
            "source_url",
            "accuracy_status",
            "competitors_cited",
            "forbidden_claims_observed",
          ]),
        );
        expect(row.successCriteria).toBe("answer_mentions_or_omits_quickfork_without_forbidden_claims");
      }
    }
  });

  it("mirrors the editable CSV workbook", () => {
    const { headers, rows } = parseRows();
    const workbookRows = buildSeoGeoAuditWorkbookRows();

    expect(headers).toEqual([...requiredHeaders]);
    expect(rows).toHaveLength(workbookRows.length);

    for (const row of rows) {
      const workbook = workbookRows.find((candidate) => candidate.auditId === row.audit_id);

      expect(workbook).toEqual(
        expect.objectContaining({
          baselineId: row.baseline_id,
          experimentId: row.experiment_id,
          routeRole: row.route_role,
          canonicalPath: row.canonical_path,
          targetUser: row.target_user,
          query: row.query,
          queryCluster: row.query_cluster,
          surface: row.surface as SearchBaselineSurface,
          taskKind: row.task_kind,
          status: row.status,
          nextAction: row.next_action,
        }),
      );
      expect(workbook?.evidenceFields.join("|")).toBe(row.evidence_fields);
      expect(workbook?.successCriteria).toBe(row.success_criteria);
      expect(workbook?.forbiddenClaims.join("|")).toBe(row.forbidden_claims);
    }
  });

  it("renders an experiment workbook for supervisor audit without claiming validation", () => {
    const runbook = renderSeoGeoAuditWorkbook("2026_q2_launch_materials_map_intent_validation");

    expect(runbook).toContain("# SEO/GEO Evidence Workbook");
    expect(runbook).toContain("Experiment: 2026_q2_launch_materials_map_intent_validation");
    expect(runbook).toContain("/product/cold-start-launch-materials");
    expect(runbook).toContain("/product/github-repo-launch-materials-map");
    expect(runbook).toContain("google_search_console");
    expect(runbook).toContain("chatgpt_search");
    expect(runbook).toContain("perplexity");
    expect(runbook).toContain("google_ai_overview");
    expect(runbook).toContain("gemini");
    expect(runbook).toContain("claude");
    expect(runbook).toContain("impressions");
    expect(runbook).toContain("mentioned");
    expect(runbook).toContain("forbidden_claims_observed");
    expect(runbook).toContain(
      "Decision: insufficient_data_until_14_day_ga4_search_console_and_ai_answer_evidence_exists",
    );
    expect(runbook).not.toMatch(/validated demand|ranking win|revenue lift|customer traction|guaranteed launch/i);
  });

  it("keeps experiment workbooks scoped to registered baseline surfaces", () => {
    const rows = getSeoGeoAuditWorkbookRowsForExperiment("2026_q2_source_backed_assets_intent_validation");

    expect(rows).toHaveLength(2 * searchBaselineSurfaces.length);
    expect(new Set(rows.map((row) => row.surface))).toEqual(new Set(searchBaselineSurfaces));
    expect(rows.every((row) => row.experimentId === "2026_q2_source_backed_assets_intent_validation")).toBe(true);
    expect(JSON.stringify(rows)).not.toMatch(/email|token|secret|password|api_key|revenue_amount|customer_logo/i);
  });
});
