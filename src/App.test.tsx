import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const appStyles = readFileSync("src/styles/app.css", "utf8");
const designSpec = readFileSync("DESIGN.md", "utf8");

describe("App", () => {
  const originalPath = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, "", originalPath);
    delete window.dataLayer;
    window.sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("renders the landing architecture around the repository launch package", () => {
    render(<App />);

    expect(screen.getByRole("banner")).toHaveClass("nav");
    expect(appStyles).toMatch(/\.nav\s*{[^}]*position:\s*sticky;/s);
    expect(appStyles).toMatch(/\.heroGrid\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*4fr\)\s+minmax\(0,\s*6fr\);/s);
    expect(appStyles).toMatch(/\.hero h1\s*{[^}]*font-family:\s*var\(--font-body\);/s);
    expect(appStyles).toMatch(/\.sectionTitle h2,\s*\.showcaseCopy h3,\s*\.proofAside h3,\s*\.closing h2\s*{[^}]*font-family:\s*var\(--font-body\);/s);
    expect(appStyles).not.toMatch(/drop::first-letter/);
    expect(appStyles).toMatch(/\.productPlayback\s*{[^}]*border:\s*0;[^}]*padding:\s*0;[^}]*box-shadow:\s*none;/s);
    expect(appStyles).toMatch(/\.referenceForm\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+116px;/s);
    expect(appStyles).toMatch(/\.referenceControls\s*{[^}]*grid-template-columns:\s*minmax\(220px,\s*0\.58fr\)\s+minmax\(150px,\s*0\.42fr\);/s);
    expect(designSpec).toContain("Desktop ratio is 4:6.");
    expect(designSpec).toContain("All visible H1 and H2 headings use the same body sans stack");
    expect(designSpec).toContain("The right animation area is unframed.");
    expect(designSpec).toContain("Hero generation quality is fixed to low by default");
    expect(designSpec).toContain("English is selected by default and Chinese/Japanese are optional");
    expect(designSpec).toContain("a ratio dropdown aligned on the same row as language controls");
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quickfork home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /product/i })).toHaveAttribute("href", "#studio");
    expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute("href", "#pricing");
    const footerNav = screen.getByRole("navigation", { name: /footer/i });
    expect(within(footerNav).getByRole("link", { name: /^contact$/i })).toHaveAttribute("href", "/contact");
    expect(within(footerNav).getByRole("link", { name: /^help$/i })).toHaveAttribute("href", "/help");
    expect(within(footerNav).getByRole("link", { name: /^privacy$/i })).toHaveAttribute("href", "/privacy");
    expect(within(footerNav).getByRole("link", { name: /^terms$/i })).toHaveAttribute("href", "/terms");
    expect(screen.queryByRole("link", { name: /start a fork/i })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /generate a cold-start launch package from one github repository/i,
      }),
    ).toBeInTheDocument();
    const form = screen.getByRole("form", { name: /project launch generator/i });
    expect(within(form).getByRole("textbox", { name: /github repository url/i })).toHaveValue("https://github.com/QwenLM/FlashQLA");
    expect(within(form).getByRole("textbox", { name: /github repository url/i })).toHaveAttribute("placeholder", "https://github.com/owner/repo");
    expect(within(form).getByText(/Can be used to generate README, PPT, or social media launch assets\./i)).toBeInTheDocument();
    expect(within(form).getByRole("button", { name: /^generate$/i })).toBeInTheDocument();
    expect(within(form).queryByLabelText(/hero image quality/i)).not.toBeInTheDocument();
    const languageGroup = within(form).getByRole("group", { name: /^languages$/i });
    const ratioSelect = within(form).getByRole("combobox", { name: /asset ratio/i });
    expect(within(languageGroup).getByRole("button", { name: /english/i })).toHaveTextContent("EN");
    expect(within(languageGroup).getByRole("button", { name: /english/i })).toHaveAttribute("aria-pressed", "true");
    expect(within(languageGroup).getByRole("button", { name: /chinese/i })).toHaveTextContent("ZH");
    expect(within(languageGroup).getByRole("button", { name: /chinese/i })).toHaveAttribute("aria-pressed", "false");
    expect(within(languageGroup).getByRole("button", { name: /japanese/i })).toHaveTextContent("JA");
    expect(within(languageGroup).getByRole("button", { name: /japanese/i })).toHaveAttribute("aria-pressed", "false");
    expect(ratioSelect).toHaveValue("4:3");
    expect(within(form).getByRole("option", { name: "16:9" })).toBeInTheDocument();
    expect(within(form).getByRole("option", { name: "1:1" })).toBeInTheDocument();
    expect(within(form).getByRole("option", { name: "4:3" })).toBeInTheDocument();
    expect(within(form).getByRole("option", { name: "3:4" })).toBeInTheDocument();
    expect(within(form).getByRole("option", { name: "9:16" })).toBeInTheDocument();
    const heroVideo = document.querySelector('video[aria-label="Product animation playback"]');
    expect(heroVideo).toBeInTheDocument();
    expect(heroVideo).toHaveAttribute("src", "/media/quickfork-hero-16x9-black.mp4");
    expect(heroVideo).toHaveAttribute("autoPlay");
    expect(heroVideo).not.toHaveAttribute("controls");
    expect(heroVideo).not.toHaveAttribute("controlsList");
    expect(heroVideo).toHaveAttribute("disablePictureInPicture");
    expect(heroVideo).toHaveAttribute("disableRemotePlayback");
    expect(heroVideo).toHaveAttribute("data-audio-autoplay", "managed");
    expect(heroVideo).not.toHaveAttribute("muted");
    expect(screen.getByLabelText(/QuickFork product preview/i)).toBeInTheDocument();
    expect(screen.queryByText(/Live product playback/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /see the flow/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /preview prompts/i })).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /QuickFork reads repository evidence, explains the project visually, and drafts README, social, deck, and outreach assets/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Generate a source-backed launch package from repository evidence/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /From GitHub URL to multilingual launch package/i })).toBeInTheDocument();
  }, 10000);

  it("keeps the generator studio inside the redesigned frontend", () => {
    render(<App />);

    expect(screen.getByText(/Product studio/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /^GitHub URL$/i })).toBeInTheDocument();
    expect(screen.getByText(/Model settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Narrative options/i)).toBeInTheDocument();
    expect(screen.getByText(/Localized launch package/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^\s*Infographic prompt$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/README/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PPT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Social/i).length).toBeGreaterThan(0);
  });

  it("tracks route-level page views with funnel intent metadata", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/sign-up?utm_source=github&token=secret");

    render(<App />);

    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/sign-up",
          page_type: "auth",
          page_intent: "account_creation",
          buyer_stage: "decision",
          intent_cluster: "signup",
          utm_source: "github",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("token=secret");
  });

  it("renders catalog-backed marketing route shells with route metadata and CTAs", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/resources/github-project-marketing-card-guide?utm_source=github");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /github project marketing card for teams preparing a public project launch/i,
      }),
    ).toBeInTheDocument();
    const routeDetails = screen.getByRole("complementary", { name: /marketing route details/i });
    expect(screen.getByText("https://seekersai.com/resources/github-project-marketing-card-guide")).toBeInTheDocument();
    expect(within(routeDetails).getByText("Resource")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /generate free repo brief/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#hero");
    expect(document.title).toBe("GitHub Project Marketing Card | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      expect.stringContaining("github project marketing card"),
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/resources/github-project-marketing-card-guide",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/resources/github-project-marketing-card-guide",
          page_type: "resource",
          page_intent: "education",
          buyer_stage: "awareness",
          intent_cluster: "github_project_marketing_card",
          utm_source: "github",
        }),
        expect.objectContaining({
          event: "resource_page_viewed",
          resource_slug: "github-project-marketing-card-guide",
          resource_type: "guide",
          buyer_stage: "awareness",
          page_type: "resource",
          utm_source: "github",
        }),
      ]),
    );
  });

  it("renders the GitHub repo to launch package page as a high-intent growth page", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/product/github-repo-to-launch-package?utm_source=google");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /github repo to launch package for cold-start technical launches/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/source-backed README, social, deck, outreach, and visual explainer assets/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/AI project builders, open-source maintainers/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Start from one repository URL/i)).toBeInTheDocument();
    expect(screen.getByText(/Package the same story for every channel/i)).toBeInTheDocument();
    expect(screen.getByText(/Review before publishing/i)).toBeInTheDocument();
    expect(screen.getByText(/How is this different from asking ChatGPT to write launch copy/i)).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /generate free repo brief/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#hero");
    expect(document.title).toBe("GitHub Repo To Launch Package | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps github repo to launch package demand into source-backed README, social, deck, outreach, and visual explainer assets for cold-start technical launches.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/product/github-repo-to-launch-package",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/product/github-repo-to-launch-package",
          page_type: "product",
          page_intent: "category_or_feature_consideration",
          buyer_stage: "consideration",
          intent_cluster: "github_repo_to_launch_package",
          utm_source: "google",
        }),
      ]),
    );
  });

  it("submits resource lead capture forms to the CRM-safe server endpoint", async () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/resources/github-project-marketing-card-guide?utm_source=github");
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ leadId: "lead_1", lifecycleStage: "lead", activityId: "activity_1" }), {
          headers: { "Content-Type": "application/json" },
          status: 201,
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: "maintainer@example.dev" } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Repo Maintainer" } });
    fireEvent.click(screen.getByRole("button", { name: /request resource/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/lead-capture",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const payload = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(payload).toMatchObject({
      intent: "resource",
      email: "maintainer@example.dev",
      name: "Repo Maintainer",
      resourceSlug: "github-project-marketing-card-guide",
      captureLocation: "marketing_page",
      crmCampaign: "2026_q2_repo_to_card_demo",
      firstTouch: expect.objectContaining({
        source: "github",
        landingPage: "http://localhost:3000/resources/github-project-marketing-card-guide",
      }),
    });
    expect(await screen.findByText(/check your inbox for the resource/i)).toBeInTheDocument();
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "lead_magnet_requested",
          resource_slug: "github-project-marketing-card-guide",
          capture_location: "marketing_page",
        }),
        expect.objectContaining({
          event: "lead_magnet_delivered",
          resource_slug: "github-project-marketing-card-guide",
          delivery_channel: "email",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("maintainer@example.dev");
  });

  it("submits contact intent forms for bottom-funnel demo requests", async () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/contact?intent=demo&utm_source=linkedin");
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            leadId: "lead_1",
            lifecycleStage: "sales_qualified_lead",
            activityId: "activity_1",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 201,
          },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    expect(screen.getByRole("heading", { name: /quickfork demo for founder-led follow-up/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: "founder@example.dev" } });
    fireEvent.change(screen.getByLabelText(/company domain/i), { target: { value: "example.dev" } });
    fireEvent.click(screen.getByRole("button", { name: /request demo/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const payload = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(payload).toMatchObject({
      intent: "demo",
      email: "founder@example.dev",
      companyDomain: "example.dev",
      requestType: "founder_demo",
      contactReason: "quickfork_demo",
      crmCampaign: "2026_q2_founder_led_sales",
      firstTouch: expect.objectContaining({
        source: "linkedin",
        landingPage: "http://localhost:3000/contact",
      }),
    });
    expect(await screen.findByText(/we will follow up with the next step/i)).toBeInTheDocument();
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "demo_requested",
          request_type: "founder_demo",
          company_domain: "example.dev",
          role_segment: "founder",
          utm_source: "linkedin",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("founder@example.dev");
  });

  it("renders help and legal footer routes with public metadata", () => {
    window.history.replaceState({}, "", "/help");
    const { rerender } = render(<App />);

    expect(screen.getByRole("heading", { name: /help center/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quickfork home/i })).toHaveAttribute("href", "/#hero");
    expect(screen.getByRole("link", { name: /product/i })).toHaveAttribute("href", "/#studio");
    expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute("href", "/#pricing");
    expect(screen.getByRole("link", { name: /contact the team/i })).toHaveAttribute("href", "/contact");
    expect(document.title).toBe("Help Center | QuickFork");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://seekersai.com/help");

    window.history.replaceState({}, "", "/privacy");
    rerender(<App />);

    expect(screen.getByRole("heading", { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/QuickFork should only use repository evidence/i)).toBeInTheDocument();
    expect(document.title).toBe("Privacy Policy | QuickFork");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://seekersai.com/privacy");

    window.history.replaceState({}, "", "/terms");
    rerender(<App />);

    expect(screen.getByRole("heading", { name: /terms of service/i })).toBeInTheDocument();
    expect(screen.getByText(/Do not use QuickFork to publish unsupported claims/i)).toBeInTheDocument();
    expect(document.title).toBe("Terms of Service | QuickFork");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://seekersai.com/terms");
  });

  it("submits the Hero generator form to the backend generation API", async () => {
    window.dataLayer = [];
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          id: "gen_qwenlm_flashqla_test",
          status: "completed",
          repo: {
            owner: "QwenLM",
            repo: "FlashQLA",
            full_name: "QwenLM/FlashQLA",
            repo_url: "https://github.com/QwenLM/FlashQLA",
          },
          artifactRoot: "output/project-launch/qwenlm-flashqla",
          manifestPath: "output/project-launch/qwenlm-flashqla/manifest.json",
          outputs: {
            en: {
              promptPath: "output/project-launch/qwenlm-flashqla/en/marketing_card_prompt.txt",
              imagePath: "output/project-launch/qwenlm-flashqla/en/marketing-card.png",
              imageUrl: "https://wavespeed.ai/generated/qwenlm-flashqla.png",
              qualityReportPath: "output/project-launch/qwenlm-flashqla/en/quality-report.json",
            },
          },
          stages: [
            { id: "repo", label: "Repository source", status: "completed" },
            { id: "readme", label: "GPT5.5 README analysis", status: "completed", model: "openai/gpt-5.5" },
            { id: "image", label: "gpt-image-2 render", status: "completed", model: "openai/gpt-image-2/text-to-image" },
          ],
          modelCalls: [
            { provider: "wavespeed", model: "openai/gpt-5.5", purpose: "readme_analysis", status: "completed" },
            { provider: "wavespeed", model: "openai/gpt-image-2/text-to-image", purpose: "image_generation", status: "completed" },
          ],
          launchBrief: {
            summary: "CUDA kernels for faster attention inference.",
            audienceHypothesis: "AI project builders, open-source maintainers, and technical founders evaluating launch readiness.",
            readmeChecklist: [
              {
                item: "Lead with a one-sentence README value proposition.",
                source: "Derived from repository evidence and README positioning.",
              },
              {
                item: "Show source-backed features before implementation detail.",
                source: "README or repo metadata includes: Optimizes attention kernels for lower latency inference.",
              },
            ],
            launchAngles: [
              {
                title: "Launch angle 1",
                body: "Optimizes attention kernels for lower latency inference.",
                source: "README or repo metadata includes: Optimizes attention kernels for lower latency inference.",
              },
            ],
            socialPost: "CUDA kernels for faster attention inference.\n\nOptimizes attention kernels for lower latency inference.\n\ngithub.com/QwenLM/FlashQLA",
            deckOutline: [
              "Problem: FlashQLA is hard to understand from raw repository context.",
              "What it does: CUDA kernels for faster attention inference.",
              "Why it matters: Optimizes attention kernels for lower latency inference.",
              "Workflow: Install kernels -> Run benchmark -> Ship inference",
            ],
            outreachDraft:
              "Hi, I found FlashQLA and put together a source-backed launch brief from github.com/QwenLM/FlashQLA.",
            visualExplainerPrompt:
              "Create a ai_kernel_infra visual explainer using workflow_diagram. Keep the GitHub strip as github.com/QwenLM/FlashQLA.",
            sourceReferences: [
              "README or repo metadata includes: Optimizes attention kernels for lower latency inference.",
            ],
            artifacts: [
              {
                type: "readme",
                label: "README launch brief",
                fileName: "qwenlm-flashqla-readme-launch-brief.md",
                body: "README checklist\n- Lead with source-backed value.",
                sourceReferences: ["README or repo metadata includes: Optimizes attention kernels."],
              },
              {
                type: "social",
                label: "Social launch post",
                fileName: "qwenlm-flashqla-social-launch-post.txt",
                body: "CUDA kernels for faster attention inference.",
                sourceReferences: ["README or repo metadata includes: Optimizes attention kernels."],
              },
            ],
          },
        }),
        { headers: { "Content-Type": "application/json" }, status: 201 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    const form = screen.getByRole("form", { name: /project launch generator/i });
    fireEvent.change(within(form).getByRole("textbox", { name: /github repository url/i }), {
      target: { value: "https://github.com/QwenLM/FlashQLA" },
    });
    fireEvent.blur(within(form).getByRole("textbox", { name: /github repository url/i }));
    fireEvent.click(within(form).getByRole("button", { name: /^generate$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/generations",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const requestBody = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(requestBody).toEqual({
      repoUrl: "https://github.com/QwenLM/FlashQLA",
      locales: ["en"],
      preset: "4:3",
      provider: "wavespeed",
      imageQuality: "low",
    });
    expect(await screen.findByText(/generated gen_qwenlm_flashqla_test/i)).toBeInTheDocument();
    const previewImage = await within(form).findByRole("img", { name: /qwenlm\/flashqla launch card/i });
    const controls = form.querySelector(".referenceControls");
    expect(previewImage).toHaveAttribute("src", "https://wavespeed.ai/generated/qwenlm-flashqla.png");
    expect(previewImage.closest(".generationPreview")).toHaveAccessibleName("Generated Wavespeed image result");
    expect(controls).not.toBeNull();
    expect((controls?.compareDocumentPosition(previewImage) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(within(form).getByRole("link", { name: /download generated image/i })).toHaveAttribute(
      "href",
      "https://wavespeed.ai/generated/qwenlm-flashqla.png",
    );
    const briefRegion = await screen.findByRole("region", { name: /free repo launch brief/i });
    expect(within(briefRegion).getByText(/AI project builders, open-source maintainers/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Lead with a one-sentence README value proposition/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Launch angle 1/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Create a ai_kernel_infra visual explainer/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Export artifacts/i)).toBeInTheDocument();
    expect(within(briefRegion).getByRole("button", { name: /copy README launch brief/i })).toBeInTheDocument();
    expect(within(briefRegion).getByRole("link", { name: /download README launch brief/i })).toHaveAttribute(
      "download",
      "qwenlm-flashqla-readme-launch-brief.md",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/",
        }),
        expect.objectContaining({
          event: "hero_repo_url_entered",
          repo_host: "github.com",
          repo_full_name: "QwenLM/FlashQLA",
        }),
        expect.objectContaining({
          event: "generation_started",
          repo_host: "github.com",
          repo_full_name: "QwenLM/FlashQLA",
          locales: "en",
          locale_count: 1,
          preset: "4:3",
          image_quality: "low",
        }),
        expect.objectContaining({
          event: "generation_completed",
          repo_host: "github.com",
          repo_full_name: "QwenLM/FlashQLA",
          generation_id: "gen_qwenlm_flashqla_test",
          locales: "en",
          locale_count: 1,
          preset: "4:3",
          has_image_url: true,
        }),
        expect.objectContaining({
          event: "launch_brief_viewed",
          repo_full_name: "QwenLM/FlashQLA",
          generation_id: "gen_qwenlm_flashqla_test",
          brief_sections: 6,
        }),
      ]),
    );

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn(async () => undefined) },
    });
    fireEvent.click(within(briefRegion).getByRole("button", { name: /copy launch brief/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Free repo launch brief"));
    fireEvent.click(within(briefRegion).getByRole("button", { name: /copy README launch brief/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("README checklist"));
    fireEvent.click(within(briefRegion).getByRole("link", { name: /download README launch brief/i }));
    await waitFor(() =>
      expect(window.dataLayer).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            event: "launch_brief_copied",
            repo_full_name: "QwenLM/FlashQLA",
            generation_id: "gen_qwenlm_flashqla_test",
            artifact_type: "free_repo_launch_brief",
          }),
          expect.objectContaining({
            event: "launch_artifact_copied",
            repo_full_name: "QwenLM/FlashQLA",
            generation_id: "gen_qwenlm_flashqla_test",
            artifact_type: "readme",
            artifact_label: "README launch brief",
            artifact_format: "text",
          }),
          expect.objectContaining({
            event: "launch_artifact_downloaded",
            repo_full_name: "QwenLM/FlashQLA",
            generation_id: "gen_qwenlm_flashqla_test",
            artifact_type: "readme",
            artifact_label: "README launch brief",
            artifact_format: "text",
          }),
        ]),
      ),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("README checklist");

    fireEvent.click(previewImage);
    const previewDialog = await screen.findByRole("dialog", { name: /generated image preview/i });
    expect(within(previewDialog).getByRole("img", { name: /qwenlm\/flashqla launch card/i })).toHaveAttribute(
      "src",
      "https://wavespeed.ai/generated/qwenlm-flashqla.png",
    );
    expect(within(previewDialog).getByRole("link", { name: /download generated image/i })).toHaveAttribute(
      "download",
      "qwenlm-flashqla.png",
    );
    fireEvent.click(within(previewDialog).getByRole("link", { name: /download generated image/i }));
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "generated_image_preview_opened",
          repo_full_name: "QwenLM/FlashQLA",
          generation_id: "gen_qwenlm_flashqla_test",
          output_locale: "EN",
          preset: "4:3",
        }),
        expect.objectContaining({
          event: "generated_image_downloaded",
          repo_full_name: "QwenLM/FlashQLA",
          generation_id: "gen_qwenlm_flashqla_test",
          output_locale: "EN",
          preset: "4:3",
        }),
      ]),
    );

    expect(screen.queryByLabelText(/generated launch output/i)).not.toBeInTheDocument();
    expect(within(form).queryByText(/output package/i)).not.toBeInTheDocument();
    expect(within(form).queryByText("output/project-launch/qwenlm-flashqla")).not.toBeInTheDocument();
    expect(within(form).queryByText(/manifest\.json/i)).not.toBeInTheDocument();
    expect(within(form).queryByText(/GPT5\.5 README analysis/i)).not.toBeInTheDocument();
    expect(within(form).queryByText(/gpt-image-2 render/i)).not.toBeInTheDocument();
    expect(within(form).queryByText(/marketing_card_prompt\.txt/i)).not.toBeInTheDocument();
    expect(within(form).queryByText(/marketing-card\.png/i)).not.toBeInTheDocument();
    expect(within(form).queryByText(/quality-report\.json/i)).not.toBeInTheDocument();
  });

  it("tracks generation failures without sending raw backend error text", async () => {
    window.dataLayer = [];
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ error: { message: "Provider failed for token=secret" } }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    const form = screen.getByRole("form", { name: /project launch generator/i });
    fireEvent.click(within(form).getByRole("button", { name: /^generate$/i }));

    await screen.findByText(/provider failed for token=secret/i);
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "generation_failed",
          repo_host: "github.com",
          repo_full_name: "QwenLM/FlashQLA",
          error_type: "request_failed",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("token=secret");
  });

  it("uses native FAQ disclosure items", () => {
    render(<App />);

    const defaultQuestion = screen.getByText(/What does QuickFork generate from a repository URL/i).closest("details");

    expect(defaultQuestion).toBeInTheDocument();
    expect(defaultQuestion).toHaveAttribute("open");
    expect(screen.getByText(/How does QuickFork avoid generic AI marketing copy/i)).toBeInTheDocument();
  });

  it("renders sign-in and sign-up routes for auth entry", () => {
    window.history.replaceState({}, "", "/sign-in");
    const { rerender } = render(<App />);

    expect(screen.getByRole("heading", { name: /sign in to quickfork/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send sign-in code/i })).toBeInTheDocument();

    window.history.replaceState({}, "", "/sign-up");
    rerender(<App />);

    expect(screen.getByRole("heading", { name: /create your quickfork account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send sign-up code/i })).toBeInTheDocument();
  });

  it("shows auth state controls in the top navigation", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/sign-in");
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/sign-up");
  });
});
