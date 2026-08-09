"use client";

import { useEffect, useRef } from "react";

/** خط ذهبي رفيع يرسم نفسه (من اليمين) عند دخوله مجال الرؤية */
export default function GoldRule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.dataset.shown = "true";
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      data-shown="false"
      className={`rule-draw block h-px w-full bg-gradient-to-l from-ochre-deep via-ochre/60 to-transparent ${className}`}
    />
  );
}
