/* ═══════════════════════════════════════════════════════════════
   Canvas Scrub Engine v2 (النسخة السريعة والخفيفة السابقة)

   استرجاع نسخة v2 بناءً على توجيهات السيد راجي:
   - استجابة فورية وحظية مع حركة الإصبع (مباشرة بلا أذيال أو تأخير).
   - بمجرد رفع الإصبع يتوقف الفيديو فوراً في مكانه بدون أي lag.
   - خفيفة جداً على المعالج وتعتمد 100% على سرعة الـ Decoder بفضل الـ 1080p Keyframes.
   ═══════════════════════════════════════════════════════════════ */

export interface ScrubHandle {
  canvas: HTMLCanvasElement;
  seekTo(t: number): void;
  setOpacity(v: string): void;
  start(): void;
  destroy(): void;
}

export function createScrubHandle(video: HTMLVideoElement): ScrubHandle {
  const canvas = document.createElement("canvas");
  canvas.className = "absolute inset-0 size-full object-cover";
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = "0";

  let ctx: CanvasRenderingContext2D | null = null;
  let targetTime = 0;
  let isSeeking = false;
  let alive = false;
  let sized = false;
  let firstDraw = false;
  let desiredOpacity = "1";
  let rafId = 0;

  const syncSize = () => {
    if (sized) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (w > 0 && h > 0) {
      canvas.width = w;
      canvas.height = h;
      sized = true;
    }
  };

  const draw = () => {
    if (!ctx) ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx || video.readyState < 2) return;
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (!firstDraw) {
        firstDraw = true;
        canvas.style.opacity = desiredOpacity;
        video.style.opacity = "0";
        video.style.transition = "none";
      }
    } catch {
      /* ignore */
    }
  };

  const executeNextSeek = () => {
    if (!alive || video.readyState < 1 || !video.paused) return;
    if (Math.abs(video.currentTime - targetTime) > 0.01) {
      isSeeking = true;
      video.currentTime = targetTime;
    } else {
      isSeeking = false;
    }
  };

  const onSeeked = () => {
    if (!alive) return;
    draw();
    isSeeking = false;
    executeNextSeek();
  };

  const safetyLoop = () => {
    if (!alive) return;
    syncSize();
    if (!isSeeking && Math.abs(video.currentTime - targetTime) > 0.01) {
      executeNextSeek();
    }
    draw();
    rafId = requestAnimationFrame(safetyLoop);
  };

  return {
    canvas,

    seekTo(t: number) {
      targetTime = t;
      if (!isSeeking) {
        executeNextSeek();
      }
    },

    setOpacity(val: string) {
      desiredOpacity = val;
      if (firstDraw) canvas.style.opacity = val;
    },

    start() {
      alive = true;
      video.addEventListener("seeked", onSeeked);
      video.parentElement?.insertBefore(canvas, video.nextSibling);
      rafId = requestAnimationFrame(safetyLoop);
    },

    destroy() {
      alive = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", onSeeked);
      video.style.opacity = "";
      video.style.transition = "";
      canvas.remove();
    },
  };
}
