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
    title: "Generate source-backed launch assets from repository evidence.",
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
    label: "Project explainer",
    eyebrow: "Project explainer",
    title:
      "A good launch package helps strangers understand the repo before they read the code.",
    body: "QuickFork turns README evidence, repository metadata, and workflow signals into a visual explanation that can support a README hero, launch post, pitch deck, or demo follow-up.",
    copy: "QuickFork turns README evidence, repository metadata, and workflow signals into a visual explanation that can support a README hero, launch post, pitch deck, or demo follow-up.",
    metaLabel: "Launch asset strategy",
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
        value: "Make the project understandable",
      },
      { label: "Asset type", value: "README hero / deck visual" },
      {
        label: "Composition",
        value: "Project context before decoration",
      },
      { label: "Constraint", value: "Claims stay source-backed" },
    ],
  },
  {
    id: "critique-title",
    label: "Launch review",
    eyebrow: "Launch review",
    title: "Cold-start builders need channel-ready assets without losing technical accuracy.",
    body: "QuickFork keeps the same factual brief behind README copy, social posts, deck structure, and outreach drafts, so the launch story stays consistent while each channel gets the right format.",
    copy: "QuickFork keeps the same factual brief behind README copy, social posts, deck structure, and outreach drafts, so the launch story stays consistent while each channel gets the right format.",
    metaLabel: "Package strategy",
    imageFirst: false,
    image: {
      src: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=1800&q=82",
      alt: "Designer workspace with interface sketches and laptop",
      caption:
        "Image slot B - product design process photography - placed before objections and FAQ",
    },
    meta: [
      { label: "Placement", value: "Before FAQ to handle trust objections" },
      { label: "Purpose", value: "Show reviewable launch workflow" },
      { label: "Style", value: "Operational, not hype-driven" },
      { label: "Fallback", value: "Use generated artifact preview" },
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
      "It gives the team a credible launch spine before anyone starts rewriting the README by hand.",
    body: "Best for builders who need to turn repository evidence into reviewable launch materials.",
    copy: "Best for builders who need to turn repository evidence into reviewable launch materials.",
    cite: "Early product-marketing review",
  },
  {
    quote:
      "The useful part is the translation layer: repo context becomes README, social, deck, and outreach drafts.",
    body: "QuickFork helps teams avoid generic AI copy while keeping launch channels aligned.",
    copy: "QuickFork helps teams avoid generic AI copy while keeping launch channels aligned.",
    cite: "Founder workflow note",
  },
] satisfies Array<ProofQuote>;

export const proofAudience = [
  { label: "Primary user", value: "AI project builders" },
  { label: "Secondary user", value: "Open-source maintainers and DevRel teams" },
  {
    label: "Core job",
    value: "Turn one repository URL into launch assets",
  },
  {
    label: "Proof policy",
    value: "Use real claims only; mark placeholders clearly",
  },
] satisfies Array<ProofAudience>;

export const faqItems = [
  {
    question: "What does QuickFork generate from a repository URL?",
    answer:
      "QuickFork generates a source-backed launch brief, README-oriented copy, social launch copy, deck structure, outreach drafts, visual prompts, image outputs, quality reports, and a manifest for review.",
    defaultOpen: true,
  },
  {
    question: "What do I need before starting?",
    answer:
      "Start with a public GitHub repository URL. The workflow works best when the README, repository metadata, official links, screenshots, and identity assets already describe the project clearly.",
  },
  {
    question: "Can the generated launch package be edited?",
    answer:
      "Yes. The generated package is a draft for human review. Builders can edit claims, remove unsupported language, change tone, and choose which README, social, deck, or outreach assets are publishable.",
  },
  {
    question: "What does the export include?",
    answer:
      "The current workflow returns artifact paths for prompts, generated images, quality reports, and manifest data. The growth roadmap adds fuller README, social, deck, and outreach exports.",
  },
  {
    question: "How does QuickFork avoid generic AI marketing copy?",
    answer:
      "QuickFork starts from repository evidence, labels uncertain claims, preserves source-backed project facts, and avoids unsupported rankings, customer counts, revenue claims, or invented logos.",
  },
  {
    question: "Who is the first product lifecycle stage for?",
    answer:
      "The first lifecycle stage is for cold-start AI projects, open-source maintainers, indie technical founders, and DevRel teams that need a credible launch package before they have public proof.",
  },
] satisfies Array<FaqItem>;

export const pageNote =
  "Project launch generation - mock backend contract - GitHub repository to traceable card artifacts";
