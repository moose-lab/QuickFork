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

  it("renders a source-backed launch package example for a real repository route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/examples/qwenlm-flashqla-launch-card?utm_source=github");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /QwenLM FlashQLA Launch Card as a source-backed launch package example/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/source-backed launch package example/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/QwenLM\/FlashQLA/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Target user discovery map/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Project story map/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/README launch brief/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Social launch post/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Launch deck outline/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Product outreach draft/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI project builders evaluating CUDA attention performance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Does this kernel reduce inference bottlenecks enough to try/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/No invented benchmark, customer, ranking, revenue, or pricing claims/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /QwenLM\/FlashQLA source repository/i })).toHaveAttribute(
      "href",
      "https://github.com/QwenLM/FlashQLA",
    );
    expect(screen.getByRole("link", { name: /QuickFork launch package generator/i })).toHaveAttribute("href", "/#hero");
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /generate similar card/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#hero");
    expect(document.title).toBe("QwenLM FlashQLA Launch Card | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps qwenlm flashqla launch card demand into a source-backed launch package example with target-user discovery, story map, README, social, deck, and outreach outputs.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/examples/qwenlm-flashqla-launch-card",
    );
    const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity[0].name).toContain("What does this QuickFork example show");
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/examples/qwenlm-flashqla-launch-card",
          page_type: "example",
          page_intent: "proof",
          buyer_stage: "decision",
          intent_cluster: "qwenlm_flashqla_launch_card",
          utm_source: "github",
        }),
        expect.objectContaining({
          event: "example_page_viewed",
          example_slug: "qwenlm-flashqla-launch-card",
          repo_full_name: "QwenLM/FlashQLA",
          source_type: "curated_catalog",
          buyer_stage: "decision",
          page_type: "example",
          intent_cluster: "qwenlm_flashqla_launch_card",
          utm_source: "github",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(
      /email|token|secret|api_key|ranking|revenue|customers|guaranteed|viral|raw|readme/i,
    );
  }, 10000);

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

  it("renders the AI project launch use case as an AI/GEO growth route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/use-cases/ai-project-launch?utm_source=perplexity");

    render(<App />);

    expect(screen.getByRole("heading", { name: /AI project launch/i })).toBeInTheDocument();
    expect(screen.getByText(/source-backed launch package for an AI repository/i)).toBeInTheDocument();
    expect(screen.getAllByText(/AI project builders and open-source AI maintainers/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Turn repo evidence into a launch story/i)).toBeInTheDocument();
    expect(screen.getByText(/What does an AI project launch page need to explain/i)).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /generate free repo brief/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#hero");
    fireEvent.click(primaryCta!);
    expect(document.title).toBe("AI Project Launch | QuickFork");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/use-cases/ai-project-launch",
    );
    const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity[0].name).toContain("What does an AI project launch page need to explain");
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/use-cases/ai-project-launch",
          page_type: "use_case",
          buyer_stage: "consideration",
          intent_cluster: "ai_project_launch",
          utm_source: "perplexity",
        }),
        expect.objectContaining({
          event: "cta_clicked",
          cta_id: "generate_launch_card",
          cta_location: "marketing_page_hero",
          page_type: "use_case",
          intent_cluster: "ai_project_launch",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(/ranking|revenue|customers|guaranteed/i);
  });

  it("renders the GitHub repo launch demand map as a source-backed research route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/resources/github-repo-launch-demand-map?utm_source=product_hunt");

    render(<App />);

    expect(screen.getByRole("heading", { name: /GitHub repo launch demand/i })).toBeInTheDocument();
    expect(screen.getByText(/public launch-prep sources into a priority map/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Product Hunt launch assets/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GitHub social preview/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Open Source Guides/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Community launch prep/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /GitHub Docs social preview/i })).toHaveAttribute(
      "href",
      expect.stringContaining("docs.github.com"),
    );
    expect(screen.getByRole("link", { name: /Open Source Guides finding users/i })).toHaveAttribute(
      "href",
      "https://opensource.guide/finding-users/",
    );
    expect(screen.getByRole("link", { name: /Product Hunt launch guide/i })).toHaveAttribute(
      "href",
      "https://www.producthunt.com/launch/preparing-for-launch",
    );
    expect(screen.getByRole("link", { name: /Reddit Product Hunt launch community/i })).toHaveAttribute(
      "href",
      "https://www.reddit.com/r/ProductHuntLaunches/",
    );
    const primaryCta = screen
      .getAllByRole("link", { name: /request full launch package/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/contact?intent=launch-package");
    expect(document.title).toBe("GitHub Repo Launch Demand | QuickFork");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/resources/github-repo-launch-demand-map",
    );
    const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity[0].name).toContain("What is a GitHub repo launch demand map");
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/resources/github-repo-launch-demand-map",
          page_type: "resource",
          buyer_stage: "consideration",
          intent_cluster: "github_repo_launch_demand_map",
          utm_source: "product_hunt",
        }),
        expect.objectContaining({
          event: "resource_page_viewed",
          resource_slug: "github-repo-launch-demand-map",
          resource_type: "guide",
          buyer_stage: "consideration",
          page_type: "resource",
          intent_cluster: "github_repo_launch_demand_map",
          utm_source: "product_hunt",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(/email|token|secret|api_key/i);
  }, 10000);

  it("renders the open-source launch checklist as a source-backed resource route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/resources/open-source-launch-checklist?utm_source=x");

    render(<App />);

    expect(screen.getByRole("heading", { name: /Open Source Launch Checklist/i })).toBeInTheDocument();
    expect(
      screen.getByText(/source-backed README, social preview, Product Hunt, deck, and outreach/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Open-source maintainers and AI\/devtool builders/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/README trust pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Repository preview pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Audience and feedback pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Launch asset pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-launch learning pass/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open Source Guides finding users/i })).toHaveAttribute(
      "href",
      "https://opensource.guide/finding-users/",
    );
    expect(screen.getByRole("link", { name: /GitHub Docs About READMEs/i })).toHaveAttribute(
      "href",
      "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    );
    expect(screen.getByRole("link", { name: /GitHub Docs social preview/i })).toHaveAttribute(
      "href",
      expect.stringContaining("docs.github.com"),
    );
    expect(screen.getByRole("link", { name: /Product Hunt launch guide/i })).toHaveAttribute(
      "href",
      "https://www.producthunt.com/launch/preparing-for-launch",
    );
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /request checklist/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#studio");
    expect(document.title).toBe("Open Source Launch Checklist | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps open source launch checklist demand into source-backed README, social preview, Product Hunt, deck, outreach, and post-launch learning steps for public GitHub repository launches.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/resources/open-source-launch-checklist",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "resource_page_viewed",
          resource_slug: "open-source-launch-checklist",
          resource_type: "checklist",
          buyer_stage: "awareness",
          page_type: "resource",
          intent_cluster: "open_source_launch_checklist",
          utm_source: "x",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(/ranking|revenue|customers|guaranteed|token|secret|api_key/i);
  }, 10000);

  it("renders the repo launch readiness score as a source-backed free tool route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/tools/github-repo-launch-readiness-score?utm_source=product_hunt");

    render(<App />);

    expect(screen.getByRole("heading", { name: /GitHub Repo Launch Readiness Score/i })).toBeInTheDocument();
    expect(screen.getAllByText(/100-point source-backed scorecard/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/100 total points/i)).toBeInTheDocument();
    expect(screen.getAllByText(/README trust/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Repository preview/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Audience and feedback/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Launch assets/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Measurement and follow-up/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /GitHub Docs About READMEs/i })).toHaveAttribute(
      "href",
      "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    );
    expect(screen.getByRole("link", { name: /GitHub Docs social preview/i })).toHaveAttribute(
      "href",
      expect.stringContaining("docs.github.com"),
    );
    expect(screen.getByRole("link", { name: /Open Source Guides finding users/i })).toHaveAttribute(
      "href",
      "https://opensource.guide/finding-users/",
    );
    expect(screen.getByRole("link", { name: /Product Hunt launch guide/i })).toHaveAttribute(
      "href",
      "https://www.producthunt.com/launch/preparing-for-launch",
    );
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /start free tool/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#studio");
    expect(document.title).toBe("GitHub Repo Launch Readiness Score | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps github repo launch readiness score demand into a 100-point source-backed readiness score for README trust, repository preview, audience feedback, launch assets, and follow-up measurement.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/tools/github-repo-launch-readiness-score",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "tool_page_viewed",
          tool_slug: "github-repo-launch-readiness-score",
          tool_type: "scorecard",
          buyer_stage: "consideration",
          page_type: "tool",
          intent_cluster: "launch_readiness_score",
          utm_source: "product_hunt",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(
      /email|token|secret|api_key|ranking|revenue|customers|guaranteed|viral/i,
    );
  }, 10000);

  it("renders the GitHub repo visual explainer as a source-backed product route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/product/github-repo-visual-explainer?utm_source=google");

    render(<App />);

    expect(screen.getByRole("heading", { name: /GitHub Repo Visual Explainer/i })).toBeInTheDocument();
    expect(screen.getAllByText(/source-backed visual package/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Visual package outputs/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Project story map/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/README hero card/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GitHub social preview/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Deck-ready explainer slide/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /GitHub Docs About READMEs/i })).toHaveAttribute(
      "href",
      "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    );
    expect(screen.getByRole("link", { name: /GitHub Docs social preview/i })).toHaveAttribute(
      "href",
      expect.stringContaining("docs.github.com"),
    );
    expect(screen.getByRole("link", { name: /Open Source Guides finding users/i })).toHaveAttribute(
      "href",
      "https://opensource.guide/finding-users/",
    );
    expect(screen.getByRole("link", { name: /Product Hunt launch guide/i })).toHaveAttribute(
      "href",
      "https://www.producthunt.com/launch/preparing-for-launch",
    );
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /generate free repo brief/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#hero");
    expect(document.title).toBe("GitHub Repo Visual Explainer | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps github repo visual explainer demand into source-backed story maps, README hero cards, GitHub social previews, and deck-ready visual launch assets for technical repositories.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/product/github-repo-visual-explainer",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_type: "product",
          buyer_stage: "consideration",
          intent_cluster: "github_repo_visual_explainer",
          utm_source: "google",
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(
      /email|token|secret|api_key|ranking|revenue|customers|guaranteed|viral|fully autonomous/i,
    );
  }, 10000);

  it("renders the repository launch package pilot page as a paid-intent hypothesis", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/product/repository-launch-package-pilot?utm_source=linkedin");

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /Repository Launch Package Pilot for source-backed paid-intent learning/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/full launch package pilot/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/README, social, deck, outreach, visual explainer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Founders, open-source maintainers, DevRel operators/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Request the package after proof of need/i)).toBeInTheDocument();
    expect(screen.getByText(/Do not publish prices yet/i)).toBeInTheDocument();
    expect(screen.getByText(/What does the repository launch package pilot include/i)).toBeInTheDocument();
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /request full launch package/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/contact?intent=launch-package");
    expect(document.title).toBe("Repository Launch Package Pilot | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps repository launch package pilot demand into a full launch package pilot for README, social, deck, outreach, visual explainer, review, and measurement work.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/product/repository-launch-package-pilot",
    );
    const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity[0].name).toContain("What does the repository launch package pilot include");
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/product/repository-launch-package-pilot",
          page_type: "product",
          buyer_stage: "decision",
          intent_cluster: "repository_launch_package_pilot",
          utm_source: "linkedin",
        }),
      ]),
    );
    expect(document.body.textContent).not.toMatch(
      /\b(guaranteed|rankings|revenue|customers|Product Hunt #1|\$[0-9]|viral|fully autonomous)\b/i,
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(/email|token|secret|api_key/i);
  }, 10000);

  it("renders the GitHub repo product outreach page as a source-backed product route", () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/product/github-repo-to-product-outreach?utm_source=google");

    render(<App />);

    expect(screen.getByRole("heading", { name: /GitHub Repo Product Outreach/i })).toBeInTheDocument();
    expect(screen.getAllByText(/source-backed outreach package/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Launch email draft/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Community feedback post/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Partner or newsletter note/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Human review checklist/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Open Source Guides finding users/i })).toHaveAttribute(
      "href",
      "https://opensource.guide/finding-users/",
    );
    expect(screen.getByRole("link", { name: /FTC CAN-SPAM compliance guide/i })).toHaveAttribute(
      "href",
      "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
    );
    expect(screen.getByRole("link", { name: /Hacker News guidelines/i })).toHaveAttribute(
      "href",
      "https://news.ycombinator.com/newsguidelines.html",
    );
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    const primaryCta = screen
      .getAllByRole("link", { name: /generate free repo brief/i })
      .find((link) => link.classList.contains("primaryButton"));
    expect(primaryCta).toHaveAttribute("href", "/#hero");
    expect(document.title).toBe("GitHub Repo Product Outreach | QuickFork");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "QuickFork maps github repo product outreach demand into a source-backed outreach brief, launch email sequence, community post angle, partner note, and human review checklist from repository evidence.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://seekersai.com/product/github-repo-to-product-outreach",
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "page_view",
          page_path: "/product/github-repo-to-product-outreach",
          page_type: "product",
          buyer_stage: "consideration",
          intent_cluster: "github_repo_product_outreach",
          utm_source: "google",
        }),
      ]),
    );
    expect(document.body.textContent).not.toMatch(
      /\b(scraped leads|automatic sending|guaranteed|reply rate|deliverability|revenue|customers|rankings|viral)\b/i,
    );
    expect(JSON.stringify(window.dataLayer)).not.toMatch(/email|token|secret|api_key/i);
  }, 10000);

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

  it("submits full launch package contact requests as sales contact", async () => {
    window.dataLayer = [];
    window.history.replaceState({}, "", "/contact?intent=launch-package&utm_source=product");
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            leadId: "lead_2",
            lifecycleStage: "sales_qualified_lead",
            activityId: "activity_2",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 201,
          },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    expect(screen.getByRole("heading", { name: /full launch package/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: "founder@example.dev" } });
    fireEvent.change(screen.getByLabelText(/company domain/i), { target: { value: "example.dev" } });
    fireEvent.change(screen.getByLabelText(/github repository url/i), {
      target: { value: "https://github.com/moose-lab/QuickFork" },
    });
    fireEvent.change(screen.getByLabelText(/launch timeline/i), { target: { value: "within_30_days" } });
    fireEvent.change(screen.getByLabelText(/package model/i), { target: { value: "single_launch" } });
    fireEvent.change(screen.getByLabelText(/buying trigger/i), { target: { value: "launch_deadline" } });
    fireEvent.click(screen.getByLabelText(/^README$/i));
    fireEvent.click(screen.getByLabelText(/^Social$/i));
    fireEvent.click(screen.getByLabelText(/^Deck$/i));
    fireEvent.click(screen.getByLabelText(/^Outreach$/i));
    fireEvent.click(screen.getByLabelText(/^Visual explainer$/i));
    fireEvent.click(screen.getByLabelText(/human review needed/i));
    fireEvent.change(screen.getByLabelText(/launch notes/i), {
      target: { value: "Launching an AI repo and need source-backed README, deck, and outreach review." },
    });
    fireEvent.click(screen.getByRole("button", { name: /request full launch package/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const payload = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(payload).toMatchObject({
      intent: "sales_contact",
      email: "founder@example.dev",
      companyDomain: "example.dev",
      requestType: "full_launch_package",
      contactReason: "full_launch_package",
      crmCampaign: "2026_q2_full_launch_package",
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
      firstTouch: expect.objectContaining({
        source: "product",
        landingPage: "http://localhost:3000/contact",
      }),
    });
    expect(await screen.findByText(/we will follow up with the next step/i)).toBeInTheDocument();
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "sales_contact_requested",
          contact_reason: "full_launch_package",
          company_domain: "example.dev",
          role_segment: "founder",
          utm_source: "product",
          launch_timeline: "within_30_days",
          package_model: "single_launch",
          buying_trigger: "launch_deadline",
          package_scope_count: 5,
          human_review_needed: true,
        }),
      ]),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("founder@example.dev");
    expect(JSON.stringify(window.dataLayer)).not.toContain("https://github.com/moose-lab/QuickFork");
    expect(JSON.stringify(window.dataLayer)).not.toContain("Launching an AI repo");
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
            audienceDiscovery: {
              title: "QwenLM/FlashQLA target user discovery map",
              summary: "Source-backed target user discovery for CUDA attention launch planning.",
              signals: [
                {
                  id: "technical_builders",
                  segment: "AI project builders",
                  jobToBeDone: "Understand whether FlashQLA can reduce inference bottlenecks.",
                  trigger: "Preparing a benchmark, launch post, or README update for an AI infrastructure repo.",
                  whereToFind: "GitHub topics, README discussions, CUDA and inference communities.",
                  validationQuestion: "Which repository evidence would make you trust this kernel enough to try it?",
                  source: "README or repo metadata includes: Optimizes attention kernels for lower latency inference.",
                  priority: "high",
                },
                {
                  id: "launch_reviewers",
                  segment: "Technical founders",
                  jobToBeDone: "Package the repository story for a public launch.",
                  trigger: "Product Hunt, demo day, or community feedback deadline.",
                  whereToFind: "Product Hunt launch prep, founder communities, and DevRel newsletters.",
                  validationQuestion: "Which launch channel needs the clearest source-backed proof first?",
                  source: "Audience hypothesis from repo metadata and topics.",
                  priority: "medium",
                },
              ],
            },
            storyMap: {
              title: "QwenLM/FlashQLA launch story map",
              summary: "Source-backed visual interpretation for CUDA attention kernels.",
              nodes: [
                {
                  id: "source",
                  label: "Source",
                  title: "Repository evidence",
                  detail: "README describes optimized attention kernels.",
                  source: "README or repo metadata includes: Optimizes attention kernels for lower latency inference.",
                },
                {
                  id: "audience",
                  label: "Audience",
                  title: "AI project builders",
                  detail: "Builders evaluating inference performance work.",
                  source: "Audience hypothesis from repo metadata and topics.",
                },
                {
                  id: "workflow",
                  label: "Workflow",
                  title: "Install to benchmark",
                  detail: "Install kernels -> Run benchmark -> Ship inference",
                  source: "Workflow steps from launch brief.",
                },
              ],
            },
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
                type: "audience",
                label: "Target user discovery map",
                fileName: "qwenlm-flashqla-target-user-discovery.md",
                body: "## Target user discovery map\n\nSource-backed target user discovery.",
                sourceReferences: ["README or repo metadata includes: Optimizes attention kernels."],
              },
              {
                type: "story_map",
                label: "Project story map",
                fileName: "qwenlm-flashqla-project-story-map.md",
                body: "## Project story map\n\nSource-backed visual interpretation.",
                sourceReferences: ["README or repo metadata includes: Optimizes attention kernels."],
              },
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
    const audienceRegion = within(briefRegion).getByRole("region", { name: /target user discovery/i });
    expect(within(audienceRegion).getByText(/^Target user discovery$/i)).toBeInTheDocument();
    expect(within(audienceRegion).getByText(/Source-backed target user discovery/i)).toBeInTheDocument();
    expect(within(audienceRegion).getByText(/AI project builders/i)).toBeInTheDocument();
    expect(within(audienceRegion).getByText(/which repository evidence would make you trust/i)).toBeInTheDocument();
    const storyMapRegion = within(briefRegion).getByRole("region", { name: /project story map/i });
    expect(within(storyMapRegion).getByText(/Project story map/i)).toBeInTheDocument();
    expect(within(storyMapRegion).getByText(/Source-backed visual interpretation/i)).toBeInTheDocument();
    expect(within(storyMapRegion).getByText(/Install to benchmark/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Lead with a one-sentence README value proposition/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Launch angle 1/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Create a ai_kernel_infra visual explainer/i)).toBeInTheDocument();
    expect(within(briefRegion).getByText(/Export artifacts/i)).toBeInTheDocument();
    expect(within(briefRegion).getByRole("button", { name: /copy README launch brief/i })).toBeInTheDocument();
    expect(within(briefRegion).getByRole("link", { name: /download README launch brief/i })).toHaveAttribute(
      "download",
      "qwenlm-flashqla-readme-launch-brief.md",
    );
    const packageLink = within(briefRegion).getByRole("link", { name: /request full launch package/i });
    expect(packageLink).toHaveAttribute("href", expect.stringContaining("/contact?intent=launch-package"));
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
          brief_sections: 8,
        }),
      ]),
    );

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn(async () => undefined) },
    });
    fireEvent.click(within(briefRegion).getByRole("button", { name: /copy launch brief/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Free repo launch brief"));
    fireEvent.click(within(briefRegion).getByRole("button", { name: /copy target user map/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Target user discovery"));
    fireEvent.click(within(briefRegion).getByRole("button", { name: /copy story map/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Project story map"));
    fireEvent.click(within(briefRegion).getByRole("button", { name: /copy README launch brief/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("README checklist"));
    fireEvent.click(within(briefRegion).getByRole("link", { name: /download README launch brief/i }));
    fireEvent.click(packageLink);
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
            event: "launch_audience_map_copied",
            repo_full_name: "QwenLM/FlashQLA",
            generation_id: "gen_qwenlm_flashqla_test",
            segment_count: 2,
            channel_count: 2,
            validation_question_count: 2,
          }),
          expect.objectContaining({
            event: "launch_story_map_copied",
            repo_full_name: "QwenLM/FlashQLA",
            generation_id: "gen_qwenlm_flashqla_test",
            node_count: 3,
            source_reference_count: 1,
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
          expect.objectContaining({
            event: "cta_clicked",
            repo_full_name: "QwenLM/FlashQLA",
            generation_id: "gen_qwenlm_flashqla_test",
            cta_id: "request_full_launch_package",
            cta_location: "launch_brief_panel",
            lifecycle_stage: "monetization",
            artifact_count: 4,
          }),
        ]),
      ),
    );
    expect(JSON.stringify(window.dataLayer)).not.toContain("README checklist");
    expect(JSON.stringify(window.dataLayer)).not.toContain("Which repository evidence");

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
