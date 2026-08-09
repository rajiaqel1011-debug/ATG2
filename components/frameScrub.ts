/* ═══════════════════════════════════════════════════════════════
   Image Sequence Frame Scrub Engine v2 (Apple AirPods Tech)

   تصحيح الطبقات والجودة والتحميل المسبق:
   - يتم إدراج الكانفاس مباشرة خلف عنصر الفيديو الأصل وفي نسق الطبقات ذاته
     (حتى تظل كافة النصوص فوق الكانفاس بوضوح 100%).
   - يتم التحميل المسبق المباشر للإطارات أثناء مرحلة اللودر لمنع التأخير في السكرول الأول.
   - يتم عرض فريمات WebP بدقة 1080p الكريستالية.
   ═══════════════════════════════════════════════════════════════ */

export interface FrameScrubHandle {
  canvas: HTMLCanvasElement;
  seekTo(progress: number): void;
  setOpacity(v: string): void;
  start(): void;
  destroy(): void;
}

// ذاكرة مؤقتة عامة لتخزين الإطارات المجهزة في الذاكرة
const frameCache: Record<string, HTMLImageElement[]> = {};
let mobilePreloadProgress = 0;

/** التحميل المسبق الحقيقي للإطارات أثناء شاشة التحميل (Loader) */
export function preloadInitialMobileFrames(onProgress?: (p: number) => void): Promise<void> {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) {
    mobilePreloadProgress = 1;
    if (onProgress) onProgress(1);
    return Promise.resolve();
  }

  const initialBatch = [
    { folder: "drop-to-desert", frames: 60 },
    { folder: "panel", frames: 60 },
  ];

  let total = 0;
  initialBatch.forEach((b) => (total += b.frames));
  let loaded = 0;

  return new Promise((resolve) => {
    initialBatch.forEach(({ folder, frames }) => {
      if (!frameCache[folder]) frameCache[folder] = [];
      for (let i = 1; i <= frames; i++) {
        const numStr = String(i).padStart(3, "0");
        const img = new Image();
        img.src = `/frames/${folder}/frame_${numStr}.webp`;
        img.onload = img.onerror = () => {
          loaded++;
          mobilePreloadProgress = Math.min(1, loaded / total);
          if (onProgress) onProgress(mobilePreloadProgress);
          if (loaded >= total) resolve();
        };
        frameCache[folder].push(img);
      }
    });
  });
}

export function getMobilePreloadProgress(): number {
  return mobilePreloadProgress;
}

export function createFrameScrubHandle(
  targetVideo: HTMLVideoElement,
  folderName: string,
  totalFrames: number
): FrameScrubHandle {
  const canvas = document.createElement("canvas");
  canvas.className = "absolute inset-0 size-full object-cover";
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = "0";
  canvas.style.zIndex = "0";

  let ctx: CanvasRenderingContext2D | null = null;
  const images: HTMLImageElement[] = frameCache[folderName] || [];
  let loadedCount = images.filter((img) => img.complete).length;
  let currentProgress = 0;
  let targetProgress = 0;
  let alive = false;
  let sized = false;
  let firstDraw = false;
  let desiredOpacity = "1";
  let rafId = 0;

  // استكمال تحميل المتبقي من الإطارات
  for (let i = images.length + 1; i <= totalFrames; i++) {
    const img = new Image();
    const numStr = String(i).padStart(3, "0");
    img.src = `/frames/${folderName}/frame_${numStr}.webp`;
    img.onload = () => {
      loadedCount++;
    };
    images.push(img);
  }
  frameCache[folderName] = images;

  const syncSize = () => {
    if (sized) return;
    const firstImg = images.find((i) => i.complete && i.naturalWidth > 0);
    if (firstImg) {
      canvas.width = firstImg.naturalWidth;
      canvas.height = firstImg.naturalHeight;
      sized = true;
    }
  };

  const draw = () => {
    if (!ctx) ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx || images.length === 0) return;

    // تنعيم انسيابي لسحب الإصبع (Lerp)
    currentProgress += (targetProgress - currentProgress) * 0.35;

    const idx = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(currentProgress * (totalFrames - 1)))
    );

    const img = images[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (!firstDraw) {
          firstDraw = true;
          canvas.style.opacity = desiredOpacity;
        }
      } catch {
        /* ignore */
      }
    }
  };

  const loop = () => {
    if (!alive) return;
    syncSize();
    draw();
    rafId = requestAnimationFrame(loop);
  };

  return {
    canvas,

    seekTo(p: number) {
      targetProgress = Math.min(1, Math.max(0, p));
    },

    setOpacity(val: string) {
      desiredOpacity = val;
      if (firstDraw) canvas.style.opacity = val;
    },

    start() {
      alive = true;
      targetVideo.style.display = "none";
      if (targetVideo.parentElement) {
        targetVideo.parentElement.insertBefore(canvas, targetVideo.nextSibling);
      }
      rafId = requestAnimationFrame(loop);
    },

    destroy() {
      alive = false;
      cancelAnimationFrame(rafId);
      canvas.remove();
      targetVideo.style.display = "";
    },
  };
}
