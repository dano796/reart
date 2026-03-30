/**
 * BackgroundStudio — interactive playground for alg-art-backgrounds.
 *
 * Thin orchestrator: owns all state, delegates rendering to Sidebar,
 * the canvas preview, and ExportModal.
 */

import { useState, useCallback } from "react";
import type { BackgroundId, AnyParams } from "./types";
import { BACKGROUNDS, buildInitialParamMap } from "./backgrounds";
import { Sidebar } from "./Sidebar";
import { ExportModal } from "./ExportModal";
import { useCanvasExport } from "./useCanvasExport";
import { CanvasExportTabs } from "./CanvasExportTabs";
import { Navbar } from "../layout/Navbar";
import { DemoContentOverlay } from "../shared/DemoContentOverlay";

export function BackgroundStudio({ initialBg }: { initialBg?: string } = {}) {
  const [activeId, setActiveId] = useState<BackgroundId>(
    (initialBg && BACKGROUNDS.some((b) => b.id === initialBg)
      ? initialBg
      : "flow-currents") as BackgroundId,
  );
  const [paramMap, setParamMap] =
    useState<Record<string, AnyParams>>(buildInitialParamMap);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const bg = BACKGROUNDS.find((b) => b.id === activeId)!;
  const params = paramMap[activeId];
  const {
    previewRef,
    isDownloadingImage,
    isRecordingVideo,
    recordingCountdown,
    handleDownloadImage,
    handleVideoAction,
  } = useCanvasExport(bg.id, params.seed as number | string | undefined);

  const handleParamChange = useCallback(
    (name: string, value: number | string | boolean) => {
      setParamMap((prev) => ({
        ...prev,
        [activeId]: { ...prev[activeId], [name]: value },
      }));
    },
    [activeId],
  );

  const handleReset = useCallback(() => {
    setParamMap((prev) => ({ ...prev, [activeId]: { ...bg.defaults } }));
  }, [activeId, bg.defaults]);

  const handleRandomSeed = useCallback(() => {
    handleParamChange("seed", Math.floor(Math.random() * 999999) + 1);
  }, [handleParamChange]);

  const handleSelectBg = (id: BackgroundId) => {
    setActiveId(id);
    setDropdownOpen(false);
    setSearchQuery("");
  };

  const filtered = BACKGROUNDS.filter(
    (b) =>
      b.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-bg font-sans text-ink overflow-hidden">
      <Navbar />

      {/* Main content row — offset below fixed navbar */}
      <div className="flex mt-14.5 mr-4 h-[calc(100vh-3.625rem)] overflow-hidden">
        <Sidebar
          bg={bg}
          params={params}
          isDisabled={isRecordingVideo}
          activeId={activeId}
          dropdownOpen={dropdownOpen}
          searchQuery={searchQuery}
          filtered={filtered}
          onSelectBg={handleSelectBg}
          onToggleDropdown={() => setDropdownOpen((o) => !o)}
          onSearchChange={setSearchQuery}
          onParamChange={handleParamChange}
          onReset={handleReset}
          onRandomSeed={handleRandomSeed}
          onExport={() => setExportOpen(true)}
        />

        {/* Canvas area */}
        <div className="flex-1 flex flex-col overflow-hidden pt-2 p-4 gap-3">
          {/* Canvas card */}
          <div
            ref={previewRef}
            className="studio-in-1 flex-1 relative overflow-hidden rounded-xl"
          >
            <bg.Component
              {...params}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
            {showContent && <DemoContentOverlay />}
          </div>

          {/* Bottom bar: tabs left, demo toggle right */}
          <div className="studio-in-2 shrink-0 flex items-center justify-between px-1">
            <CanvasExportTabs
              isDownloadingImage={isDownloadingImage}
              isRecordingVideo={isRecordingVideo}
              recordingCountdown={recordingCountdown}
              onDownloadImage={handleDownloadImage}
              onVideoAction={handleVideoAction}
            />

            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-sans text-muted">
                Demo Content
              </span>
              <button
                onClick={() => setShowContent((v) => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer border-0 shrink-0 ${showContent ? "bg-accent" : "bg-faint"}`}
              >
                <span
                  className={`absolute w-3.5 h-3.5 top-0.75 left-0.75 rounded-full bg-white transition-transform duration-200 ${showContent ? "translate-x-4" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {exportOpen && (
        <ExportModal
          bg={bg}
          params={params}
          onClose={() => setExportOpen(false)}
        />
      )}
    </div>
  );
}
