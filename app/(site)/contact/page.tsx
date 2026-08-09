"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GoldRule from "@/components/GoldRule";
import ContactForm from "@/components/ContactForm";

const info = [
  {
    t: "أسواقنا وحضورنا الميداني",
    lines: [
      "المملكة العربية السعودية — السوق الرئيسي والأنظمة الكبرى",
      "المملكة الأردنية الهاشمية — سوق التأسيس والتطوير الهندسية",
    ],
  },
  {
    t: "أوقات العمل الرسمية",
    lines: ["السبت – الخميس", "٨:٠٠ صباحاً – ٥:٠٠ مساءً"],
  },
  {
    t: "التواصل والخدمة المباشرة",
    lines: ["فريق هندسي متخصص يستجيب لطلباتك", "استشارات ودراسات جدوى مبدئية مجانية"],
  },
];

const faqs = [
  {
    q: "ما القدرات التي تغطّيها أنظمة الضخ لديكم؟",
    a: "نغطّي مدىً واسعاً بقدرات تصل حتى ١٠٠٠ حصان، بمضخات غاطسة وسطحية، وبأنظمة ضخ مباشر أو مع تخزين أو هجينة حسب حاجة الموقع.",
  },
  {
    q: "هل تعملون في السعودية والأردن فقط؟",
    a: "السعودية سوقنا الرئيسي والأردن سوق التأسيس، ولدينا خطة توسّع خليجية. نستقبل طلبات المشاريع الكبيرة في دول الخليج للدراسة.",
  },
  {
    q: "هل تلتزمون بالكود السعودي؟",
    a: "نعم، نصمّم وننفّذ وفق الكود السعودي للبناء (SBC) والمعايير الدولية، مع مخططات معتمدة ووثائق تسليم كاملة.",
  },
  {
    q: "ماذا بعد تركيب النظام؟",
    a: "نقدّم اختبارات تشغيل وتدريباً لفريقكم، ثم صيانة وقائية دورية ودعماً فنياً مستمراً — الشراكة لا تنتهي عند التشغيل.",
  },
  {
    q: "كم تستغرق دراسة المشروع؟",
    a: "بعد استلام بيانات الموقع والاحتياج، نعود بتصوّرٍ هندسي أولي وعرضٍ مبدئي في وقتٍ قصير حسب حجم المشروع.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PageHero
        crumb="تواصل معنا"
        kicker="تواصل معنا"
        title="لنبدأ الحكاية"
        highlight="معاً"
        subtitle="احكِ لنا عن مشروعك — موقعك، احتياجك، والقدرة التقريبية — ويعود إليك فريقنا الهندسي بدراسةٍ مبدئية وعرضٍ واضح."
      />

      {/* ═══ النموذج + البيانات ═══ */}
      <section className="relative bg-ivory px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8">
              {info.map((b) => (
                <div key={b.t} className="pt-2">
                  <GoldRule className="mb-5" />
                  <h3 className="font-heading text-lg font-bold text-ink">
                    {b.t}
                  </h3>
                  <div className="mt-3 space-y-2">
                    {b.lines.map((l) => (
                      <p
                        key={l}
                        className="font-body text-sm md:text-base font-normal leading-relaxed text-ink/75 flex items-center gap-2"
                      >
                        <span className="block size-1.5 rotate-45 bg-[#0B7A5C]" />
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* بطاقة رؤية 2030 */}
              <div className="rounded-3xl border border-ochre/30 bg-ivory-soft p-6 shadow-sm">
                <span className="block size-2.5 rotate-45 bg-[#185F74]" />
                <p className="mt-4 font-body text-sm font-medium leading-relaxed text-ink/80">
                  نعمل بالتوافق التام مع{" "}
                  <span className="font-bold text-ochre-deep">رؤية السعودية ٢٠٣٠</span>{" "}
                  نحو طاقةٍ أنظف ومستقبلٍ زراعي وصناعي مستدام.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ الأسئلة الشائعة التفاعلية ═══ */}
      <section className="relative overflow-hidden bg-ivory-soft px-6 py-20 md:px-12 md:py-28 border-t border-ochre/20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block size-2 rotate-45 bg-ochre-deep" />
              <span className="font-body text-xs font-bold tracking-[0.25em] text-[#0B7A5C] uppercase">
                أسئلة شائعة
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-snug">
              أسئلةٌ… <span className="text-ochre-deep">وأجوبةٌ صريحة</span>
            </h2>
          </Reveal>

          <div className="mt-12 divide-y divide-ochre/20 rounded-3xl border border-ochre/25 bg-ivory p-6 md:p-8 shadow-md">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="py-5 transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 text-right outline-none"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-1.5 block size-2.5 shrink-0 rotate-45 border border-ochre-deep bg-ochre-deep shadow-sm" />
                      <span className="font-heading text-lg md:text-xl font-bold text-ink transition-colors hover:text-ochre-deep">
                        {f.q}
                      </span>
                    </div>
                    <span className="font-heading text-2xl font-bold text-ochre-deep transition-transform duration-300">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 ps-7 font-body text-sm md:text-base font-medium leading-relaxed text-ink/75">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
