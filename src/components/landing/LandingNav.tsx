import { navLinks } from "../../content/landing";

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
        <nav className="navLinks" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="navCta" href="#studio">
          Start a fork
        </a>
      </div>
    </header>
  );
}
