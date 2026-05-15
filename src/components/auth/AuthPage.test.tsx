import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthPage } from "./AuthPage";

const authMocks = vi.hoisted(() => ({
  sendVerificationOtp: vi.fn(),
  signInEmailOtp: vi.fn(),
  signInSocial: vi.fn(),
  useSession: vi.fn(() => ({ data: null, isPending: false })),
}));

vi.mock("../../lib/auth-client", () => ({
  authClient: {
    emailOtp: {
      sendVerificationOtp: authMocks.sendVerificationOtp,
    },
    signIn: {
      emailOtp: authMocks.signInEmailOtp,
      social: authMocks.signInSocial,
    },
    useSession: authMocks.useSession,
  },
  useSession: authMocks.useSession,
}));

describe("AuthPage analytics", () => {
  afterEach(() => {
    delete window.dataLayer;
    vi.clearAllMocks();
  });

  it("tracks sign-up start and completion for email OTP", async () => {
    window.dataLayer = [];
    authMocks.sendVerificationOtp.mockResolvedValue({ error: null });
    authMocks.signInEmailOtp.mockResolvedValue({ error: null });

    render(<AuthPage mode="sign-up" />);

    fireEvent.change(screen.getByLabelText(/display name/i), { target: { value: "Moose" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "moose@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send sign-up code/i }));

    await waitFor(() => expect(authMocks.sendVerificationOtp).toHaveBeenCalledTimes(1));
    fireEvent.change(await screen.findByLabelText(/one-time code/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /verify code/i }));

    await waitFor(() => expect(authMocks.signInEmailOtp).toHaveBeenCalledTimes(1));
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        {
          event: "signup_started",
          method: "email_otp",
        },
        {
          event: "signup_completed",
          method: "email_otp",
        },
      ]),
    );
  });

  it("tracks Google sign-in start without collecting account data", async () => {
    window.dataLayer = [];
    authMocks.signInSocial.mockResolvedValue({ error: null });

    render(<AuthPage mode="sign-in" />);

    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));

    await waitFor(() => expect(authMocks.signInSocial).toHaveBeenCalledTimes(1));
    expect(window.dataLayer).toContainEqual({
      event: "signin_started",
      method: "google",
    });
  });
});
