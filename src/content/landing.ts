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
    code: "F-01 / Repo intake",
    title: "Validate one GitHub URL into a canonical source.",
    body: "QuickFork normalizes owner, repo, full name, and GitHub URL before any artifact is written.",
    description:
      "QuickFork normalizes owner, repo, full name, and GitHub URL before any artifact is written.",
    artifact: { label: "Input", value: "Repo URL" },
    artifactLabel: "Input",
    artifactValue: "Repo URL",
  },
  {
    code: "F-02 / README extraction",
    title: "Generate traceable launch assets from repository evidence.",
    body: "README text, GitHub metadata, topics, metrics, official links, and referenced images become the project evidence base.",
    description:
      "README text, GitHub metadata, topics, metrics, official links, and referenced images become the project evidence base.",
    artifact: { label: "Signals", value: "README" },
    artifactLabel: "Signals",
    artifactValue: "README",
  },
  {
    code: "F-03 / Identity assets",
    title: "Resolve brand assets before drawing anything.",
    body: "The pipeline prefers official repo or README assets and falls back to the GitHub avatar instead of inventing random logos.",
    description:
      "The pipeline prefers official repo or README assets and falls back to the GitHub avatar instead of inventing random logos.",
    artifact: { label: "Asset", value: "Traceable" },
    artifactLabel: "Asset",
    artifactValue: "Traceable",
  },
  {
    code: "F-04 / Brief builder",
    title: "Convert raw signals into a curated project brief.",
    body: "Positioning, metrics, key insights, workflow steps, and source signals are saved to project_brief_curated.json.",
    description:
      "Positioning, metrics, key insights, workflow steps, and source signals are saved to project_brief_curated.json.",
    artifact: { label: "Brief", value: "JSON" },
    artifactLabel: "Brief",
    artifactValue: "JSON",
  },
  {
    code: "F-05 / Localized copy",
    title: "Keep every locale aligned to the same slots.",
    body: "English, Chinese, and Japanese cards preserve metric order, feature order, workflow order, brand names, and GitHub URL.",
    description:
      "English, Chinese, and Japanese cards preserve metric order, feature order, workflow order, brand names, and GitHub URL.",
    artifact: { label: "Copy", value: "EN/ZH/JA" },
    artifactLabel: "Copy",
    artifactValue: "EN/ZH/JA",
  },
  {
    code: "F-06 / Output package",
    title: "Write prompts, images, reports, and manifest files.",
    body: "The mock backend saves model-ready prompts, placeholder cards, per-locale quality reports, assets, and manifest.json.",
    description:
      "The mock backend saves model-ready prompts, placeholder cards, per-locale quality reports, assets, and manifest.json.",
    artifact: { label: "Output", value: "Files" },
    artifactLabel: "Output",
    artifactValue: "Files",
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
    title: "Paste a GitHub repository URL.",
    body: "The frontend sends repoUrl, locales, preset, provider, and image quality to POST /api/generations.",
    copy: "The frontend sends repoUrl, locales, preset, provider, and image quality to POST /api/generations.",
  },
  {
    number: "02",
    title: "Build the repository evidence package.",
    body: "The server reads GitHub metadata, README content, official links, referenced images, and identity assets.",
    copy: "The server reads GitHub metadata, README content, official links, referenced images, and identity assets.",
  },
  {
    number: "03",
    title: "Create copy, prompt, and quality artifacts.",
    body: "The pipeline writes fixed-slot localized copy, gpt-image-2 prompts, mock cards, and quality reports.",
    copy: "The pipeline writes fixed-slot localized copy, gpt-image-2 prompts, mock cards, and quality reports.",
  },
  {
    number: "04",
    title: "Return output paths to the Hero page.",
    body: "The UI shows artifactRoot, manifestPath, and the first locale's prompt, image, and quality report paths.",
    copy: "The UI shows artifactRoot, manifestPath, and the first locale's prompt, image, and quality report paths.",
  },
] satisfies Array<WorkflowStep>;

export const studioPills = [
  { label: "Input", value: "github.com/owner/repo" },
  { label: "Brief", value: "project_brief_curated.json" },
  { label: "Locales", value: "EN - ZH - JA" },
  { label: "Outputs", value: "Prompt - image - quality report" },
] satisfies Array<StudioPill>;

export const canvasModules = [
  "Brief JSON",
  "Prompt file",
  "Quality report",
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
  "Project launch generation - mock backend contract - GitHub repository to traceable card artifacts";
