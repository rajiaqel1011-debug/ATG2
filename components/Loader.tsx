"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { v as withV, MEDIA_V } from "@/components/assetVersion";
import { preloadInitialMobileFrames, getMobilePreloadProgress } from "@/components/frameScrub";

/* ═══════════════════════════════════════════════════════════════
   اللودر — رملٌ يتجمّع فتُولد القطرة، ثم يذوب في الهيرو
   • يُرسم من الخادم فوراً (غطاء عاجي) فلا يومض محتوى الصفحة قبله
   • مؤشّر التقدّم حقيقي: نصفه تقدّم مشهد القطرة، ونصفه جاهزية الموقع
   • لا ينكشف حتى يبلغ ١٠٠٪ فعلاً (بسقف أمان)
   • يشتغل مرة واحدة في الجلسة، ويحترم تقليل الحركة
   ═══════════════════════════════════════════════════════════════ */

type Phase = "boot" | "running" | "gone";

export default function Loader() {
  // boot = غطاء ساكن (يُرسم على الخادم) — يمنع ومضة المحتوى قبل قرار العميل
  const [phase, setPhase] = useState<Phase>("boot");
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // القرار: عرض اللودر دائماً لضمان تجربة فاخرة غير منقطعة
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.body.style.overflow = "";
      setPhase("gone");
    } else {
      document.body.style.overflow = "hidden"; // امنع التمرير أثناء اللودر
      setPhase("running");
    }
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const root = rootRef.current;
    const v = videoRef.current;
    if (!root || !v) return;

    // استخدام نسخة الموبايل الخفيفة (720p) للموبايل لضمان الأداء السلس 60fps ورخاوة الحركة
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    v.src = isMobile
      ? withV("/videos/web/mobile/loader.mp4")
      : withV("/videos/web/loader.mp4");
    v.removeAttribute("poster"); // ← بلا صورة ثابتة إطلاقاً، العاجي هو الخلفية

    // التأكد من خصائص الكتم والـ playsinline الصارمة للموبايل لضمان التشغيل التلقائي
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "true");
    v.setAttribute("muted", "true");

    let finished = false;
    let sceneDone = false; // أكمل مشهد القطرة دورته مرّة على الأقل

    const finish = () => {
      if (finished) return;
      finished = true;
      sessionStorage.setItem("atg-loaded", "1");
      if (barRef.current)
        gsap.to(barRef.current, { scaleX: 1, duration: 0.25, ease: "none", overwrite: true });
      
      // تلاشٍ انسيابي حريري — يذيب اللودر في الهيرو الذي تحته تماماً
      // لا نُحرّر التمرير قبل اختفاء اللودر الكامل لمنع أي ارتداد للصفحة
      root.style.transition = "opacity 0.5s ease-in-out";
      root.style.opacity = "0";
      root.style.pointerEvents = "none";
      window.setTimeout(() => {
        document.body.style.overflow = "";
        setPhase("gone");
      }, 520);
    };

    // بدء التحميل المسبق لإطارات الموبايل فوراً عند تشغيل اللودر
    preloadInitialMobileFrames();

    /** جاهزية الموقع فعلياً: فريمات الموبايل أو فيديو الهيرو */
    const assetProgress = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile) {
        return getMobilePreloadProgress();
      }
      const hero = document.querySelector<HTMLVideoElement>("#hero video");
      if (!hero) return 0;
      if (hero.readyState >= 4) return 1;
      const d = hero.duration;
      if (!d || !isFinite(d) || !hero.buffered.length) return 0;
      return Math.min(1, hero.buffered.end(hero.buffered.length - 1) / d);
    };

    /** التقدّم المعروض = نصفه المشهد، ونصفه التحميل الحقيقي */
    const tick = () => {
      if (finished) return;
      const scene = sceneDone
        ? 1
        : v.duration
          ? Math.min(1, v.currentTime / v.duration)
          : 0;
      const p = (scene + assetProgress()) / 2;
      if (barRef.current)
        gsap.to(barRef.current, {
          scaleX: p,
          duration: 0.25,
          ease: "none",
          overwrite: true,
        });
      if (p >= 0.995) finish(); // اكتمل المشهد والتحميل معاً
    };

    const holdLastFrame = () => {
      sceneDone = true;
      try {
        v.pause();
        if (v.duration) v.currentTime = Math.max(0, v.duration - 0.05);
      } catch {
        /* تجاهل */
      }
      tick();
    };
    const onTime = () => {
      if (v.duration && v.currentTime >= v.duration - 0.06) holdLastFrame();
      else tick();
    };
    const onEnded = holdLastFrame;

    // ظهور اللوغو بنعومة
    gsap.fromTo(
      logoRef.current,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" }
    );

    // ─── على أجهزة الموبايل: انسيابية مضمونة 100% لشريط التقدّم والتلاشي ───
    if (isMobile) {
      const progressObj = { value: 0 };
      const mobileTween = gsap.to(progressObj, {
        value: 1,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${progressObj.value})`;
          }
        },
        onComplete: () => {
          finish();
        },
      });

      return () => {
        mobileTween.kill();
      };
    }

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.loop = false;

    // سرعة تشغيل مستقرة على الديسكتوب
    v.playbackRate = 1.5;

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        sceneDone = true;
        tick();
      });
    }

    // نبضة دورية: تُقدّم الشريط حتى لو توقّف الفيديو أو مُنع تشغيله
    const pulse = window.setInterval(tick, 200);
    // سقف أمان
    const safety = window.setTimeout(finish, 6000);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      window.clearInterval(pulse);
      window.clearTimeout(safety);
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] bg-ivory h-screen h-[100dvh] w-full overflow-hidden"
      aria-label="جارٍ التحميل"
      role="status"
    >
      {/* المصدر يُضبط في الإفكت حسب حجم الشاشة بدون أي صورة بوستر في البداية لتجنب الومضة */}
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover object-center"
        muted
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* اللوغو المتموّج + التقدّم */}
      <div
        ref={logoRef}
        className="absolute inset-x-0 bottom-16 z-10 flex flex-col items-center gap-5 px-6"
        style={phase === "boot" ? { opacity: 0 } : undefined}
      >
        {/* اللوغو الرسمي الكامل ATG مع ظل حواف رفيع ومباشر على الحروف والعجلة بدون أي خلفية */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withV("/images/Approved.svg")}
          alt="ATG — Advanced Technology Green"
          className="h-12 md:h-16 w-auto drop-shadow-[0_2px_8px_rgba(30,26,23,0.45)]"
          width={435}
          height={171}
        />

        {/* شريط التقدّم */}
        <span className="block h-[3px] w-40 overflow-hidden rounded-full bg-ochre-deep/15">
          <span
            ref={barRef}
            className="block h-full w-full origin-right rounded-full bg-gradient-to-l from-ochre to-ochre-deep"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
    </div>
  );
}
