import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GitHubIcon } from "./GitHubIcon";
import { navigate } from "../../lib/navigate";
import { ROUTES, GITHUB_URL } from "../../lib/constants";

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
      className={`px-3.5 py-1.75 text-[13px] no-underline font-sans rounded-md inline-block transition-colors ${active ? "text-ink font-medium" : "text-muted font-normal"}`}
    >
      {children}
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = () => {
      setCurrentPath(window.location.pathname);
      setMenuOpen(false);
    };
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", menuOpen);
    return () => document.body.classList.remove("sidebar-open");
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-200 h-14.5 px-4 md:px-8 flex items-center justify-between transition-[background,border-color,backdrop-filter] duration-300 border-b ${scrolled ? "bg-[rgba(12,12,20,0.88)] backdrop-blur-[14px] border-border" : "bg-transparent backdrop-blur-none border-transparent"}`}
      >
        {/* Logo */}
        <button
          onClick={() => navigate(ROUTES.home)}
          className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0"
        >
          <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center text-[13px] font-bold text-[#1a1a1a] font-display shrink-0">
            A
          </div>
          <span className="font-display font-bold text-[14px] text-ink tracking-[-0.01em]">
            alg-art-backgrounds
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          <NavLink href={ROUTES.studio} spa active={currentPath === ROUTES.studio}>
            Studio
          </NavLink>
          <NavLink href="/#gallery" active={currentPath === "/" && false}>
            Gallery
          </NavLink>
          <NavLink href={ROUTES.docs} spa active={currentPath === ROUTES.docs}>
            Docs
          </NavLink>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 ml-2.5 px-4 py-1.75 bg-accent rounded-lg text-[#1a1a1a] no-underline text-[13px] font-semibold font-display tracking-[0.01em] whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            <GitHubIcon /> GitHub
          </a>
        </div>

        {/* Mobile hamburger / close toggle */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 text-muted hover:text-ink cursor-pointer bg-transparent border-0"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="x"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -45 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="md:hidden fixed inset-0 z-198 bg-black/50"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="drawer"
              className="md:hidden fixed top-14.5 left-0 right-0 z-199 bg-bg border-b border-border overflow-hidden"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="px-4 py-2 flex flex-col">
                <a
                  href={ROUTES.studio}
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(ROUTES.studio); }}
                  className={`py-3.5 text-[13px] font-sans no-underline border-b border-border/40 ${currentPath === ROUTES.studio ? "text-ink font-semibold" : "text-muted"}`}
                >
                  Studio
                </a>
                <a
                  href="/#gallery"
                  onClick={() => setMenuOpen(false)}
                  className="py-3.5 text-[13px] font-sans text-muted no-underline border-b border-border/40"
                >
                  Gallery
                </a>
                <a
                  href={ROUTES.docs}
                  onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate(ROUTES.docs); }}
                  className={`py-3.5 text-[13px] font-sans no-underline border-b border-border/40 ${currentPath === ROUTES.docs ? "text-ink font-semibold" : "text-muted"}`}
                >
                  Docs
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3.5 mb-2 flex items-center justify-center gap-2 py-2.5 bg-accent rounded-lg text-[#1a1a1a] text-[13px] font-semibold font-display no-underline hover:opacity-90 transition-opacity"
                >
                  <GitHubIcon /> GitHub
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
