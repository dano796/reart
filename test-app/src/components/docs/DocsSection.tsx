import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, SlidersHorizontal } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";
import { ControlsPanel } from "./ControlsPanel";
import { IntroductionView } from "./IntroductionView";
import { InstallationView } from "./InstallationView";
import { BackgroundView } from "./BackgroundView";
import { DOC_REGISTRY } from "./registry";
import { navigate } from "../../lib/navigate";
import { docsRoute, ROUTES } from "../../lib/constants";

export function DocsSection({ backgroundId }: { backgroundId?: string }) {
  const staticPages = ["introduction", "installation"];
  const initialPage = backgroundId
    ? staticPages.includes(backgroundId)
      ? backgroundId
      : `bg-${backgroundId}`
    : "introduction";
  const [activePage, setActivePage] = useState(initialPage);
  const initialEntry = DOC_REGISTRY.find((e) => `bg-${e.id}` === initialPage);
  const [params, setParams] = useState<Record<string, unknown>>(
    initialEntry ? { ...initialEntry.defaults } : {},
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const bgEntry = DOC_REGISTRY.find((e) => `bg-${e.id}` === activePage);

  useEffect(() => {
    const anyOpen = sidebarOpen || controlsOpen;
    document.body.classList.toggle("sidebar-open", anyOpen);
    return () => document.body.classList.remove("sidebar-open");
  }, [sidebarOpen, controlsOpen]);

  const handleNavigate = useCallback((page: string) => {
    const entry = DOC_REGISTRY.find((e) => `bg-${e.id}` === page);
    setActivePage(page);
    setParams(entry ? { ...entry.defaults } : {});
    const bgId = page.startsWith("bg-") ? page.slice(3) : null;
    navigate(bgId ? docsRoute(bgId) : ROUTES.docs + "/" + page);
  }, []);

  const handleParamChange = useCallback((name: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    if (bgEntry) setParams({ ...bgEntry.defaults });
  }, [bgEntry]);

  return (
    <section id="docs" className="min-h-[calc(100vh-58px)]">
      {/* Mobile backdrops */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {controlsOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setControlsOpen(false)}
        />
      )}

      <div
        className={`grid ${bgEntry ? "lg:grid-cols-[260px_minmax(0,1fr)_292px]" : "lg:grid-cols-[260px_minmax(0,1fr)]"}`}
      >
        <DocsSidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 pb-24 min-h-[calc(100vh-58px)]">
          {/* Mobile toolbar */}
          <div className="lg:hidden sticky top-14.5 z-20 flex items-center gap-2 px-4 py-2.5 bg-bg border-b border-border">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-muted font-sans touch-manipulation hover:border-accent"
            >
              <Menu size={13} aria-hidden="true" /> Navigation
            </button>
            {bgEntry && (
              <button
                onClick={() => setControlsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[12px] text-muted font-sans touch-manipulation hover:border-accent"
              >
                <SlidersHorizontal size={13} aria-hidden="true" /> Customize
              </button>
            )}
          </div>

          <div className="pt-6 px-5 md:pt-8 md:px-10">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {activePage === "introduction" && <IntroductionView />}
              {activePage === "installation" && <InstallationView />}
              {bgEntry && (
                <BackgroundView
                  entry={bgEntry}
                  params={params}
                  onParamChange={handleParamChange}
                />
              )}
            </motion.div>
          </div>
        </main>

        {bgEntry && (
          <ControlsPanel
            entry={bgEntry}
            params={params}
            onChange={handleParamChange}
            onReset={handleReset}
            isOpen={controlsOpen}
            onClose={() => setControlsOpen(false)}
          />
        )}
      </div>
    </section>
  );
}
