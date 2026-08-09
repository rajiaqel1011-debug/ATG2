"use client";

import { useEffect, useRef } from "react";

/** شريط تقدّم ذهبي علوي — يمدّ فكرة «مسار الرحلة» على مستوى الصفحة كاملة */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = barRef.current;
      if (!el) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden>
      <div
        ref={barRef}
        className="h-full origin-right bg-gradient-to-l from-ochre via-ochre-deep to-ochre"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
