"use client";

import { useEffect, useRef } from "react";
import { warmSequentially, warmBehindPoster } from "@/components/prewarm";
import { v as withV } from "@/components/assetVersion";
import { createFrameScrubHandle, type FrameScrubHandle } from "@/components/frameScrub";

/* ═══════════════════════════════════════════════════════════════
   العنقود الافتتاحي — سكرول عادي + تشغيل عادي
   الفيديو ثابت (sticky) يشتغل loop كخلفية سينمائية،
   والنصوص تتكشّف واحداً تلو الآخر مع السكرول الطبيعي.
   لا اعتراض على العجلة، لا إيقاف للسكرول، لا scrubbing → صفر bugs.
   ═══════════════════════════════════════════════════════════════ */

type Station = {
  video: 0 | 1; // 0 = drop-to-desert | 1 = panel
  w: number; // وزن السكرول — يوزّع المسافة حسب مدة الفيديو لا عدد المحطات
  name: string; // اسم المحطة في مسار الرحلة
  num: string; // رقمها بالأرقام الهندية
};

// القطرة والاقتراب والصحراء = فيديو واحد (٣ محطات، ~١٠ث)، اللوح = فيديو (~١٠ث).
// اللوح حركته أسرع بصرياً (اندفاع الكاميرا) فنعطيه وزناً أكبر (٥) = مسافة
// سكرول أطول ليتمدّد عليها = يُحَسّ أبطأ وأهدأ. القطرة تبقى ٣ (سرعتها محبوبة).
const STATIONS: Station[] = [
  { video: 0, w: 1, name: "القطرة", num: "٠١" },
  { video: 0, w: 1, name: "الاقتراب", num: "٠٢" },
  { video: 0, w: 1, name: "الصحراء", num: "٠٣" },
  { video: 1, w: 6, name: "اللوح", num: "٠٤" },
];

const LAST = STATIONS.length - 1;
const TOTAL_W = STATIONS.reduce((s, x) => s + x.w, 0);
// مسافة السكرول لكل وحدة وزن (بوحدات ارتفاع الشاشة) — ~٦٥vh حفاظاً على إيقاع القطرة
const UNIT_VH = 65;
// نطاق تقدّم كل محطة [start,end] من الأوزان التراكمية
const RANGES = (() => {
  let cum = 0;
  return STATIONS.map((s) => {
    const start = cum / TOTAL_W;
    cum += s.w;
    return { start, end: cum / TOTAL_W };
  });
})();

export default function OpeningCluster() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-1);

  useEffect(() => {
    const wrap = wrapRef.current;
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!wrap || !vA || !vB) return;

    const videos = [vA, vB];

    // نخدم نسخة الموبايل الخفيفة (720p) للشاشات الصغيرة والديسكتوب النسخة الكاملة
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      vA.src = withV("/videos/web/drop-to-desert.mp4");
      vB.src = withV("/videos/web/panel.mp4");
    }

    // ─── محرك فريمات WebP للموبايل (سلس 60fps مثل أبل) ───
    const engines: FrameScrubHandle[] = [];
    if (isMobile && vA && vB) {
      const frameConfigs = [
        { video: vA, folder: "drop-to-desert", count: 241 },
        { video: vB, folder: "panel", count: 241 },
      ];
      frameConfigs.forEach((cfg) => {
        const e = createFrameScrubHandle(cfg.video, cfg.folder, cfg.count);
        e.start();
        engines.push(e);
      });
    }

    // ─── تدفئة: «نمرّ على الفيديو» نيابةً عن المستخدم قبل أن يصل (ديسكتوب فقط) ───
    const firstVisit =
      typeof sessionStorage !== "undefined" && !sessionStorage.getItem("atg-loaded");
    const warms: Array<{ cancel: () => void; active: () => boolean }> = [];
    const warming = () => warms.some((w) => w.active());

    const START = [0.17, 0];

    const bounds = videos.map((_, vi) => {
      const idxs = STATIONS.map((s, i) => (s.video === vi ? i : -1)).filter((i) => i >= 0);
      return { start: RANGES[Math.min(...idxs)].start, end: RANGES[Math.max(...idxs)].end, vi };
    });

    const durations = videos.map(() => 0);
    if (!isMobile) {
      videos.forEach((v, i) => {
        const grab = () => {
          durations[i] = v.duration || 0;
        };
        if (v.readyState >= 1) grab();
        else v.addEventListener("loadedmetadata", grab, { once: true });
        v.pause();
      });
    }

    // كشف نص المحطة + مسار الرحلة (تبديل عند تغيّر المحطة فقط)
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
    };

    // القلب: يربط فريم الفيديو بموضع السكرول — مجمّد عند الوقوف، يمشي مع السكرول
    let ticking = false;
    const recompute = () => {
      ticking = false;
      const vh = window.innerHeight;
      const scrollable = wrap.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-wrap.getBoundingClientRect().top, 0), scrollable);
      const progress = scrollable > 0 ? scrolled / scrollable : 0;

      // الفيديو الفعّال حسب مدى السكرول
      const b = bounds.find((x) => progress < x.end) ?? bounds[bounds.length - 1];
      const local = Math.min(1, Math.max(0, (progress - b.start) / (b.end - b.start)));
      const v = videos[b.vi];
      const offset = START[b.vi] ?? 0;
      const dur = durations[b.vi] || v.duration || 10;
      const targetTime = offset + local * Math.max(0.1, dur - offset - 0.05);
      if (engines.length) {
        // ── موبايل: محرك فريمات WebP يتولى العرض بسلاسة مطلقة 60fps ──
        engines[b.vi]?.seekTo(local);
        engines.forEach((e, i) => e.setOpacity(i <= b.vi ? "1" : "0"));
      } else {
        // ── ديسكتوب: السلوك الأصلي بلا تغيير ──
        if (v.readyState >= 1 && !v.seeking && !warming()) {
          if (Math.abs(v.currentTime - targetTime) > 0.015) v.currentTime = targetTime;
        }
        videos.forEach((vv, i) => {
          vv.style.opacity = i <= b.vi ? "1" : "0";
        });
      }

      // مسار الرحلة (تعبئة مستمرة) + كشف النص (المحطة التي يقع التقدّم في نطاقها)
      if (railFillRef.current)
        railFillRef.current.style.transform = `scaleY(${progress})`;
      if (hintRef.current) hintRef.current.style.opacity = progress < 0.03 ? "1" : "0";
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
    // الموبايل يسحب الإطارات كالديسكتوب الآن، فيحتاج التدفئة بنفس القدر.
    if (firstVisit) {
      // اللودر يغطّي المشهد — نمرّ على الاثنين بالتتابع بلا أي غطاء إضافي
      warms.push(warmSequentially([vA, vB], recompute));
    } else {
      // لا لودر: نغطّي القطرة بصورتها الثابتة أثناء مرورها، ثم اللوح (مخفي أصلاً)
      warms.push(
        warmBehindPoster(vA, () => {
          warms.push(warmSequentially([vB], recompute));
        })
      );
    }

    // عند توفّر أول إطار قابل للعرض، اضبط الحالة الابتدائية
    const kick = () => recompute();
    vA.addEventListener("loadeddata", kick, { once: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    recompute();

    return () => {
      engines.forEach((e) => e.destroy());
      warms.forEach((w) => w.cancel());
      vA.removeEventListener("loadeddata", kick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      id="hero"
      className="relative bg-ivory"
      style={{ height: `${TOTAL_W * UNIT_VH + 100}vh` }}
    >
      {/* ═══ المسرح الثابت — يبقى في الشاشة بينما يمرّ القسم بالسكرول ═══ */}
      <div className="hero-stage sticky top-0 h-screen overflow-hidden">
        {/* .hero-stage في globals.css = إطار المشهد خلف الفيديو (نسخة لكل شاشة) */}
        {/* الفيديوهات (خلفية سينمائية — المحتوى في النصوص) */}
        {/* المصدر يُضبط في الإفكت حسب حجم الشاشة (موبايل ٧٢٠p / ديسكتوب كامل) */}
        <video
          ref={videoARef}
          className="absolute inset-0 size-full object-cover opacity-100"
          poster="/videos/web/posters/drop-to-desert.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        <video
          ref={videoBRef}
          className="absolute inset-0 size-full object-cover opacity-0"
          poster="/videos/web/posters/panel.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        {/* طبقة السينما: حبيبات + فينييت */}
        <div className="film-grain pointer-events-none absolute inset-0 z-10" />
        <div className="warm-vignette pointer-events-none absolute inset-0 z-10" />

        {/* ═══ نصوص المحطات — كل محطة بموضعها التحريري ═══ */}

        {/* ٠١ القطرة — العنوان فوق القطرة والوصف أسفل القطرة (متقاربان بتوازن دقيق) */}
        <div
          ref={(el) => {
            textRefs.current[0] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between pt-20 pb-36 text-center transition-[opacity,transform] duration-700 ease-out md:items-start md:justify-center md:py-0 md:ps-[7vw] md:text-right"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.5]">
            <span className="font-normal block text-ink/90 drop-shadow-sm">من قطرةِ ماءٍ…</span>
            <span className="gold-metallic font-bold block mt-1">تبدأ الحكاية</span>
          </h1>
          <p className="max-w-xs font-body text-sm md:text-base font-normal text-ink/80 leading-relaxed">
            رحلة من الشمس إلى الماء،
            <br />
            نرويها كما نبني أنظمتنا: بإتقان
          </p>
        </div>

        {/* ٠٢ الاقتراب — بدون بطاقة وفي مساحة الماء الشفافة العلوية */}
        <div
          ref={(el) => {
            textRefs.current[1] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-20 text-center opacity-0 transition-[opacity,transform] duration-700 ease-out px-6 md:justify-center md:pt-0"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#185F74] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            الاقتراب
          </span>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl font-semibold text-ink leading-snug drop-shadow-sm">
            داخل كلِّ قطرةٍ يختبئ عالمٌ كامل
          </h2>
          <p className="mt-3 font-body text-sm md:text-base font-medium text-ink/85 max-w-sm">
            التفاصيل الصغيرة تصنع المشاريع العظيمة
          </p>
        </div>

        {/* ٠٣ الصحراء — لحظة الكشف: العنوان الملحمي فوق السماء */}
        <div
          ref={(el) => {
            textRefs.current[2] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-24 md:pt-28 text-center px-6 opacity-0 transition-[opacity,transform] duration-700 ease-out"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0B7A5C] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            في قلب الصحراء
          </span>
          <h2 className="mt-4 font-heading text-4xl md:text-6xl lg:text-7xl leading-[1.3] max-w-5xl text-center flex flex-col items-center justify-center">
            <span className="gold-metallic font-normal block text-center w-full">شريككم الأمثل في</span>
            <span className="text-ink font-bold block mt-2 text-center w-full">أنظمة الطاقة الشمسية</span>
          </h2>
          <p className="mt-5 font-body text-sm md:text-lg font-normal text-ink/80 max-w-xl leading-relaxed">
            منذ ٢٠١٧ — من الأردن إلى السعودية، وأكثر من ٢٠ ميجاوات تشهد
          </p>
        </div>

        {/* ٠٤ اللوح — بوضوح وتباين ناصع فوق خلفية الألواح */}
        <div
          ref={(el) => {
            textRefs.current[3] = el;
          }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end pb-32 text-center opacity-0 transition-[opacity,transform] duration-700 ease-out md:items-start md:justify-center md:pb-0 md:ps-[6vw] md:text-right px-6"
          style={{ transform: "translateY(24px)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#185F74] px-5 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20 tracking-[0.2em]">
            <span className="block size-1.5 rotate-45 bg-ivory" />
            التقنية
          </span>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl leading-snug">
            <span className="font-semibold block text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">ألواحُ الجيلِ الأحدث</span>
            <span className="gold-metallic font-bold block mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              تُترجم الشمسَ إلى قوة
            </span>
          </h2>
          <p className="mt-4 max-w-sm font-body text-sm md:text-base font-medium text-ivory/90 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            كفاءةٌ حتى ٢٥٪ وضماناتٌ تمتد ٣٠ عاماً — بشراكة{" "}
            <span dir="ltr" className="font-bold text-ivory">
              Jinko · LONGi · AiKO · Sofar
            </span>
          </p>
        </div>

        {/* ═══ التوقيع: مسار الرحلة — سكة ذهبية بمعيّنات على الحافة اليسرى ═══ */}
        <div className="absolute top-1/2 z-30 -translate-y-1/2 end-4 md:end-8">
          <div className="relative flex h-52 md:h-60 flex-col items-start justify-between">
            {/* السكة خلف المعيّنات */}
            <span className="absolute bottom-0 top-0 start-[5px] w-px bg-ochre/30" />
            <span
              ref={railFillRef}
              className="absolute bottom-0 top-0 start-[5px] w-px origin-top bg-ochre-deep transition-transform duration-700 ease-out"
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
                <span className="block size-2.5 rotate-45 border border-ochre-deep bg-ivory transition-all duration-500 group-data-[on=true]:bg-ochre-deep group-data-[on=true]:shadow-[0_0_12px_rgba(184,146,63,0.6)]" />
                <span className="hidden md:block leading-none opacity-40 transition-opacity duration-500 group-data-[on=true]:opacity-100">
                  <span className="block font-body text-[0.6rem] text-ink/50">{st.num}</span>
                  <span className="mt-0.5 block font-body text-[0.72rem] font-bold text-ink/80">
                    {st.name}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* مؤشر السكرول */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/60 transition-opacity duration-500"
        >
          <span className="font-accent text-base">اكتشفِ الرحلة</span>
          <span className="block h-10 w-[2px] overflow-hidden rounded bg-ink/15">
            <span className="block h-4 w-full animate-bounce bg-ochre-deep" />
          </span>
        </div>
      </div>
    </section>
  );
}
