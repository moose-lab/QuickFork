import { BookOpen, ChevronDown, FileText, Layers3, PanelTop, Route, Search, Sparkles, Target } from "lucide-react";
import { UserMenu } from "../auth/UserMenu";

const navMenus = [
  {
    label: "Product",
    href: "#studio",
    ariaLabel: "Product, open QuickFork product studio",
    menuLabel: "QuickFork product menu",
    items: [
      {
        href: "#studio",
        icon: PanelTop,
        title: "Studio",
        description: "Generate the QuickFork launch package",
      },
      {
        href: "/product/github-repo-to-launch-package",
        icon: Route,
        title: "Repo to launch package",
        description: "Source-backed story, copy, and visuals",
      },
      {
        href: "/product/source-backed-launch-assets",
        icon: Target,
        title: "Source-backed launch assets",
        description: "Keep generated claims reviewable",
      },
      {
        href: "/product/cold-start-launch-materials",
        icon: Sparkles,
        title: "Cold-start launch materials",
        description: "README, social, deck, and outreach drafts",
      },
      {
        href: "/product/github-repo-launch-materials-map",
        icon: Layers3,
        title: "Launch materials map",
        description: "Plan every launch artifact by evidence",
      },
      {
        href: "/product/repository-launch-package-pilot",
        icon: FileText,
        title: "Launch package pilot",
        description: "Request a fuller founder-led package",
      },
    ],
  },
  {
    label: "Use Cases",
    href: "/use-cases/open-source-launch",
    ariaLabel: "Use Cases, browse QuickFork launch use cases",
    menuLabel: "QuickFork use cases menu",
    items: [
      {
        href: "/use-cases/open-source-launch",
        icon: BookOpen,
        title: "Open-source launch",
        description: "Package a public repository for launch",
      },
      {
        href: "/use-cases/ai-project-launch",
        icon: Sparkles,
        title: "AI project launch",
        description: "Explain AI repos for builders and users",
      },
      {
        href: "/use-cases/devrel-launch-workflow",
        icon: Route,
        title: "DevRel launch workflow",
        description: "Repeat launch prep across many projects",
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources/open-source-launch-checklist",
    ariaLabel: "Resources, browse QuickFork launch resources",
    menuLabel: "QuickFork resources menu",
    items: [
      {
        href: "/resources/open-source-launch-checklist",
        icon: FileText,
        title: "Open-source launch checklist",
        description: "Review launch basics before publishing",
      },
      {
        href: "/resources/github-project-marketing-card-guide",
        icon: BookOpen,
        title: "Marketing card guide",
        description: "Turn a repo into a visual card",
      },
      {
        href: "/resources/github-repo-launch-demand-map",
        icon: Search,
        title: "Launch demand map",
        description: "Prioritize launch pages and assets",
      },
      {
        href: "/resources/readme-cover-prompt-guide",
        icon: Sparkles,
        title: "README cover prompt guide",
        description: "Prompt safer README launch visuals",
      },
      {
        href: "/tools/github-repo-launch-readiness-score",
        icon: Target,
        title: "Launch readiness score",
        description: "Score what the repo needs next",
      },
      {
        href: "/templates/github-launch-announcement",
        icon: FileText,
        title: "Launch announcement template",
        description: "Draft a launch post from source evidence",
      },
    ],
  },
  {
    label: "Examples",
    href: "/examples/qwenlm-flashqla-launch-card",
    ariaLabel: "Examples, browse QuickFork examples and comparisons",
    menuLabel: "QuickFork examples menu",
    items: [
      {
        href: "/examples/qwenlm-flashqla-launch-card",
        icon: PanelTop,
        title: "QwenLM FlashQLA launch card",
        description: "A source-backed launch example",
      },
      {
        href: "/examples/deepseek-twvp-launch-card",
        icon: PanelTop,
        title: "DeepSeek TWVP launch card",
        description: "A visual primitive project example",
      },
      {
        href: "/compare/chatgpt-open-source-launch-copy",
        icon: Search,
        title: "ChatGPT comparison",
        description: "Compare generic chat to repo evidence",
      },
      {
        href: "/compare/canva-readme-banner-generator",
        icon: Search,
        title: "Canva comparison",
        description: "Compare visual tools to source-backed assets",
      },
    ],
  },
];

export function LandingNav() {
  const studioHref = getLandingAnchorHref("#studio");

  return (
    <header className="nav">
      <div className="navInner">
        <a className="brand" href={getLandingAnchorHref("#hero")} aria-label="QuickFork home">
          <span className="mark" aria-hidden="true">
            QF
          </span>
          <span>QuickFork</span>
        </a>
        <nav className="navLinks" aria-label="Primary product navigation">
          {navMenus.map((menu) => (
            <div className="productNavItem" key={menu.label}>
              <a className="navLink productTrigger" href={getNavHref(menu.href)} aria-label={menu.ariaLabel}>
                {menu.label}
                <ChevronDown className="productChevron" size={17} aria-hidden="true" />
              </a>
              <div className="productMenu" aria-label={menu.menuLabel}>
                {menu.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a className="productMenuItem" href={getNavHref(item.href)} key={item.href}>
                      <span className="productMenuIcon" aria-hidden="true">
                        <Icon size={20} />
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
          <a className="navLink pricingLink" href={getLandingAnchorHref("#pricing")} aria-label="Pricing, view subscription options">
            Pricing
          </a>
          <a className="navLink navBriefLink" href={studioHref} aria-label="Generate free repo brief">
            Generate free repo brief
          </a>
        </nav>
        <div className="navActions">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function getLandingAnchorHref(hash: string) {
  return window.location.pathname === "/" ? hash : `/${hash}`;
}

function getNavHref(href: string) {
  return href.startsWith("#") ? getLandingAnchorHref(href) : href;
}
