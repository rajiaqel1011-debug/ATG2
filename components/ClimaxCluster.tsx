"use client";

import { useEffect, useRef } from "react";
import { warmSequentially, preloadOnly } from "@/components/prewarm";
import { v as withV } from "@/components/assetVersion";
import { createFrameScrubHandle, type FrameScrubHandle } from "@/components/frameScrub";

/* ═══════════════════════════════════════════════════════════════
   عنقود الذروة — رحلة الماء: من اللوح إلى الحياة
   كابل → بئر → انفجار الماء → المزرعة
   سكرول عادي + تشغيل عادي: فيديو ثابت (sticky) يشتغل loop،
   والنصوص تتكشّف مع السكرول. الثيم ينتقل من الداكن إلى المضيء.
   ═══════════════════════════════════════════════════════════════ */

type ClimaxStation = {
  videoIdx: 0 | 1 | 2 | 3; // cable | well | water-burst | farm
  w: number; // وزن السكرول — يوزّع المسافة حسب مدة الفيديو لا عدد المحطات
  theme: "dark" | "light";
  num: string;
  name: string;
};

// أسماء الفيديوهات — المسار الكامل يُبنى في الإفكت حسب حجم الشاشة
const NAMES = ["cable", "well", "water-burst", "farm"];

const POSTERS = [
  "/videos/web/posters/cable.jpg",
  "/videos/web/posters/well.jpg",
  "/videos/web/posters/water-burst.jpg",
  "/videos/web/posters/farm.jpg",
];

// الوزن ∝ مدة الفيديو × سرعة حركته. الكابل والبئر حركتهما سريعة جداً
// (اندفاع الضوء + هبوط الكاميرا) فأُعطيا ضعف وزن المدة ليمشيا أبطأ (مسافة أطول)،
// كما فعلنا مع اللوح. الانفجار والمزرعة على وزن مدتهما.
const STATIONS: ClimaxStation[] = [
  { videoIdx: 0, w: 5, theme: "dark", num: "٠٥", name: "الانطلاق" },
  { videoIdx: 0, w: 5, theme: "dark", num: "٠٦", name: "الهبوط" },
  { videoIdx: 1, w: 20, theme: "dark", num: "٠٧", name: "البئر" },
  { videoIdx: 2, w: 7, theme: "dark", num: "٠٨", name: "الانفجار" },
  { videoIdx: 3, w: 5, theme: "light", num: "٠٩", name: "الحياة" },
];

const LAST = STATIONS.length - 1;
const TOTAL_W = STATIONS.reduce((s, x) => s + x.w, 0);
// مسافة السكرول لكل ثانية فيديو (vh) — ٢٠ ≈ إيقاع القطرة المحبوب
const UNIT_VH = 20;
// نطاق تقدّم كل محطة [start,end] من الأوزان التراكمية
const RANGES = (() => {
  let cum = 0;
  return STATIONS.map((s) => {
    const start = cum / TOTAL_W;
    cum += s.w;
    return { start, end: cum / TOTAL_W };
  });
})();

export default function ClimaxCluster() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-1);

  useEffect(() => {
    const wrap = wrapRef.current;
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (!wrap || videos.length !== 4) return;

    let curVideo = 0; // الفيديو الفعّال الحالي (لرصد لحظة الفلاش)

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      videos.forEach((v, i) => {
        v.src = withV(`/videos/web/${NAMES[i]}.mp4`);
      });
    }

    // ─── محرك فريمات WebP للموبايل (سلس 60fps مثل أبل) ───
    const engines: FrameScrubHandle[] = [];
    if (isMobile) {
      const frameConfigs = [
        { video: videos[0], folder: "cable", count: 241 },
        { video: videos[1], folder: "well", count: 241 },
        { video: videos[2], folder: "water-burst", count: 169 },
        { video: videos[3], folder: "farm", count: 121 },
      ];
      frameConfigs.forEach((cfg) => {
        if (cfg.video) {
          const e = createFrameScrubHandle(cfg.video, cfg.folder, cfg.count);
          e.start();
          engines.push(e);
        }
      });
    }

    // مدى السكرول لكل فيديو (اتحاد نطاقات محطاته الموزونة) بصيغة تقدّم [0..1]
    const bounds = videos.map((_, vi) => {
      const idxs = STATIONS.map((s, i) => (s.videoIdx === vi ? i : -1)).filter((i) => i >= 0);
      return { start: RANGES[Math.min(...idxs)].start, end: RANGES[Math.max(...idxs)].end, vi };
    });

    const durations = videos.map(() => 0);
    videos.forEach((v, i) => {
      const grab = () => {
        durations[i] = v.duration || 0;
      };
      if (v.readyState >= 1) grab();
      else v.addEventListener("loadedmetadata", grab, { once: true });
      v.pause();
    });

    // ═══ تدفئة: مرورٌ صامت على الفيديوهات الأربعة قبل وصول المستخدم ═══
    // كلها تحت الشاشة عند التحميل، فتشغيلها السريع غير مرئي تماماً. تعمل
    // بالتتابع (~ثانيتين إجمالاً) ولا تُلغى إلا إذا دخل القسم فعلياً المشهد.
    // تُشغَّل فعلياً بعد تعريف recompute (تُسلّمه القيادة عند انتهائها)
    let warm: { cancel: () => void; active: () => boolean } | null = null;

    const armObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          warm?.cancel(); // وصل المستخدم — سلّم التحكّم لـrecompute
          videos.forEach(preloadOnly);
          armObserver.disconnect();
        }
      },
      { rootMargin: "0px" }
    );
    armObserver.observe(wrap);

    /** الفلاش الأبيض يومض عند دخول المزرعة (الانفجار → الحياة) */
    const flashInto = () => {
      const el = flashRef.current;
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity = "0.85";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.7s ease-out";
        el.style.opacity = "0";
      });
    };

    // كشف نص المحطة + مسار الرحلة + الثيم (عند تغيّر المحطة فقط)
    const applyStation = (idx: number) => {
      if (idx === activeRef.current) return;
      activeRef.current = idx;
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const on = i === idx;
        el.style.opacity = on ? "1" : "0";
        el.style.transform = on ? "translateY(0)" : "translateY(24px)";
      });
      railDotRefs.current.forEach((el, i) => {
        if (el) el.dataset.on = i <= idx ? "true" : "false";
      });
      wrap.dataset.scene = STATIONS[idx].theme;
    };

    // القلب: فريم الفيديو يتبع موضع السكرول — مجمّد عند الوقوف
    let ticking = false;
    const recompute = () => {
      ticking = false;
      const vh = window.innerHeight;
      const scrollable = wrap.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-wrap.getBoundingClientRect().top, 0), scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;

      const b = bounds.find((x) => progress < x.end) ?? bounds[bounds.length - 1];
      const local = Math.min(1, Math.max(0, (progress - b.start) / (b.end - b.start)));
      const v = videos[b.vi];
      const dur = durations[b.vi] || v.duration || 10;
      const targetTime = local * Math.max(0.1, dur - 0.05);
      if (engines.length) {
        // ── موبايل: محرك فريمات WebP يتولى العرض بسلاسة مطلقة 60fps ──
        engines[b.vi]?.seekTo(local);
        engines.forEach((e, i) => e.setOpacity(i <= b.vi ? "1" : "0"));
      } else {
        // ── ديسكتوب: السلوك الأصلي بلا تغيير ──
        if (v.readyState >= 1 && !v.seeking && !warm?.active()) {
          if (Math.abs(v.currentTime - targetTime) > 0.015) v.currentTime = targetTime;
        }
        videos.forEach((vv, i) => {
          vv.style.opacity = i <= b.vi ? "1" : "0";
        });
      }

      // فلاش أبيض عند عبور حدود الانفجار ↔ المزرعة (بالاتجاهين) — فريماهما
      // غير متطابقين فالفلاش يخفي القطع؛ بقية الحدود قطع خام لأن فريماتها متطابقة
      if ((curVideo === 2 && b.vi === 3) || (curVideo === 3 && b.vi === 2))
        flashInto();
      curVideo = b.vi;

      if (railFillRef.current)
        railFillRef.current.style.transform = `scaleY(${progress})`;
      let stIdx = 0;
      for (let i = 0; i < RANGES.length; i++) if (progress >= RANGES[i].start) stIdx = i;
      applyStation(Math.min(LAST, stIdx));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(recompute);
    };

    // ─── تشغيل التدفئة (بعد recompute لتُسلّمه القيادة عند انتهائها) ───
    // كلها خارج الشاشة عند التحميل — والموبايل يسحب الإطارات الآن فيحتاجها أيضاً.
    warm = warmSequentially(videos, recompute);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    recompute();

    return () => {
      engines.forEach((e) => e.destroy());
      warm?.cancel();
      armObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      id="journey"
      data-scene="dark"
      className="relative bg-ink"
      style={{ height: `${TOTAL_W * UNIT_VH + 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ═══ الفيديوهات الأربعة (تحميل كسول؛ المصدر يُضبط في الإفكت حسب الشاشة) ═══ */}
        {NAMES.map((name, i) => (
          <video
            key={name}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ease-out ${
              i === 0 ? "opacity-100" : "opacity-0"
            }`}
            poster={POSTERS[i]}
            muted
            playsInline
            preload="none"
            aria-hidden
          />
        ))}

        {/* الفلاش الأبيض — لحظة ابتلاع الضوء للمشهد */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 z-[12] bg-ivory opacity-0"
        />

        {/* طبقة السينما */}
        <div className="film-grain pointer-events-none absolute inset-0 z-10" />
        <div className="warm-vignette pointer-events-none absolute inset-0 z-10" />

        {/* ═══ نصوص المحطات ═══ */}

        {/* ٠٥ الانطلاق — أعلى المشهد */}
        <div
          ref={(el) => {
            textRefs.current[0] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-24 md:pt-28 text-center px-6 transition-[opacity,transform] duration-700 ease-out"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#185F74] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            من اللوح إلى الأرض
          </span>
          <h2 className="ivory-cinema mt-4 font-heading text-3xl md:text-5xl leading-snug text-center flex flex-col items-center justify-center">
            <span className="font-normal block text-center w-full">تنطلقُ القدرة</span>
            <span className="gold-luminous font-bold block mt-2 text-center w-full">في عروقٍ من ذهب</span>
          </h2>
          <p className="mt-4 font-body text-sm md:text-base font-normal text-ivory/80 max-w-md leading-relaxed">
            كلُّ كابلٍ يحمل ضوءَ الشمس إلى حيث يُحتاج
          </p>
        </div>

        {/* ٠٦ الهبوط — أسفل المشهد */}
        <div
          ref={(el) => {
            textRefs.current[1] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 md:pb-28 text-center px-6 opacity-0 transition-[opacity,transform] duration-700 ease-out"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#B8923F] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            تحت الأرض
          </span>
          <h2 className="ivory-cinema mt-4 font-heading text-2xl md:text-4xl font-semibold leading-snug">
            نهبطُ حيث لا تصلُ الشمس
          </h2>
          <p className="mt-3 font-body text-sm md:text-base font-normal text-ivory/80">
            الطاقة النظيفة تعمل حتى في العتمة
          </p>
        </div>

        {/* ٠٧ البئر — عمود يمين */}
        <div
          ref={(el) => {
            textRefs.current[2] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-32 text-center opacity-0 transition-[opacity,transform] duration-700 ease-out md:items-start md:justify-center md:pb-0 md:ps-[7vw] md:text-right"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#185F74] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            قلب المنظومة
          </span>
          <h2 className="ivory-cinema mt-4 font-heading text-3xl md:text-5xl leading-snug">
            <span className="font-normal block">في أعماقِ البئر…</span>
            <span className="gold-luminous font-bold block mt-2">قلبٌ يخفق</span>
          </h2>
          <p className="mt-4 max-w-sm font-body text-sm md:text-base font-normal text-ivory/80 leading-relaxed">
            مضخاتٌ غاطسة بقدراتٍ تصل حتى ١٠٠٠ حصان
          </p>
        </div>

        {/* ٠٨ الانفجار — أعلى المشهد */}
        <div
          ref={(el) => {
            textRefs.current[3] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-24 md:pt-28 text-center px-6 opacity-0 transition-[opacity,transform] duration-700 ease-out"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0B7A5C] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            لحظة الحياة
          </span>
          <h2 className="mt-4 font-heading text-3xl md:text-5xl leading-snug text-center flex flex-col items-center justify-center">
            <span className="text-ink font-normal block text-center w-full">ويتفجّرُ الماء</span>
            <span className="gold-metallic font-bold block mt-2 text-center w-full">من الظلمةِ إلى النور</span>
          </h2>
          <p className="mt-4 font-body text-sm md:text-base font-normal text-ink/80 max-w-md leading-relaxed">
            هندسةٌ تحوّل الشمسَ إلى ريّ
          </p>
        </div>

        {/* ٠٩ الحياة — المشهد المضيء الختامي */}
        <div
          ref={(el) => {
            textRefs.current[4] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-20 md:pt-24 text-center px-6 opacity-0 transition-[opacity,transform] duration-700 ease-out"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0B7A5C] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            الثمرة
          </span>
          <h2 className="mt-4 font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-ivory drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] whitespace-nowrap">
            لتحيا الأرضُ <span className="text-ochre drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">ويُروى المستقبل</span>
          </h2>
          <p className="mt-5 font-body text-sm md:text-lg font-medium text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] max-w-lg leading-relaxed">
            أنظمةُ الضخِّ الشمسي تُحيي الزراعةَ في المملكة
          </p>
        </div>

        {/* ═══ مسار الرحلة — يكمل الترقيم ٠٥ → ٠٩ (الحافة اليسرى) ═══ */}
        <div className="absolute top-1/2 z-30 -translate-y-1/2 end-4 md:end-8">
          <div className="relative flex h-60 md:h-72 flex-col items-start justify-between">
            <span className="absolute bottom-0 top-0 start-[5px] w-px bg-ochre/30" />
            <span
              ref={railFillRef}
              className="absolute bottom-0 top-0 start-[5px] w-px origin-top bg-ochre transition-transform duration-700 ease-out"
              style={{ transform: "scaleY(0)" }}
            />
            {STATIONS.map((st, i) => (
              <span
                key={i}
                ref={(el) => {
                  railDotRefs.current[i] = el;
                }}
                data-on={i === 0 ? "true" : "false"}
                className="group relative flex items-center gap-3"
              >
                <span className="block size-2.5 rotate-45 border border-ochre bg-ink/60 transition-all duration-500 group-data-[on=true]:bg-ochre group-data-[on=true]:shadow-[0_0_12px_rgba(213,175,102,0.7)]" />
                <span className="hidden md:block leading-none opacity-40 transition-opacity duration-500 group-data-[on=true]:opacity-100">
                  <span className="climax-num block font-body text-[0.6rem]">{st.num}</span>
                  <span className="climax-label mt-0.5 block font-body text-[0.72rem] font-bold">
                    {st.name}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
