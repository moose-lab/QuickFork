import { waitUntil } from "@vercel/functions";

type OtpEmailType = "sign-in" | "email-verification" | "forget-password" | "change-email";

type OtpEmailPayload = {
  email: string;
  otp: string;
  type: OtpEmailType;
};

const emailSubjects: Record<OtpEmailType, string> = {
  "sign-in": "Your QuickFork sign-in code",
  "email-verification": "Verify your QuickFork email",
  "forget-password": "Reset your QuickFork password",
  "change-email": "Confirm your QuickFork email change",
};

function getEmailBody({ otp, type }: OtpEmailPayload) {
  const action = type === "sign-in" ? "sign in to QuickFork" : "continue with QuickFork";

  return [
    `<p>Use this one-time code to ${action}:</p>`,
    `<p style="font-size:24px;font-weight:700;letter-spacing:0.16em">${otp}</p>`,
    "<p>The code expires shortly. If you did not request it, you can ignore this email.</p>",
  ].join("");
}

async function deliverOtpEmail(payload: OtpEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM ?? "QuickFork <auth@quickfork.ai>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is required to send QuickFork OTP emails in production.");
    }

    console.info(`[QuickFork auth] ${payload.type} OTP for ${payload.email}: ${payload.otp}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.email,
      subject: emailSubjects[payload.type],
      html: getEmailBody(payload),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to send QuickFork OTP email: ${message}`);
  }
}

export async function sendOtpEmail(payload: OtpEmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    await deliverOtpEmail(payload);
    return;
  }

  const delivery = deliverOtpEmail(payload);

  try {
    waitUntil(delivery);
  } catch {
    await delivery;
  }
}
