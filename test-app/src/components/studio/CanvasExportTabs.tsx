interface CanvasExportTabsProps {
  isDownloadingImage: boolean;
  isRecordingVideo: boolean;
  recordingCountdown: number | null;
  onDownloadImage: () => Promise<void>;
  onVideoAction: () => Promise<void>;
}

export function CanvasExportTabs({
  isDownloadingImage,
  isRecordingVideo,
  recordingCountdown,
  onDownloadImage,
  onVideoAction,
}: CanvasExportTabsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {(["image", "div-video"] as const).map((tab) => (
        <div key={tab} className="relative group">
          <button
            onClick={tab === "image" ? onDownloadImage : onVideoAction}
            disabled={tab === "image" ? isDownloadingImage : false}
            className={`text-[12px] font-sans px-3 py-1.5 rounded-md cursor-pointer border-none transition-colors bg-transparent text-muted hover:text-ink ${
              tab === "image" && isDownloadingImage
                ? "opacity-60 cursor-wait"
                : ""
            } ${
              tab === "div-video" && isRecordingVideo
                ? "text-ink"
                : ""
            }`}
          >
            {tab === "image"
              ? isDownloadingImage
                ? "Downloading..."
                : "Image"
              : isRecordingVideo
                ? `Cancel (${recordingCountdown ?? 0})`
                : "Video"}
          </button>
          <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 w-36 rounded-md bg-faint px-2 py-1.5 text-[10px] leading-tight text-ink opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            {tab === "image"
              ? "Click to download this background as an image"
              : isRecordingVideo
                ? "Click again to cancel recording"
                : "Click to download this background as a 10s video"}
          </div>
        </div>
      ))}
    </div>
  );
}
