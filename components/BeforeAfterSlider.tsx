"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { v as withV } from "@/components/assetVersion";

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section id="before-after" className="relative bg-ivory py-24 md:py-32 overflow-hidden border-t border-ochre/20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* العناوين والترويسة */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="font-body text-xs font-bold tracking-[0.25em] text-[#0B7A5C] uppercase block mb-3">
            التحول الميداني — قصة أثر
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-ink leading-tight">
            من صحراءٍ قاحلة إلى{" "}
            <span className="gold-metallic font-bold">واحةٍ خضراء يافعة</span>
          </h2>
          <p className="mt-4 font-body text-base md:text-lg text-ink/75 leading-relaxed">
            اسحب الشريط لتكتشف كيف تُحيل أنظمة ATG لطاقة الشمس وضخ المياه
            الصحاري إلى مشاريع زراعية منتجة ومستدامة.
          </p>
        </div>

        {/* حاوية السلايدر التفاعلي */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border border-ochre/30"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
        >
          {/* الوسوم الثابتة فوق الصور (z-15) — لا تتشوه ولا تتغير أماكنها مع السحب */}
          <div className="pointer-events-none absolute top-3 left-3 sm:top-6 sm:left-6 z-15 rounded-full bg-[#0B7A5C]/90 backdrop-blur-md px-3 py-1 sm:px-5 sm:py-2 text-[0.68rem] sm:text-xs md:text-sm font-bold text-ivory shadow-lg border border-white/20">
            🌿 بعد: مزرعة خضراء بأنظمة ATG
          </div>
          <div className="pointer-events-none absolute top-3 right-3 sm:top-6 sm:right-6 z-15 rounded-full bg-ink/85 backdrop-blur-md px-3 py-1 sm:px-5 sm:py-2 text-[0.68rem] sm:text-xs md:text-sm font-bold text-ivory shadow-lg border border-white/15">
            ☀️ قبل: صحراء قاحلة بلا مياه
          </div>

          {/* الصورة الأساسية: بعد (المزرعة الخضراء) */}
          <div className="absolute inset-0 size-full">
            <Image
              src={withV("/images/transformation/after-farm.jpg")}
              alt="بعد: مزرعة خضراء يافعة بأنظمة ATG"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* الصورة المقصوصة: قبل (الصحراء القاحلة) */}
          <div
            className="absolute inset-y-0 right-0 overflow-hidden"
            style={{ width: `${100 - sliderPos}%` }}
          >
            <div className="absolute inset-y-0 right-0 w-[100cqw] h-full min-w-full">
              <Image
                src={withV("/images/transformation/before-desert.jpg")}
                alt="قبل: أرض صحراوية قاحلة"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* خط السلايدر والمقبض التفاعلي */}
          <div
            className="absolute inset-y-0 z-20 w-1 bg-gradient-to-b from-ochre via-ivory to-ochre shadow-[0_0_15px_rgba(213,175,102,0.8)] -translate-x-1/2"
            style={{ left: `${sliderPos}%` }}
          >
            {/* المقبض الدائري */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 md:size-14 rounded-full bg-ivory border-2 border-ochre shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center text-ochre-deep cursor-ew-resize transition-transform duration-150 hover:scale-110 active:scale-95">
              <div className="flex items-center gap-1 font-bold text-sm md:text-base">
                <span>&#10094;</span>
                <span>&#10095;</span>
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات الأثر في الأسفل */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="rounded-2xl border border-ochre/25 bg-ivory/60 p-5 backdrop-blur-sm shadow-sm">
            <span className="block font-heading text-2xl md:text-3xl font-bold text-[#0B7A5C]">
              +٢٠٠
            </span>
            <span className="mt-1 block font-body text-xs md:text-sm font-medium text-ink/75">
              منظومة ضخ منفّذة
            </span>
          </div>
          <div className="rounded-2xl border border-ochre/25 bg-ivory/60 p-5 backdrop-blur-sm shadow-sm">
            <span className="block font-heading text-2xl md:text-3xl font-bold text-[#185F74]">
              ١٠٠٠ حصان
            </span>
            <span className="mt-1 block font-body text-xs md:text-sm font-medium text-ink/75">
              أقصى قدرة مضخات
            </span>
          </div>
          <div className="rounded-2xl border border-ochre/25 bg-ivory/60 p-5 backdrop-blur-sm shadow-sm">
            <span className="block font-heading text-2xl md:text-3xl font-bold text-[#0B7A5C]">
              ١٠٠٪
            </span>
            <span className="mt-1 block font-body text-xs md:text-sm font-medium text-ink/75">
              استغناء عن الوقود
            </span>
          </div>
          <div className="rounded-2xl border border-ochre/25 bg-ivory/60 p-5 backdrop-blur-sm shadow-sm">
            <span className="block font-heading text-2xl md:text-3xl font-bold text-[#185F74]">
              ٣٠ عاماً
            </span>
            <span className="mt-1 block font-body text-xs md:text-sm font-medium text-ink/75">
              ضمانات الألواح
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
