import { ChevronDown, Image, MessageSquareText, PanelsTopLeft, Route } from "lucide-react";
import { UserMenu } from "../auth/UserMenu";

const featureLinks = [
  {
    href: "#features",
    icon: Image,
    title: "Launch infographic",
    description: "Repo to README and social visual",
  },
  {
    href: "#studio",
    icon: MessageSquareText,
    title: "Social copy studio",
    description: "Post copy, locale, and channel output",
  },
  {
    href: "/examples/qwenlm-flashqla-launch-card",
    icon: PanelsTopLeft,
    title: "Generated examples",
    description: "Inspect real repo-to-social packages",
  },
  {
    href: "/product/github-repo-launch-materials-map",
    icon: Route,
    title: "Repo-to-SaaS roadmap",
    description: "Future tools for launch and SaaS packaging",
  },
] as const;

const navLinks = [
  { label: "Studio", href: "#studio" },
  { label: "Examples", href: "/examples/qwenlm-flashqla-launch-card" },
  { label: "Resources", href: "/resources/open-source-launch-checklist" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function LandingNav() {
  return (
    <header className="nav">
      <div className="navInner">
        <a className="brand" href={getLandingAnchorHref("#hero")} aria-label="QuickFork home">
          <span className="mark" aria-hidden="true">
            QF
          </span>
          <span className="brandCopy">
            <strong>QuickFork</strong>
            <small>Repo-to-social tools</small>
          </span>
        </a>
        <nav className="navLinks" aria-label="Primary product navigation">
          <div className="productNavItem">
            <a className="navLink productTrigger" href={getLandingAnchorHref("#features")}>
              Features
              <ChevronDown className="productChevron" size={17} aria-hidden="true" />
            </a>
            <div className="productMenu" aria-label="QuickFork features menu">
              {featureLinks.map((item) => {
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
          {navLinks.map((link) => (
            <a className="navLink" href={getNavHref(link.href)} key={link.href}>
              {link.label}
            </a>
          ))}
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
