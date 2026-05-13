import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const appStyles = readFileSync("src/styles/app.css", "utf8");

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
    expect(screen.getByRole("textbox", { name: /github repository url/i })).toHaveValue("https://github.com/QwenLM/FlashQLA");
    const heroVideo = document.querySelector('video[aria-label="Product animation playback"]');
    expect(heroVideo).toBeInTheDocument();
    expect(heroVideo).toHaveAttribute("src", "/media/quickfork-hero-16x9-black.mp4");
    expect(screen.getByLabelText(/QuickFork product preview/i)).toBeInTheDocument();
    expect(screen.queryByText(/Live product playback/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Fork the anatomy of a high-converting page/i)).toBeInTheDocument();
    expect(screen.getByText(/From reference URL to launchable SaaS page/i)).toBeInTheDocument();
  }, 10000);

  it("keeps the generator studio inside the redesigned frontend", () => {
    render(<App />);

    expect(screen.getByText(/Product studio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub URL/i)).toBeInTheDocument();
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
              qualityReportPath: "output/project-launch/qwenlm-flashqla/en/quality-report.json",
            },
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
    fireEvent.click(within(form).getByRole("button", { name: /generate launch package/i }));

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
      locales: ["en", "zh", "ja"],
      preset: "github-readme",
      provider: "mock",
      imageQuality: "high",
    });
    expect(await screen.findByText(/generated gen_qwenlm_flashqla_test/i)).toBeInTheDocument();
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
