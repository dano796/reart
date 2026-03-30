import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

interface UseCanvasExportResult {
  previewRef: RefObject<HTMLDivElement | null>;
  isDownloadingImage: boolean;
  isRecordingVideo: boolean;
  recordingCountdown: number | null;
  handleDownloadImage: () => Promise<void>;
  handleVideoAction: () => Promise<void>;
}

function getBestVideoMimeType() {
  if (typeof MediaRecorder === "undefined") return null;

  const candidates = [
    "video/webm;codecs=av01",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

function sanitizeSeed(seed: number | string | undefined) {
  const value = String(seed ?? "unknown").trim();
  return value.length > 0 ? value.replace(/[^a-zA-Z0-9_-]/g, "_") : "unknown";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useCanvasExport(
  bgId: string,
  seed: number | string | undefined,
): UseCanvasExportResult {
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState<number | null>(
    null,
  );

  const previewRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const canceledRef = useRef(false);

  const getPreviewCanvas = useCallback(() => {
    return previewRef.current?.querySelector("canvas") ?? null;
  }, []);

  const buildFileBaseName = useCallback(() => {
    return `${bgId}_${sanitizeSeed(seed)}`;
  }, [bgId, seed]);

  const clearRecordingTimers = useCallback(() => {
    if (stopTimeoutRef.current !== null) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const cleanupRecorderResources = useCallback(() => {
    clearRecordingTimers();
    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setIsRecordingVideo(false);
    setRecordingCountdown(null);
  }, [clearRecordingTimers]);

  const handleDownloadImage = useCallback(async () => {
    if (isDownloadingImage) return;

    const canvas = getPreviewCanvas();
    if (!canvas) {
      window.alert("Canvas not available yet. Please try again in a second.");
      return;
    }

    setIsDownloadingImage(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (!result) {
            reject(new Error("Could not generate PNG from canvas."));
            return;
          }
          resolve(result);
        }, "image/png");
      });

      downloadBlob(blob, `${buildFileBaseName()}.png`);
    } catch (error) {
      console.error(error);
      window.alert("Image export failed. Please try again.");
    } finally {
      setIsDownloadingImage(false);
    }
  }, [buildFileBaseName, getPreviewCanvas, isDownloadingImage]);

  const handleDownloadVideo = useCallback(async () => {
    if (isRecordingVideo) return;

    const canvas = getPreviewCanvas();
    if (!canvas) {
      window.alert("Canvas not available yet. Please try again in a second.");
      return;
    }

    if (typeof canvas.captureStream !== "function") {
      window.alert("Video export is not supported in this browser.");
      return;
    }

    const mimeType = getBestVideoMimeType();
    if (!mimeType) {
      window.alert("Video export is not supported in this browser.");
      return;
    }

    const stream = canvas.captureStream(60);
    const chunks: BlobPart[] = [];

    canceledRef.current = false;
    setIsRecordingVideo(true);
    setRecordingCountdown(10);
    try {
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 20_000_000,
      });
      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;

      const blobPromise = new Promise<Blob>((resolve, reject) => {
        recorder!.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) chunks.push(event.data);
        };

        recorder!.onerror = () => {
          reject(new Error("MediaRecorder failed."));
        };

        recorder!.onstop = () => {
          resolve(new Blob(chunks, { type: mimeType }));
        };
      });

      recorder.start(250);
      countdownIntervalRef.current = window.setInterval(() => {
        setRecordingCountdown((prev) => {
          if (prev === null) return prev;
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);

      stopTimeoutRef.current = window.setTimeout(() => {
        if (recorder && recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 10_000);

      const blob = await blobPromise;
      if (!canceledRef.current) {
        const extension = mimeType.includes("mp4") ? "mp4" : "webm";
        downloadBlob(blob, `${buildFileBaseName()}.${extension}`);
      }
    } catch (error) {
      console.error(error);
      window.alert("Video export failed. Please try again.");
    } finally {
      cleanupRecorderResources();
    }
  }, [
    buildFileBaseName,
    cleanupRecorderResources,
    getPreviewCanvas,
    isRecordingVideo,
  ]);

  const cancelVideoRecording = useCallback(async () => {
    if (!isRecordingVideo) return;
    canceledRef.current = true;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }
    cleanupRecorderResources();
  }, [cleanupRecorderResources, isRecordingVideo]);

  const handleVideoAction = useCallback(async () => {
    if (isRecordingVideo) {
      await cancelVideoRecording();
      return;
    }
    await handleDownloadVideo();
  }, [cancelVideoRecording, handleDownloadVideo, isRecordingVideo]);

  useEffect(() => {
    return () => {
      canceledRef.current = true;
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      cleanupRecorderResources();
    };
  }, [cleanupRecorderResources]);

  return {
    previewRef,
    isDownloadingImage,
    isRecordingVideo,
    recordingCountdown,
    handleDownloadImage,
    handleVideoAction,
  };
}
