import { ROUTES, GITHUB_URL } from "../../lib/constants";
import { navigate } from "../../lib/navigate";
import { Copyright } from "lucide-react";

function FooterLink({
  href,
  spa,
  children,
}: {
  href: string;
  spa?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={
        spa
          ? (e) => {
              e.preventDefault();
              navigate(href);
            }
          : undefined
      }
      className="text-[13px] text-muted hover:text-ink transition-colors duration-150 no-underline"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 md:px-10 py-8">
      <div className="flex items-start justify-between gap-8">
        {/* Left — brand + tagline + copyright */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-[13px] font-bold text-[#1a1a1a] font-display">
              A
            </div>
            <span className="text-[13px] text-ink font-display font-semibold tracking-[-0.01em]">
              ReArt
            </span>
          </div>
          <p className="text-[13px] text-muted font-sans py-1">
            Algorithmic art backgrounds for React
          </p>
        </div>

        {/* Right — nav links + copyright */}
        <div className="flex flex-col items-end gap-2">
          <nav className="flex items-center gap-6 flex-wrap justify-end">
            <FooterLink href="/#gallery">Gallery</FooterLink>
            <FooterLink href={ROUTES.studio} spa>
              Studio
            </FooterLink>
            <FooterLink href={ROUTES.docs} spa>
              Docs
            </FooterLink>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted hover:text-ink transition-colors duration-150 no-underline"
            >
              GitHub
            </a>
          </nav>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-muted font-mono py-1">
            <Copyright size={12} /> {new Date().getFullYear()} ReArt
          </span>
        </div>
      </div>
    </footer>
  );
}
