import { FormEvent, useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { authClient } from "../../lib/auth-client";
import { trackEvent } from "../../lib/analytics";
import { LandingNav } from "../landing/LandingNav";

type AuthMode = "sign-in" | "sign-up";

type AuthPageProps = {
  mode: AuthMode;
};

function goHome() {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignUp = mode === "sign-up";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);
    trackEvent(isSignUp ? "signup_started" : "signin_started", {
      method: "email_otp",
    });

    try {
      const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (otpError) {
        throw new Error(otpError.message || "Could not send the verification code.");
      }

      setOtpSent(true);
      setStatus("Check your email for a one-time code.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send the verification code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const { error: signInError } = await authClient.signIn.emailOtp({
        email,
        otp,
        name: isSignUp ? name : undefined,
      });

      if (signInError) {
        throw new Error(signInError.message || "The code could not be verified.");
      }

      trackEvent(isSignUp ? "signup_completed" : "signin_completed", {
        method: "email_otp",
      });
      goHome();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The code could not be verified.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function continueWithGoogle() {
    setError("");
    setIsSubmitting(true);
    trackEvent(isSignUp ? "signup_started" : "signin_started", {
      method: "google",
    });

    try {
      const { error: googleError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (googleError) {
        throw new Error(googleError.message || "Google sign-in could not start.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Google sign-in could not start.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="siteShell">
      <LandingNav />
      <main className="authShell">
        <section className="authPanel" aria-labelledby="auth-title">
          <div className="authCopy">
            <span className="eyebrow">Account access</span>
            <h1 id="auth-title">
              {isSignUp ? "Create your QuickFork account" : "Sign in to QuickFork"}
            </h1>
            <p>
              Save generated launch packages, return to previous forks, and keep your reference
              pages connected to one verified identity.
            </p>
          </div>

          <div className="authCard">
            <button
              className="googleButton"
              type="button"
              onClick={continueWithGoogle}
              disabled={isSubmitting}
            >
              <ArrowRight size={18} aria-hidden="true" />
              Continue with Google
            </button>

            <div className="authDivider">or use email code</div>

            {!otpSent ? (
              <form className="authForm" onSubmit={sendCode}>
                {isSignUp ? (
                  <label>
                    Display name
                    <input
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </label>
                ) : null}
                <label>
                  Email
                  <input
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <button className="primaryButton" type="submit" disabled={isSubmitting}>
                  <Mail size={17} aria-hidden="true" />
                  {isSignUp ? "Send sign-up code" : "Send sign-in code"}
                </button>
              </form>
            ) : (
              <form className="authForm" onSubmit={verifyCode}>
                <label>
                  One-time code
                  <input
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    required
                  />
                </label>
                <button className="primaryButton" type="submit" disabled={isSubmitting}>
                  <ShieldCheck size={17} aria-hidden="true" />
                  Verify code
                </button>
                <button className="textButton" type="button" onClick={() => setOtpSent(false)}>
                  Use a different email
                </button>
              </form>
            )}

            <p className="authSwitch">
              {isSignUp ? "Already have an account?" : "New to QuickFork?"}{" "}
              <a href={isSignUp ? "/sign-in" : "/sign-up"}>
                {isSignUp ? "Sign in" : "Sign up"}
              </a>
            </p>

            <div className="authStatus" aria-live="polite">
              {status || error ? (
                <p className={error ? "errorText" : "successText"}>{error || status}</p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
