import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { v as withV } from "@/components/assetVersion";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "ATG — Advanced Technology Green — تأسست 2017 في الأردن وتوسّعت إلى السعودية 2025. قصتنا، رؤيتنا، خطنا الزمني، وفريقنا الهندسي في أنظمة الطاقة الشمسية وضخ المياه.",
};

const timeline = [
  {
    year: "٢٠١٧",
    t: "الانطلاقة من الأردن",
    d: "تأسست ATG على يد كوادر هندسية بخبرة عميقة في الطاقة المتجددة، بتركيز مبكّر على أنظمة الضخ والأنظمة المنفصلة.",
  },
  {
    year: "٢٠١٨–٢٠٢٤",
    t: "ترسيخ التخصص",
    d: "تنفيذ أكثر من ٢٠٠ منظومة ضخ شمسي وأنظمة off-grid عبر مواقع زراعية ونائية — بناء سمعة على الإتقان لا الحجم.",
  },
  {
    year: "٢٠٢٥",
    t: "التوسّع إلى السعودية",
    d: "دخول السوق السعودي كسوق رئيسي، بالتوافق مع الكود السعودي ومستهدفات رؤية ٢٠٣٠ للطاقة النظيفة.",
  },
  {
    year: "٢٠٢٦",
    t: "أكثر من ٢٠ ميجاوات",
    d: "إنجاز ما يزيد على ٢٠ ميجاوات في أول عام سعودي، مع خطة توسّع خليجية مدروسة.",
  },
];

const stats = [
  { prefix: "+", num: 20, unit: "ميجاوات", label: "منجزة في السعودية خلال العام الأول" },
  { prefix: "+", num: 200, unit: "مشروع", label: "منظومة ضخ شمسي منفّذة" },
  { prefix: "+", num: 8, unit: "سنوات", label: "خبرة ميدانية منذ 2017" },
  { prefix: "", num: 2, unit: "دولة", label: "حضور عملياتي فعلي" },
];

const values = [
  { t: "تخصصٌ لا تعميم", d: "عمقنا الحقيقي في ضخ المياه والأنظمة المنفصلة — نتقن ما نَعِد به." },
  { t: "هندسة تقود التنفيذ", d: "مهندسون مرخّصون يديرون المشروع من الدراسة إلى التشغيل، لا عمّال تركيب فقط." },
  { t: "شراكات عالمية", d: "نورّد من الصف الأول عالمياً — لا وسطاء ولا بدائل مجهولة المصدر." },
  { t: "ما بعد التسليم", d: "صيانة دورية ودعم فني مستمر — الشراكة لا تنتهي عند التشغيل." },
];

const partners = ["Jinko Solar", "LONGi", "AiKO", "Sofar", "VEICHI", "DC Cable — UCIC"];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="من نحن"
        kicker="من نحن"
        title="طاقةٌ نظيفة،"
        highlight="ومياهٌ تروي المستقبل"
        subtitle="ثماني سنواتٍ من الهندسة الميدانية علّمتنا أن الطاقة الشمسية ليست منتجاً يُباع، بل التزامٌ يُبنى — من قطرة ماء في الصحراء إلى منظومةٍ تعمل بلا انقطاع."
      />

      {/* ═══ بانر سينمائي للمهندسين والميدان ═══ */}
      <section className="relative bg-ivory px-6 pt-12 pb-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-ochre/30 shadow-2xl">
              <Image
                src={withV("/images/about/hero-banner.jpg")}
                alt="مهندسو ATG في الميدان"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-6 start-6 md:bottom-10 md:start-10 max-w-lg">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0B7A5C] px-4 py-1.5 font-body text-xs font-bold text-ivory shadow-lg">
                  <span className="block size-1.5 rotate-45 bg-ivory" />
                  كوادر هندسية مرخّصة
                </span>
                <h3 className="mt-3 font-heading text-xl md:text-3xl font-bold text-ivory leading-snug">
                  خبرة ميدانية هندسية تقود التحول الزراعي والتجاري
                </h3>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ القصة ═══ */}
      <section className="relative bg-ivory px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 items-center">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block size-2 rotate-45 bg-ochre-deep" />
              <span className="font-body text-xs font-bold tracking-[0.25em] text-[#185F74] uppercase">
                قصتنا
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl md:text-4xl font-bold text-ink leading-snug">
              وُلدنا من حاجةٍ حقيقية:
              <span className="text-ochre-deep block mt-1"> ماءٌ حيث لا شبكة</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 font-body text-base md:text-lg font-normal leading-loose text-ink/75 rounded-3xl border border-ochre/20 bg-ivory-soft p-8 md:p-10 shadow-sm">
              <p>
                <strong className="text-ink font-semibold">ATG — Advanced Technology Green</strong> شركة متخصصة في أنظمة الطاقة
                الشمسية، تأسست عام 2017 في المملكة الأردنية الهاشمية على يد
                كوادر هندسية تمتلك خبرة عميقة في قطاع الطاقة المتجددة.
              </p>
              <p>
                بدأنا من حيث تكون الحاجة أشدّ — الري الزراعي والمواقع البعيدة عن
                الشبكة — فترسّخ تخصصنا في ضخ المياه بالطاقة الشمسية والأنظمة
                المنفصلة، حتى صار اسمنا مقروناً بالإتقان والالتزام.
              </p>
              <p>
                وفي عام 2025 توسّعنا نحو المملكة العربية السعودية لتنفّذ ATG
                أكثر من 20 ميجاوات في عامها الأول — بالتوافق مع الكود السعودي
                ومستهدفات رؤية 2030 نحو مزيجٍ أنظف للطاقة.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ الخط الزمني ═══ */}
      <section className="relative overflow-hidden bg-ivory-soft px-6 py-20 md:px-12 md:py-28 border-y border-ochre/20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block size-2 rotate-45 bg-ochre-deep" />
              <span className="font-body text-xs font-bold tracking-[0.25em] text-[#0B7A5C] uppercase">
                مسيرتنا
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-snug">
              من قطرةٍ… إلى منظومة
            </h2>
          </Reveal>

          <div className="relative mt-14 ps-8 md:ps-0">
            {/* السكة العمودية */}
            <span className="absolute bottom-2 top-2 start-[7px] w-px bg-ochre/30 md:start-1/2 md:-translate-x-1/2" />
            <ol className="space-y-10 md:space-y-16">
              {timeline.map((it, i) => (
                <li key={it.year} className="relative md:grid md:grid-cols-2 md:gap-12">
                  {/* المعيّن على السكة */}
                  <span className="absolute -start-8 top-1.5 block size-3.5 rotate-45 border border-ochre-deep bg-ivory md:start-1/2 md:-translate-x-1/2 shadow-md" />
                  <Reveal
                    delay={i * 0.05}
                    className={i % 2 === 0 ? "md:text-left md:pe-12" : "md:col-start-2 md:ps-12"}
                  >
                    <div className="font-heading text-2xl md:text-3xl font-bold text-ochre-deep">
                      {it.year}
                    </div>
                    <h3 className="mt-2 font-heading text-lg md:text-xl font-semibold text-ink">
                      {it.t}
                    </h3>
                    <p className="mt-3 font-body text-sm md:text-base font-normal leading-relaxed text-ink/70">
                      {it.d}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ═══ الرؤية والرسالة ═══ */}
      <section className="relative bg-ivory px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Reveal>
            <div className="group h-full rounded-3xl border border-ochre/30 bg-gradient-to-b from-ivory-soft to-ivory p-8 md:p-12 transition-all duration-500 hover:border-ochre-deep hover:shadow-[0_10px_60px_-24px_rgba(184,146,63,0.5)]">
              <span className="block size-2.5 rotate-45 bg-[#185F74]" />
              <h3 className="mt-5 font-heading text-2xl md:text-3xl font-bold text-ink">
                رؤيتنا
              </h3>
              <p className="mt-4 font-body text-base md:text-lg font-normal leading-loose text-ink/75">
                أن نكون الشريك الأوثق في المنطقة لأنظمة الطاقة الشمسية وضخ
                المياه — نحوّل الشمس إلى ماءٍ وقوةٍ ونموٍّ مستدام، ونُسهم في
                مستقبل طاقةٍ أنظف يخدم رؤية السعودية 2030.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="group h-full rounded-3xl border border-ochre/30 bg-gradient-to-b from-ivory-soft to-ivory p-8 md:p-12 transition-all duration-500 hover:border-ochre-deep hover:shadow-[0_10px_60px_-24px_rgba(184,146,63,0.5)]">
              <span className="block size-2.5 rotate-45 bg-[#0B7A5C]" />
              <h3 className="mt-5 font-heading text-2xl md:text-3xl font-bold text-ink">
                رسالتنا
              </h3>
              <p className="mt-4 font-body text-base md:text-lg font-normal leading-loose text-ink/75">
                نصمّم ونُنفّذ حلول طاقةٍ شمسية موثوقة بمعايير عالمية وكوادر
                هندسية مرخّصة — من الدراسة إلى ما بعد التشغيل — بجداول تُحترم
                ومواصفات لا تقبل التنازل.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ الأرقام ═══ */}
      <section className="relative overflow-hidden bg-ink px-6 py-20 md:px-12 md:py-24">
        <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-6 py-8 text-center ${
                    i !== 0 ? "border-s border-ivory/15" : ""
                  } ${i >= 2 ? "max-lg:border-t max-lg:border-ivory/15" : ""} ${
                    i === 2 ? "max-lg:border-s-0" : ""
                  }`}
                >
                  <CountUp
                    to={s.num}
                    prefix={s.prefix}
                    className="block font-heading text-5xl md:text-6xl font-bold text-ochre leading-none"
                  />
                  <div className="mt-2 font-body text-sm font-medium tracking-widest text-ochre/80">
                    {s.unit}
                  </div>
                  <p className="mt-3 font-body text-xs md:text-sm font-normal leading-relaxed text-ivory/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ القيم ═══ */}
      <section className="relative bg-ivory-soft px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block size-2 rotate-45 bg-ochre-deep" />
              <span className="font-body text-xs font-bold tracking-[0.25em] text-[#185F74] uppercase">
                قيمنا
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-snug">
              لا نبيع ألواحاً… <span className="text-ochre-deep">نبني شراكاتٍ تدوم</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-12 gap-y-2 md:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={(i % 2) * 0.08}>
                <div className="group flex gap-5 border-b border-ochre/20 py-6">
                  <span className="mt-1.5 block size-2.5 shrink-0 rotate-45 border border-ochre-deep bg-transparent transition-all duration-500 group-hover:bg-ochre-deep group-hover:shadow-[0_0_12px_rgba(184,146,63,0.5)]" />
                  <div>
                    <h3 className="font-heading text-lg md:text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-ochre-deep">
                      {v.t}
                    </h3>
                    <p className="mt-2 font-body text-sm md:text-base font-normal leading-relaxed text-ink/65">
                      {v.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* شركاء النجاح */}
          <Reveal className="mt-20">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-ochre/30" />
              <span className="font-body text-xs font-bold tracking-[0.3em] text-ink/60">
                شركاء النجاح
              </span>
              <span className="h-px flex-1 bg-ochre/30" />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {partners.map((p) => (
                <span
                  key={p}
                  dir="ltr"
                  className="group flex items-center gap-2 rounded-full border border-ochre/30 bg-ivory px-5 py-2.5 font-body text-base md:text-lg font-bold tracking-wide text-ink/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-ochre-deep hover:text-ochre-deep hover:shadow-[0_6px_20px_-8px_rgba(184,146,63,0.5)]"
                >
                  <span className="block size-1.5 rotate-45 bg-ochre/40 transition-colors duration-300 group-hover:bg-ochre-deep" />
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
