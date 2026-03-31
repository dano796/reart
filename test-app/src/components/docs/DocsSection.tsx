import { useState, useCallback } from "react";
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
    initialEntry ? { ...initialEntry.defaults } : {}
  );

  const bgEntry = DOC_REGISTRY.find((e) => `bg-${e.id}` === activePage);

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
      <div
        className={`grid ${bgEntry ? "grid-cols-[260px_minmax(0,1fr)_292px]" : "grid-cols-[260px_minmax(0,1fr)]"}`}
      >
        <DocsSidebar activePage={activePage} onNavigate={handleNavigate} />

        <main className="min-w-0 pt-1 px-8 pb-24 min-h-[calc(100vh-58px)]">
          <div key={activePage}>
            {activePage === "introduction" && <IntroductionView />}
            {activePage === "installation" && <InstallationView />}
            {bgEntry && (
              <BackgroundView
                entry={bgEntry}
                params={params}
                onParamChange={handleParamChange}
              />
            )}
          </div>
        </main>

        {bgEntry && (
          <ControlsPanel
            entry={bgEntry}
            params={params}
            onChange={handleParamChange}
            onReset={handleReset}
          />
        )}
      </div>
    </section>
  );
}
