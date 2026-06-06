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

type SocialFlowStep = {
  code: string;
  title: string;
  body: string;
  source: string;
};

type SocialChannelOutput = {
  label: string;
  title: string;
  body: string;
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

type ReviewWorkbenchLane = {
  label: string;
  title: string;
  body: string;
  items: Array<string>;
};

type PublishGate = {
  label: string;
  title: string;
  body: string;
};

type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  badge: string;
  ctaLabel: string;
  href: string;
  highlighted?: boolean;
  features: Array<string>;
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
    code: "F-01 / Cold start",
    title: "Start from the repo instead of a blank marketing brief.",
    body: "QuickFork turns a public GitHub URL into the factual base for the launch story.",
    description:
      "QuickFork turns a public GitHub URL into the factual base for the launch story.",
    artifact: { label: "Input", value: "Repo URL" },
    artifactLabel: "Input",
    artifactValue: "Repo URL",
  },
  {
    code: "F-02 / Visual story",
    title: "Infographic first.",
    body: "README, X/LinkedIn, and square social posts all reuse the same project explanation.",
    description:
      "README, X/LinkedIn, and square social posts all reuse the same project explanation.",
    artifact: { label: "Asset", value: "Infographic" },
    artifactLabel: "Asset",
    artifactValue: "Infographic",
  },
  {
    code: "F-03 / Source guard",
    title: "Evidence-locked.",
    body: "Repo metadata, README claims, official links, metrics, and identity assets stay tied to the output package.",
    description:
      "Repo metadata, README claims, official links, metrics, and identity assets stay tied to the output package.",
    artifact: { label: "Claims", value: "Traceable" },
    artifactLabel: "Claims",
    artifactValue: "Traceable",
  },
  {
    code: "F-04 / Launch copy",
    title: "Explain the problem and the solving path.",
    body: "QuickFork turns project structure into a concise story: what problem exists, what the repo changes, and why it matters.",
    description:
      "QuickFork turns project structure into a concise story: what problem exists, what the repo changes, and why it matters.",
    artifact: { label: "Story", value: "Brief" },
    artifactLabel: "Story",
    artifactValue: "Brief",
  },
  {
    code: "F-05 / Channel fit",
    title: "Package the same idea for README and social feeds.",
    body: "One repo story becomes a README cover, launch post, square social card, and editable prompt instead of disconnected one-off drafts.",
    description:
      "One repo story becomes a README cover, launch post, square social card, and editable prompt instead of disconnected one-off drafts.",
    artifact: { label: "Channels", value: "3+" },
    artifactLabel: "Channels",
    artifactValue: "3+",
  },
  {
    code: "F-06 / Review path",
    title: "Export a package humans can approve.",
    body: "Prompts, generated images, quality reports, launch copy, and manifest paths stay visible before anything is published.",
    description:
      "Prompts, generated images, quality reports, launch copy, and manifest paths stay visible before anything is published.",
    artifact: { label: "Output", value: "Manifest" },
    artifactLabel: "Output",
    artifactValue: "Manifest",
  },
] satisfies Array<FeatureCard>;

export const socialFlowSteps = [
  {
    code: "01 / Repo",
    title: "Repo",
    body: "Paste a public GitHub URL.",
    source: "README, topics, links",
  },
  {
    code: "02 / Infographic",
    title: "Infographic",
    body: "Turn the project into a visual first impression.",
    source: "Problem, mechanism, output",
  },
  {
    code: "03 / Distribute",
    title: "Distribute",
    body: "Export README and social formats from the same story.",
    source: "README, post, card",
  },
] satisfies Array<SocialFlowStep>;

export const socialChannelOutputs = [
  {
    label: "README",
    title: "README hero",
    body: "A visual opener for the repo page.",
  },
  {
    label: "Post",
    title: "X / LinkedIn",
    body: "Short launch copy for developer feeds.",
  },
  {
    label: "Card",
    title: "Square card",
    body: "A 1:1 image for feeds and directories.",
  },
  {
    label: "Copy",
    title: "Launch copy",
    body: "A compact story to paste, edit, and share.",
  },
] satisfies Array<SocialChannelOutput>;

export const showcases = [
  {
    id: "visual-posture-title",
    label: "Repo-to-social",
    eyebrow: "Repo-to-social",
    title:
      "A good launch card shows the project shape before the README asks for attention.",
    body: "QuickFork turns README evidence, repository metadata, and workflow signals into a visual explanation that can sit in a README, a launch post, or a square social card.",
    copy: "QuickFork turns README evidence, repository metadata, and workflow signals into a visual explanation that can sit in a README, a launch post, or a square social card.",
    metaLabel: "Launch asset strategy",
    imageFirst: true,
    image: {
      src: "/examples/flashqla-reference.jpeg",
      alt: "FlashQLA launch infographic generated from a GitHub repository",
      caption:
        "Example output - a README and social-ready infographic generated from repo evidence",
    },
    meta: [
      {
        label: "Section role",
        value: "Make the project scannable",
      },
      { label: "Asset type", value: "README hero / social card" },
      {
        label: "Composition",
        value: "Problem, mechanism, path",
      },
      { label: "Constraint", value: "Claims stay source-backed" },
    ],
  },
  {
    id: "critique-title",
    label: "Output reuse",
    eyebrow: "Output reuse",
    title: "The same source-backed story travels from README to social feeds.",
    body: "QuickFork keeps the factual brief behind every channel, so the launch story stays consistent while the artifact format changes for each audience.",
    copy: "QuickFork keeps the factual brief behind every channel, so the launch story stays consistent while the artifact format changes for each audience.",
    metaLabel: "Package strategy",
    imageFirst: false,
    image: {
      src: "/examples/twvp-cover-en.png",
      alt: "Visual Primitives launch infographic generated for README and social use",
      caption:
        "Example output - channel-ready infographic with problem, mechanism, and GitHub source",
    },
    meta: [
      { label: "Reuse", value: "README / post / social" },
      { label: "Purpose", value: "Explain technical structure" },
      { label: "Style", value: "Visual, not hype-driven" },
      { label: "Review", value: "Edit before sharing" },
    ],
  },
] satisfies Array<Showcase>;

export const workflowSteps = [
  {
    number: "01",
    title: "Paste the public GitHub repository.",
    body: "QuickFork starts from the repo URL and reads the project facts the audience would otherwise have to find manually.",
    copy: "QuickFork starts from the repo URL and reads the project facts the audience would otherwise have to find manually.",
  },
  {
    number: "02",
    title: "Build the cold-start story.",
    body: "The system turns README, metadata, links, metrics, and identity assets into a compact project explanation.",
    copy: "The system turns README, metadata, links, metrics, and identity assets into a compact project explanation.",
  },
  {
    number: "03",
    title: "Generate the visual and channel assets.",
    body: "QuickFork prepares infographic prompts, README/social visuals, launch copy, and review notes from the same source.",
    copy: "QuickFork prepares infographic prompts, README/social visuals, launch copy, and review notes from the same source.",
  },
  {
    number: "04",
    title: "Review the package before sharing.",
    body: "The UI keeps the launch brief, image, prompt, quality report, and manifest visible so the user stays in control.",
    copy: "The UI keeps the launch brief, image, prompt, quality report, and manifest visible so the user stays in control.",
  },
] satisfies Array<WorkflowStep>;

export const reviewWorkbenchLanes = [
  {
    label: "Input",
    title: "Input",
    body: "Start from one repo URL and a few output choices.",
    items: ["GitHub URL", "Language", "Ratio", "Launch focus"],
  },
  {
    label: "Generate",
    title: "Generate",
    body: "Create the visual, launch copy, and channel formats together.",
    items: ["Infographic", "README hero", "X / LinkedIn", "Square card"],
  },
  {
    label: "Export",
    title: "Export",
    body: "Keep the package editable before it moves to README or social.",
    items: ["Image", "Post copy", "Prompt", "Manifest"],
  },
] satisfies Array<ReviewWorkbenchLane>;

export const publishGates = [
  {
    label: "Check 01",
    title: "No fake traction",
    body: "No invented users, rankings, revenue, or viral claims.",
  },
  {
    label: "Check 02",
    title: "Source labels",
    body: "Repo facts and assumptions stay visible.",
  },
  {
    label: "Check 03",
    title: "Edit before share",
    body: "The generated package is a draft, not an autopost.",
  },
  {
    label: "Check 04",
    title: "Export ready",
    body: "README, social, and square formats stay aligned.",
  },
] satisfies Array<PublishGate>;

export const pricingPlans = [
  {
    name: "Free scan",
    price: "$0",
    cadence: "per repo",
    description: "Try one public repo and see the launch visual direction.",
    badge: "1 repo",
    ctaLabel: "Generate free scan",
    href: "#hero",
    features: [
      "Repo intake",
      "Launch angle summary",
      "README visual direction",
      "Export preview",
    ],
  },
  {
    name: "Launch package",
    price: "$49",
    cadence: "per month",
    description: "Generate repeat README, X/LinkedIn, and square-card launch packages.",
    badge: "5 launches",
    ctaLabel: "Start launch package",
    href: "/sign-up",
    highlighted: true,
    features: [
      "5 launches",
      "X/LinkedIn launch posts",
      "README and square visuals",
      "Prompt and quality reports",
    ],
  },
  {
    name: "Team review",
    price: "Custom",
    cadence: "for teams",
    description: "Add shared review and launch-package QA for technical teams.",
    badge: "Source-backed review",
    ctaLabel: "Talk to team",
    href: "/contact?intent=launch-package&utm_source=pricing",
    features: [
      "Source-backed review",
      "Shared approval checklist",
      "Launch-package QA support",
      "Private roadmap intake",
    ],
  },
] satisfies Array<PricingPlan>;

export const faqItems = [
  {
    question: "What does QuickFork generate from a repository URL?",
    answer:
      "QuickFork generates an infographic prompt, README visual direction, social post copy, square-card direction, quality report, and manifest for review.",
    defaultOpen: true,
  },
  {
    question: "What do I need before starting?",
    answer:
      "Start with a public GitHub repository URL. Clear README text, links, screenshots, and identity assets improve the output.",
  },
  {
    question: "Can the generated launch package be edited?",
    answer:
      "Yes. The generated package is a draft. Builders can edit copy, change tone, and choose which visual assets are publishable.",
  },
  {
    question: "What does the export include?",
    answer:
      "The workflow returns artifact paths for prompts, generated images, quality reports, launch copy, channel cards, and manifest data.",
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
  "Repo-to-infographic launch workspace - GitHub repository to README visual, social post, square card, and launch copy";
