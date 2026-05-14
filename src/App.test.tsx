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
    vi.unstubAllGlobals();
  });

  it("renders the landing architecture from the reference page", () => {
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
    expect(screen.queryByRole("link", { name: /start a fork/i })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /turn a github repository into a launch-ready story/i,
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
        /Generate cold-start launch materials for README pages, social media, PPT decks, and product outreach from one repository URL\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Generate traceable launch assets from repository evidence/i }),
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

  it("submits the Hero generator form to the backend generation API", async () => {
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

  it("uses native FAQ disclosure items", () => {
    render(<App />);

    const defaultQuestion = screen.getByText(/Does QuickFork copy the reference page/i).closest("details");

    expect(defaultQuestion).toBeInTheDocument();
    expect(defaultQuestion).toHaveAttribute("open");
    expect(screen.getByText(/Can the page use real product data later/i)).toBeInTheDocument();
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
