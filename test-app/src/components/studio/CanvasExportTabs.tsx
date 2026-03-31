import { motion } from "framer-motion";

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
    <div className="flex items-center gap-2">
      {(["image", "div-video"] as const).map((tab) => (
        <div key={tab} className="relative group">
          <button
            onClick={tab === "image" ? onDownloadImage : onVideoAction}
            disabled={tab === "image" ? isDownloadingImage : false}
            className={`relative overflow-hidden text-[12px] font-sans px-3 py-1.5 rounded-md cursor-pointer border border-current transition-colors bg-transparent ${
              tab === "image" && isDownloadingImage
                ? "opacity-60 cursor-wait text-muted"
                : tab === "div-video" && isRecordingVideo
                  ? "text-red-500 hover:text-red-400"
                  : "text-muted hover:text-ink"
            }`}
          >
            {tab === "div-video" && isRecordingVideo && (
              <motion.span
                className="absolute inset-0 bg-red-500/20 rounded-sm"
                style={{ transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 10, ease: "linear" }}
              />
            )}
            <span className="relative z-10">
              {tab === "image"
                ? isDownloadingImage
                  ? "Downloading..."
                  : "Image"
                : isRecordingVideo
                  ? `Cancel (${recordingCountdown ?? 0}s)`
                  : "Video"}
            </span>
          </button>
          <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 w-36 rounded-md bg-faint px-2 py-1.5 text-[11px] leading-tight text-ink opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
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
