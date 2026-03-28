import { useState, useEffect } from "react";
import { GitHubIcon } from "./GitHubIcon";

function navigate(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function NavLink({
  href,
  children,
  active,
  spa,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  spa?: boolean;
}) {
  const handleClick = spa
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(href);
      }
    : undefined;

  return (
    <a
      href={href}
      onClick={handleClick}
      className="px-[14px] py-[7px] text-[13px] no-underline font-sans rounded-md inline-block transition-colors"
      style={{
        color: active ? "var(--color-ink)" : "var(--color-muted)",
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] h-[58px] px-8 flex items-center justify-between transition-[background,border-color,backdrop-filter] duration-300"
      style={{
        background: scrolled ? "rgba(12,12,20,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-[10px] cursor-pointer bg-transparent border-0"
      >
        <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center text-[13px] font-bold text-white font-display shrink-0">
          A
        </div>
        <span className="font-display font-bold text-[14px] text-ink tracking-[-0.01em]">
          alg-art-backgrounds
        </span>
      </button>

      {/* Nav links */}
      <div className="flex items-center gap-0.5">
        <NavLink href="/Studio" spa active={currentPath === "/Studio"}>
          Studio
        </NavLink>
        <NavLink href="/#gallery" active={currentPath === "/" && false}>
          Gallery
        </NavLink>
        <NavLink href="/docs" spa active={currentPath === "/docs"}>
          Docs
        </NavLink>
        <a
          href="https://github.com/dano796/alg-art-backgrounds"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 ml-2.5 px-4 py-[7px] bg-accent rounded-lg text-white no-underline text-[13px] font-semibold font-display tracking-[0.01em] whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          <GitHubIcon /> GitHub
        </a>
      </div>
    </nav>
  );
}
