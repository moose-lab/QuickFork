import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the workflow and model settings", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /quickfork/i })).toBeInTheDocument();
    expect(screen.getAllByText(/GitHub repo to launch copy/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Model settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Narrative options/i)).toBeInTheDocument();
    expect(screen.getAllByText(/README/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PPT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Social/i).length).toBeGreaterThan(0);
  });
});
