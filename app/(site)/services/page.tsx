import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "خدماتنا",
  description:
    "خدمات ATG: ضخ المياه بالطاقة الشمسية، أنظمة EPC المتكاملة، الأنظمة المنفصلة عن الشبكة (Off-Grid)، وتوريد الهياكل المعدنية — بمعايير عالمية وكوادر هندسية مرخّصة.",
};

const services = [
  {
    id: "pumping",
    num: "٠١",
    tag: "Solar Pumping",
    star: true,
    img: "/images/services/service-pumping.jpg",
    title: "أنظمة ضخ المياه بالطاقة الشمسية",
    desc: "قلب تخصصنا وأكثر خدماتنا طلباً — أنظمة ضخ مباشرة، مع تخزين، وهجينة؛ بمضخات غاطسة وسطحية تغطي قدرات تصل حتى ١٠٠٠ حصان. نخدم الري الزراعي، مشاريع المياه الجوفية، والمناطق البعيدة عن شبكة المياه.",
    points: [
      "انفرترات VEICHI SI23 بتقنية MPPT",
      "ضخ مباشر بلا بطاريات — اقتصادي للري",
      "أنظمة هجينة بانقطاعٍ صفري",
      "خبرة +٢٠٠ منظومة منفّذة",
    ],
  },
  {
    id: "epc",
    num: "٠٢",
    tag: "EPC",
    star: false,
    img: "/images/services/service-epc.jpg",
    title: "أنظمة الطاقة الشمسية المتكاملة",
    desc: "من دراسة الموقع وتحليل الإشعاع، إلى التصميم الهندسي والتوريد والتركيب والتسليم — منظومات سكنية وتجارية وزراعية وفق الكود السعودي والمعايير الدولية.",
    points: [
      "دراسة فنية واقتصادية مع تحليل العائد",
      "مخططات معتمدة ووثائق تسليم كاملة",
      "تدريب تشغيل وخطة صيانة وقائية",
    ],
  },
  {
    id: "offgrid",
    num: "٠٣",
    tag: "Off-Grid",
    star: false,
    img: "/images/services/service-offgrid.jpg",
    title: "الأنظمة المنفصلة عن الشبكة",
    desc: "حلول طاقة كاملة للمواقع البعيدة عن الشبكة: المزارع النائية، المخيمات، محطات الاتصالات، والقرى — طاقة لا تنقطع أينما كنت.",
    points: [
      "بطاريات ليثيوم LFP بإدارة BMS ذكية",
      "مراقبة عن بُعد على مدار الساعة",
      "تصميم هجين مع مولد احتياطي عند الحاجة",
    ],
  },
  {
    id: "structures",
    num: "٠٤",
    tag: "Structures",
    star: false,
    img: "/images/services/service-structures.jpg",
    title: "توريد الهياكل المعدنية",
    desc: "شبكة موردين معتمدون وهياكل مصمّمة لمناخ الخليج: أرضية، أسطح، مظلات سيارات، وأنظمة Agri-PV — بضمانات صدأ تصل إلى ٢٥ عاماً.",
    points: [
      "فولاذ مغلفن بالغمس الحار وZAM للسواحل",
      "تصميم وفق الكود السعودي للبناء SBC",
      "توريد مباشر لشركات الطاقة الشمسية",
    ],
  },
];

const process = [
  { n: "٠١", t: "الدراسة والتحليل", d: "زيارة الموقع، تحليل الإشعاع والأحمال، ودراسة جدوى فنية واقتصادية." },
  { n: "٠٢", t: "التصميم الهندسي", d: "تصميم المنظومة ومخططاتها المعتمدة وفق الكود السعودي والمعايير الدولية." },
  { n: "٠٣", t: "التوريد", d: "مكوّنات من الصف الأول عالمياً عبر شراكاتٍ مباشرة — لا وسطاء." },
  { n: "٠٤", t: "التركيب", d: "تنفيذ ميداني بإشراف مهندسين مرخّصين والتزام صارم بالجداول." },
  { n: "٠٥", t: "التشغيل والتدريب", d: "اختبارات تشغيل، تسليم موثّق، وتدريب فريق التشغيل." },
  { n: "٠٦", t: "الصيانة والدعم", d: "صيانة وقائية دورية ودعم فني مستمر — الشراكة لا تنتهي عند التشغيل." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="خدماتنا"
        kicker="خدماتنا"
        title="أربع ركائز…"
        highlight="منظومةٌ واحدة"
        subtitle="من ضخ المياه في أعماق الصحراء إلى أنظمة EPC المتكاملة — نغطّي دورة حياة مشروع الطاقة الشمسية كاملة، بتخصصٍ عميق لا تعميم."
      />

      {/* ═══ الخدمات ═══ */}
      <section className="relative bg-ivory px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.08}>
              <article
                id={s.id}
                className={`shine group relative scroll-mt-28 overflow-hidden rounded-3xl border p-6 md:p-10 transition-all duration-500 ${
                  s.star
                    ? "border-ochre/40 bg-gradient-to-b from-ivory-soft to-ivory shadow-[0_4px_60px_-20px_rgba(184,146,63,0.35)] hover:border-ochre-deep hover:shadow-[0_10px_70px_-18px_rgba(184,146,63,0.5)]"
                    : "border-ochre/25 bg-ivory-soft hover:border-ochre-deep/60 hover:shadow-[0_8px_50px_-24px_rgba(184,146,63,0.4)]"
                }`}
              >
                <span className="absolute top-6 start-8 font-heading text-7xl md:text-8xl font-normal text-ochre/15 select-none">
                  {s.num}
                </span>

                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  {/* النص والميزات */}
                  <div className="lg:col-span-7">
                    {s.star && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-ochre-deep px-4 py-1.5 font-body text-xs font-semibold text-ivory">
                        <span className="block size-1.5 rotate-45 bg-ivory" />
                        الخدمة الأبرز
                      </span>
                    )}
                    <div className={s.star ? "mt-4" : ""}>
                      <span dir="ltr" className="font-body text-[0.65rem] font-semibold tracking-[0.25em] text-oasis">
                        {s.tag}
                      </span>
                    </div>
                    <h2 className="mt-2 font-heading text-2xl md:text-4xl font-bold text-ink leading-snug">
                      {s.title}
                    </h2>
                    <span className="mt-4 block h-0.5 w-12 origin-right bg-ochre-deep transition-all duration-500 group-hover:w-28" />
                    <p className="mt-5 font-body text-base md:text-lg font-normal leading-loose text-ink/75">
                      {s.desc}
                    </p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2 font-body text-sm font-normal text-ink/80">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2.5 rounded-lg bg-ivory/60 px-3 py-2 border border-ochre/15">
                          <span className="block size-1.5 shrink-0 rotate-45 bg-ochre-deep" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* الصورة السينمائية عالية الجودة */}
                  <div className="lg:col-span-5">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ochre/30 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.img}
                        alt={s.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60" />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ كيف نعمل ═══ */}
      <section className="relative overflow-hidden bg-ivory-soft px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block size-2 rotate-45 bg-ochre-deep" />
              <span className="font-body text-sm font-medium tracking-[0.25em] text-oasis">
                منهجيتنا
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-snug">
              ستّ خطواتٍ… <span className="text-ochre-deep">من الفكرة إلى الريّ</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((p, i) => (
              <Reveal key={p.n} delay={(i % 3) * 0.08}>
                <div className="group relative">
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-4xl font-normal text-ochre/40 transition-colors duration-500 group-hover:text-ochre-deep">
                      {p.n}
                    </span>
                    <span className="h-px flex-1 bg-ochre/25 transition-colors group-hover:bg-ochre-deep/50" />
                    <span className="block size-2 rotate-45 bg-ochre-deep/60" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-semibold text-ink">
                    {p.t}
                  </h3>
                  <p className="mt-3 font-body text-sm md:text-base font-normal leading-relaxed text-ink/70">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="عندك موقع يحتاج طاقة أو ماء؟"
        subtitle="أرسل تفاصيل مشروعك ونبدأ بدراسةٍ مبدئية تحدّد الحل الأنسب والعائد المتوقّع."
      />
    </>
  );
}
