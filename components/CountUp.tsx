"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AR = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabic = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\d/g, (d) => AR[+d]);

/** رقم يُعدّ تصاعدياً عند دخوله مجال الرؤية — بالأرقام الهندية */
export default function CountUp({
  to,
  prefix = "",
  className,
}: {
  to: number;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = prefix + toArabic(to);
      return;
    }

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = prefix + toArabic(obj.v);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [to, prefix]);

  return (
    <span ref={ref} className={className}>
      {prefix + toArabic(0)}
    </span>
  );
}
