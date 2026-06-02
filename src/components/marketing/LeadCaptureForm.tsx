import { Mail, Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { trackEvent } from "../../lib/analytics";
import type { MarketingLink } from "../../marketing/link-catalog";
import { getMarketingPrimaryCtaLabel } from "../../marketing/page-content";

interface LeadCaptureFormProps {
  link: MarketingLink;
}

export function LeadCaptureForm({ link }: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isContact = link.pageType === "contact";
  const buttonLabel = isContact ? getMarketingPrimaryCtaLabel(link) : "Request resource";

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setError("");
    setIsSubmitting(true);

    const payload = buildLeadCapturePayload(link, { email, name, companyDomain });
    trackLeadCaptureRequested(link, payload);

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead capture failed.");
      }

      trackLeadCaptureDelivered(link, payload);
      setStatus(isContact ? "Thanks. We will follow up with the next step." : "Check your inbox for the resource.");
      setEmail("");
      setName("");
      setCompanyDomain("");
    } catch {
      setError("We could not capture the request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="leadCaptureForm" aria-label={isContact ? "Contact request" : "Resource request"} onSubmit={submitLead}>
      <div className="leadCaptureIntro">
        <span className="monoLabel">{isContact ? "Contact" : "Resource capture"}</span>
        <h3>{isContact ? "Route this request to the CRM." : "Get this resource and keep the source attached."}</h3>
        <p>
          {isContact
            ? "The request is sent server-side so contact details stay out of browser analytics."
            : "QuickFork records the campaign source with the lead, while analytics receives only non-PII event data."}
        </p>
      </div>
      <div className="leadCaptureFields">
        <label>
          Work email
          <input
            autoComplete="email"
            inputMode="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Company domain
          <input
            autoComplete="organization"
            value={companyDomain}
            onChange={(event) => setCompanyDomain(event.target.value)}
          />
        </label>
      </div>
      <button className="primaryButton" type="submit" disabled={isSubmitting}>
        {isContact ? <Send size={17} aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}
        {isSubmitting ? "Sending" : buttonLabel}
      </button>
      <p className="leadCaptureStatus" aria-live="polite">
        {status || error ? <span className={error ? "errorText" : "successText"}>{error || status}</span> : null}
      </p>
    </form>
  );
}

interface LeadCaptureFormState {
  email: string;
  name: string;
  companyDomain: string;
}

function buildLeadCapturePayload(link: MarketingLink, form: LeadCaptureFormState) {
  const touch = buildAttributionTouch();
  const isDemo = link.pageType === "contact" && link.slug === "demo";
  const isPartnership = link.pageType === "contact" && link.slug === "partnership";
  const isLaunchPackage = link.pageType === "contact" && link.slug === "launch-package";

  return {
    intent: link.pageType === "resource" ? "resource" : isDemo ? "demo" : isPartnership ? "partnership" : "sales_contact",
    email: form.email.trim(),
    name: form.name.trim() || undefined,
    companyDomain: form.companyDomain.trim() || undefined,
    roleSegment: link.persona,
    resourceSlug: link.pageType === "resource" ? link.slug : undefined,
    captureLocation: "marketing_page",
    requestType: isDemo ? "founder_demo" : isPartnership ? "devrel_partnership" : isLaunchPackage ? "full_launch_package" : undefined,
    contactReason: isDemo ? "quickfork_demo" : isPartnership ? "devrel_partnership" : isLaunchPackage ? "full_launch_package" : undefined,
    crmCampaign: link.crmCampaign,
    firstTouch: touch,
    lastTouch: touch,
  };
}

function trackLeadCaptureRequested(link: MarketingLink, payload: ReturnType<typeof buildLeadCapturePayload>) {
  if (link.pageType === "resource") {
    trackEvent("lead_magnet_requested", {
      resource_slug: link.slug,
      resource_type: getResourceType(link),
      buyer_stage: link.buyerStage,
      capture_location: "marketing_page",
      page_type: link.pageType,
      intent_cluster: link.intentCluster,
    });
    return;
  }

  if (payload.intent === "demo") {
    trackEvent("demo_requested", {
      request_type: payload.requestType,
      company_domain: payload.companyDomain,
      role_segment: link.persona,
    });
    return;
  }

  trackEvent("sales_contact_requested", {
    contact_reason: payload.contactReason,
    company_domain: payload.companyDomain,
    role_segment: link.persona,
  });
}

function trackLeadCaptureDelivered(link: MarketingLink, payload: ReturnType<typeof buildLeadCapturePayload>) {
  if (link.pageType === "resource") {
    trackEvent("lead_magnet_delivered", {
      resource_slug: link.slug,
      delivery_channel: "email",
      page_type: link.pageType,
      intent_cluster: link.intentCluster,
    });
  }

  if (payload.intent === "partnership" || payload.intent === "sales_contact") {
    trackEvent("sales_contact_requested", {
      contact_reason: payload.contactReason,
      company_domain: payload.companyDomain,
      role_segment: link.persona,
    });
  }
}

function buildAttributionTouch() {
  const params = new URLSearchParams(window.location.search);

  return {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    landingPage: `${window.location.origin}${window.location.pathname}`,
    referrer: sanitizeReferrer(document.referrer),
    capturedAt: new Date().toISOString(),
  };
}

function sanitizeReferrer(referrer: string) {
  if (!referrer) return undefined;

  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

function getResourceType(link: MarketingLink) {
  if (link.slug.includes("checklist")) return "checklist";
  if (link.slug.includes("template") || link.slug.includes("prompt")) return "template";
  return "guide";
}
