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
    code: "01 / Evidence intake",
    title: "Evidence intake",
    body: "QuickFork reads the README, repo metadata, official links, screenshots, and identity signals before writing launch copy.",
    source: "README, topics, stars, releases",
  },
  {
    code: "02 / Social angle",
    title: "Social angle",
    body: "The system compresses the technical project into a shareable angle: problem, mechanism, proof, and why the repo matters now.",
    source: "Problem, mechanism, proof",
  },
  {
    code: "03 / Channel package",
    title: "Channel package",
    body: "The same source-backed story becomes post copy, a README visual, a square channel card, and a manifest reviewers can inspect.",
    source: "Post, card, manifest",
  },
] satisfies Array<SocialFlowStep>;

export const socialChannelOutputs = [
  {
    label: "Post",
    title: "X/LinkedIn launch post",
    body: "A short social post that explains what changed, who should care, and links back to the repository.",
  },
  {
    label: "README",
    title: "README visual card",
    body: "A repo-first visual that can sit above the README fold or inside a launch thread.",
  },
  {
    label: "Card",
    title: "Square social card",
    body: "A scannable 1:1 card for feeds, directories, and social previews.",
  },
  {
    label: "Proof",
    title: "Evidence manifest",
    body: "A review trail tying claims, prompts, images, and source facts back to the repository.",
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
    label: "Source intake",
    title: "Source intake",
    body: "Collect the repo facts that can support a public launch claim before any post copy is written.",
    items: ["README claims", "Repo metadata", "Official links", "Screenshots"],
  },
  {
    label: "Channel drafts",
    title: "Channel drafts",
    body: "Generate the launch surfaces side by side so the user can compare tone, crop, and channel fit.",
    items: ["X/LinkedIn post", "README card", "Square social", "Thread outline"],
  },
  {
    label: "Evidence audit",
    title: "Evidence audit",
    body: "Keep unsupported claims visible and force the package back through human review before sharing.",
    items: ["Claim map", "Prompt trace", "Quality note", "Manifest path"],
  },
] satisfies Array<ReviewWorkbenchLane>;

export const publishGates = [
  {
    label: "Gate 01",
    title: "Claim source map",
    body: "Every major claim points back to README text, repository metadata, official links, or marked assumptions.",
  },
  {
    label: "Gate 02",
    title: "Prompt trace",
    body: "The infographic prompt and generated image stay attached to the source brief for later editing.",
  },
  {
    label: "Gate 03",
    title: "Channel fit",
    body: "README, X/LinkedIn, and square social outputs keep the same story while changing crop and density.",
  },
  {
    label: "Gate 04",
    title: "Human approval",
    body: "The package is explicitly a review draft; publishable assets are selected by the repo owner.",
  },
] satisfies Array<PublishGate>;

export const pricingPlans = [
  {
    name: "Free scan",
    price: "$0",
    cadence: "per repo",
    description: "Validate whether one public repository has enough source evidence for a credible social launch package.",
    badge: "1 repo",
    ctaLabel: "Generate free scan",
    href: "#hero",
    features: [
      "Repo evidence intake",
      "Social angle summary",
      "README visual direction",
      "Evidence manifest preview",
    ],
  },
  {
    name: "Launch package",
    price: "$49",
    cadence: "per month",
    description: "Package repeat launches into reviewable README, X/LinkedIn, square social, and manifest assets.",
    badge: "5 launches",
    ctaLabel: "Start launch package",
    href: "/sign-up",
    highlighted: true,
    features: [
      "5 launches",
      "X/LinkedIn launch posts",
      "README and square social visuals",
      "Prompt and quality reports",
    ],
  },
  {
    name: "Team review",
    price: "Custom",
    cadence: "for teams",
    description: "Add human approval paths, shared source maps, and launch review support for technical teams.",
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
      "QuickFork generates a source-backed social launch brief, infographic prompt, README visual, social post copy, channel card direction, quality report, and manifest for review.",
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
      "Yes. The generated package is a draft for human review. Builders can edit claims, remove unsupported language, change tone, and choose which README, post, or social card assets are publishable.",
  },
  {
    question: "What does the export include?",
    answer:
      "The current workflow returns artifact paths for prompts, generated images, quality reports, launch copy, channel cards, and manifest data. The product direction keeps exports focused on README and social launch use cases.",
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
  "Repo-to-social launch workspace - GitHub repository to story, README, post, channel card, and evidence assets";
