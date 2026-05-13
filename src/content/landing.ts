type ReferenceTab = {
  label: string;
  active?: boolean;
};

type ReferenceOutputChip = {
  label: string;
  active?: boolean;
  defaultActive?: boolean;
};

type FeatureCard = {
  code: string;
  title: string;
  body: string;
  description: string;
  artifact: {
    label: string;
    value: string;
  };
  artifactLabel: string;
  artifactValue: string;
};

type Showcase = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  copy: string;
  metaLabel: string;
  imageFirst: boolean;
  image: {
    src: string;
    alt: string;
    caption: string;
  };
  meta: Array<{
    label: string;
    value: string;
  }>;
};

type WorkflowStep = {
  number: string;
  title: string;
  body: string;
  copy: string;
};

type StudioPill = {
  label: string;
  value: string;
};

type ProofQuote = {
  quote: string;
  body: string;
  copy: string;
  cite: string;
};

type ProofAudience = {
  label: string;
  value: string;
};

type FaqItem = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export const referenceTabs = [
  { label: "Reference URL", active: true },
  { label: "Screenshot" },
  { label: "Blank brief" },
] satisfies Array<ReferenceTab>;

export const referenceOutputChips = [
  { label: "HTML", active: true, defaultActive: true },
  { label: "Copy", active: true, defaultActive: true },
  { label: "Prompt", active: true, defaultActive: true },
  { label: "Figma", defaultActive: false },
  { label: "Social", defaultActive: false },
] satisfies Array<ReferenceOutputChip>;

export const featureCards = [
  {
    code: "F-01 / Reference parser",
    title: "Convert proven page flow into reusable structure.",
    body: "QuickFork reads section order, message intent, CTA placement, and trust patterns from a reference page without copying its brand.",
    description:
      "QuickFork reads section order, message intent, CTA placement, and trust patterns from a reference page without copying its brand.",
    artifact: { label: "Input", value: "URL" },
    artifactLabel: "Input",
    artifactValue: "URL",
  },
  {
    code: "F-02 / SaaS translation",
    title: "Rewrite consumer patterns for mature B2B products.",
    body: "A logo-maker flow becomes a SaaS onboarding story: features, how-to, proof, objections, and conversion prompts.",
    description:
      "A logo-maker flow becomes a SaaS onboarding story: features, how-to, proof, objections, and conversion prompts.",
    artifact: { label: "Mapping", value: "8 blocks" },
    artifactLabel: "Mapping",
    artifactValue: "8 blocks",
  },
  {
    code: "F-03 / Editable grid",
    title: "Design with section logic before decoration.",
    body: "Swiss-grid controls expose density, proof weight, imagery slots, and CTA cadence so designers can tune the page intentionally.",
    description:
      "Swiss-grid controls expose density, proof weight, imagery slots, and CTA cadence so designers can tune the page intentionally.",
    artifact: { label: "Grid", value: "12 col" },
    artifactLabel: "Grid",
    artifactValue: "12 col",
  },
  {
    code: "F-04 / Asset planner",
    title: "Place images where they add conviction.",
    body: "QuickFork marks where a studio image, product crop, customer quote, or proof panel will improve trust instead of adding noise.",
    description:
      "QuickFork marks where a studio image, product crop, customer quote, or proof panel will improve trust instead of adding noise.",
    artifact: { label: "Image slots", value: "3" },
    artifactLabel: "Image slots",
    artifactValue: "3",
  },
  {
    code: "F-05 / Copy passes",
    title: "Generate page copy that respects the product.",
    body: "No invented traction numbers. The system separates real proof, inferred benefits, and honest placeholders before export.",
    description:
      "No invented traction numbers. The system separates real proof, inferred benefits, and honest placeholders before export.",
    artifact: { label: "Copy", value: "Specific" },
    artifactLabel: "Copy",
    artifactValue: "Specific",
  },
  {
    code: "F-06 / HTML handoff",
    title: "Export a complete landing draft, not a moodboard.",
    body: "Designers can hand off a responsive HTML prototype with section rhythm, content hierarchy, and image strategy intact.",
    description:
      "Designers can hand off a responsive HTML prototype with section rhythm, content hierarchy, and image strategy intact.",
    artifact: { label: "Output", value: "HTML" },
    artifactLabel: "Output",
    artifactValue: "HTML",
  },
] satisfies Array<FeatureCard>;

export const showcases = [
  {
    id: "visual-posture-title",
    label: "Visual posture",
    eyebrow: "Visual posture",
    title:
      "The page should feel designed by a senior product team, not assembled from blocks.",
    body: "Design.com's reference page is useful because it explains the path, the payoff, and the objections in a predictable order. QuickFork keeps that clarity, then raises the tone for SaaS buyers and UI/UX professionals.",
    copy: "Design.com's reference page is useful because it explains the path, the payoff, and the objections in a predictable order. QuickFork keeps that clarity, then raises the tone for SaaS buyers and UI/UX professionals.",
    metaLabel: "Image strategy",
    imageFirst: true,
    image: {
      src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=82",
      alt: "Editorial workspace with desks and large windows",
      caption:
        "Image slot A - editorial workspace photography - used as trust atmosphere between product sections",
    },
    meta: [
      {
        label: "Section role",
        value: "Reset attention after dense feature matrix",
      },
      { label: "Asset type", value: "Real editorial photography" },
      {
        label: "Composition",
        value: "Full-bleed crop with visible work context",
      },
      { label: "Constraint", value: "Hero and sections share one system" },
    ],
  },
  {
    id: "critique-title",
    label: "Image slot B",
    eyebrow: "Image slot B",
    title: "A landing page for designers should include evidence of process.",
    body: "Instead of decorative illustrations, use photography that signals working sessions, review surfaces, and product judgment. These assets make the page feel operational and mature.",
    copy: "Instead of decorative illustrations, use photography that signals working sessions, review surfaces, and product judgment. These assets make the page feel operational and mature.",
    metaLabel: "Second image strategy",
    imageFirst: false,
    image: {
      src: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=1800&q=82",
      alt: "Designer workspace with interface sketches and laptop",
      caption:
        "Image slot B - product design process photography - placed before objections and FAQ",
    },
    meta: [
      { label: "Placement", value: "Before FAQ to slow the reader down" },
      { label: "Purpose", value: "Humanize the tool before objections" },
      { label: "Style", value: "Muted editorial, not startup stock" },
      { label: "Fallback", value: "Use product canvas crop if no photo exists" },
    ],
  },
] satisfies Array<Showcase>;

export const workflowSteps = [
  {
    number: "01",
    title: "Paste a reference landing page.",
    body: "Use a page like Design.com's logo maker as an inspiration source for section order, proof density, and conversion rhythm.",
    copy: "Use a page like Design.com's logo maker as an inspiration source for section order, proof density, and conversion rhythm.",
  },
  {
    number: "02",
    title: "Describe the SaaS product.",
    body: "Add audience, product category, constraints, and sections to avoid. QuickFork keeps the output grounded in the product brief.",
    copy: "Add audience, product category, constraints, and sections to avoid. QuickFork keeps the output grounded in the product brief.",
  },
  {
    number: "03",
    title: "Review the section system.",
    body: "Features, how-to, proof, FAQ, and image slots are presented as editable design decisions, not generic templates.",
    copy: "Features, how-to, proof, FAQ, and image slots are presented as editable design decisions, not generic templates.",
  },
  {
    number: "04",
    title: "Export the landing prototype.",
    body: "Ship a complete HTML page, share it with stakeholders, or hand it to engineering as a high-fidelity front-end brief.",
    copy: "Ship a complete HTML page, share it with stakeholders, or hand it to engineering as a high-fidelity front-end brief.",
  },
] satisfies Array<WorkflowStep>;

export const studioPills = [
  { label: "Reference URL", value: "design.com/s/logo-maker" },
  { label: "Product", value: "QuickFork SaaS" },
  { label: "Sections", value: "Features - How to - Proof - FAQ" },
  { label: "Style", value: "Swiss grid - serif - editorial imagery" },
] satisfies Array<StudioPill>;

export const canvasModules = [
  "Feature matrix",
  "Workflow section",
  "FAQ proof",
] satisfies Array<string>;

export const proofQuotes = [
  {
    quote:
      "It gives the team a credible landing-page spine before anyone starts decorating pixels.",
    body: "Best for product designers who need to turn a reference into a critique-ready SaaS page direction.",
    copy: "Best for product designers who need to turn a reference into a critique-ready SaaS page direction.",
    cite: "Design lead - early SaaS studio",
  },
  {
    quote:
      "The useful part is the translation layer: consumer page flow becomes B2B product storytelling.",
    body: "QuickFork helps teams avoid direct copying while still learning from pages that explain a workflow well.",
    copy: "QuickFork helps teams avoid direct copying while still learning from pages that explain a workflow well.",
    cite: "Founder - productized design service",
  },
] satisfies Array<ProofQuote>;

export const proofAudience = [
  { label: "Primary buyer", value: "UI/UX landing-page designers" },
  { label: "Secondary buyer", value: "SaaS founders and PMs" },
  {
    label: "Core job",
    value: "Turn reference pages into original product pages",
  },
  {
    label: "Proof policy",
    value: "Use real claims only; mark placeholders clearly",
  },
] satisfies Array<ProofAudience>;

export const faqItems = [
  {
    question: "Does QuickFork copy the reference page?",
    answer:
      "No. The reference is used for structure, section intent, and conversion rhythm. QuickFork rewrites the copy, palette, layout posture, and SaaS-specific content so the result is original.",
    defaultOpen: true,
  },
  {
    question: "What do I need before starting?",
    answer:
      "A reference URL, the SaaS product name, audience, preferred tone, and any sections that must be included or avoided. The product works best when constraints are explicit.",
  },
  {
    question: "Can I redesign selected sections without breaking the hero?",
    answer:
      "Yes. QuickFork can preserve an existing hero direction while rebuilding Features, How-to, Social Proof, FAQ, and image breaks into the same visual system.",
  },
  {
    question: "What does the export include?",
    answer:
      "A complete responsive HTML landing-page prototype with inline CSS, realistic section copy, image placement guidance, and a clear visual system for handoff.",
  },
  {
    question: "How does it help mature UI/UX designers?",
    answer:
      "It removes blank-canvas setup work while preserving judgment. Designers still choose the direction, edit the hierarchy, and decide which claims are real enough to ship.",
  },
  {
    question: "Can the page use real product data later?",
    answer:
      "Yes. Placeholder proof blocks are intentionally labelled by role and can be replaced with customer names, conversion data, screenshots, or case-study quotes when available.",
  },
] satisfies Array<FaqItem>;

export const pageNote =
  "Full landing redesign - reference flow adapted from Design.com logo-maker page - QuickFork SaaS";
