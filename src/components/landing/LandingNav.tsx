import { ChevronDown, Layers3, PanelTop, Sparkles } from "lucide-react";
import { UserMenu } from "../auth/UserMenu";

const productMenuItems = [
  {
    href: "#studio",
    icon: PanelTop,
    title: "Studio",
    description: "Generate the QuickFork launch package",
  },
  {
    href: "#how-to",
    icon: Layers3,
    title: "Launch Flow",
    description: "From reference page to structured output",
  },
  {
    href: "#features",
    icon: Sparkles,
    title: "Prompt System",
    description: "Copy, layout, and visual prompt planning",
  },
];

export function LandingNav() {
  return (
    <header className="nav">
      <div className="navInner">
        <a className="brand" href="#hero" aria-label="QuickFork home">
          <span className="mark" aria-hidden="true">
            QF
          </span>
          <span>QuickFork</span>
        </a>
        <nav className="navLinks" aria-label="Primary product navigation">
          <div className="productNavItem">
            <a className="navLink productTrigger" href="#studio" aria-label="Product, open QuickFork product studio">
              Product
              <ChevronDown className="productChevron" size={17} aria-hidden="true" />
            </a>
            <div className="productMenu" aria-label="QuickFork product menu">
              {productMenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a className="productMenuItem" href={item.href} key={item.href}>
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
          <a className="navLink pricingLink" href="#pricing" aria-label="Pricing, view subscription options">
            Pricing
          </a>
        </nav>
        <div className="navActions">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
