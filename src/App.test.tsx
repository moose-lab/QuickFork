import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

const appStyles = readFileSync("src/styles/app.css", "utf8");

describe("App", () => {
  it("renders the landing architecture from the reference page", () => {
    render(<App />);

    expect(screen.getByRole("banner")).toHaveClass("nav");
    expect(appStyles).toMatch(/\.nav\s*{[^}]*position:\s*sticky;/s);
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quickfork home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /how to/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /proof/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /faq/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /turn a reference page into a launch-ready story/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/reference page url/i)).toHaveValue("https://www.design.com/s/logo-maker");
    expect(screen.getByText(/Fork the anatomy of a high-converting page/i)).toBeInTheDocument();
    expect(screen.getByText(/From reference URL to launchable SaaS page/i)).toBeInTheDocument();
  });

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

  it("uses native FAQ disclosure items", () => {
    render(<App />);

    const defaultQuestion = screen.getByText(/Does QuickFork copy the reference page/i).closest("details");

    expect(defaultQuestion).toBeInTheDocument();
    expect(defaultQuestion).toHaveAttribute("open");
    expect(screen.getByText(/Can the page use real product data later/i)).toBeInTheDocument();
  });
});
