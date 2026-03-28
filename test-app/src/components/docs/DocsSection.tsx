import { useState, useCallback } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { ControlsPanel } from "./ControlsPanel";
import { IntroductionPage } from "./pages/IntroductionPage";
import { InstallationPage } from "./pages/InstallationPage";
import { BackgroundPage } from "./pages/BackgroundPage";
import { DOC_REGISTRY } from "./docRegistry";

export function DocsSection() {
  const [activePage, setActivePage] = useState("introduction");
  const [params, setParams] = useState<Record<string, unknown>>({});

  const bgEntry = DOC_REGISTRY.find((e) => `bg-${e.id}` === activePage);

  const handleNavigate = useCallback((page: string) => {
    const entry = DOC_REGISTRY.find((e) => `bg-${e.id}` === page);
    setActivePage(page);
    setParams(entry ? { ...entry.defaults } : {});
  }, []);

  const handleParamChange = useCallback((name: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    if (bgEntry) setParams({ ...bgEntry.defaults });
  }, [bgEntry]);

  const cols = bgEntry
    ? "260px minmax(0, 1fr) 292px"
    : "260px minmax(0, 1fr)";

  return (
    <section
      id="docs"
      style={{ minHeight: "calc(100vh - 58px)" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: cols }}>
        <DocsSidebar activePage={activePage} onNavigate={handleNavigate} />

        <main
          className="min-w-0"
          style={{ padding: "40px 32px 96px", minHeight: "calc(100vh - 58px)" }}
        >
          <div key={activePage}>
            {activePage === "introduction" && <IntroductionPage />}
            {activePage === "installation" && <InstallationPage />}
            {bgEntry && (
              <BackgroundPage
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
