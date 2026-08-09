import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import OpeningCluster from "@/components/OpeningCluster";
import ClimaxCluster from "@/components/ClimaxCluster";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import CountUp from "@/components/CountUp";
import GoldRule from "@/components/GoldRule";
import RouteScrollReset from "@/components/RouteScrollReset";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { v as withV } from "@/components/assetVersion";

const stats = [
  { prefix: "+", num: 20, unit: "ميجاوات", label: "منجزة في السعودية خلال العام الأول" },
  { prefix: "+", num: 200, unit: "مشروع", label: "منظومة ضخ شمسي في الأردن والسعودية" },
  { prefix: "+", num: 8, unit: "سنوات", label: "خبرة ميدانية متراكمة منذ 2017" },
  { prefix: "", num: 2, unit: "دولة", label: "حضور عملياتي فعلي وخطة توسع خليجية" },
];

const services = [
  {
    num: "٠٢",
    title: "أنظمة الطاقة الشمسية المتكاملة",
    tag: "EPC",
    desc: "من دراسة الموقع وتحليل الإشعاع، إلى التصميم الهندسي والتوريد والتركيب والتسليم — منظومات سكنية وتجارية وزراعية وفق الكود السعودي والمعايير الدولية.",
    points: ["دراسة فنية واقتصادية مع تحليل العائد", "مخططات معتمدة ووثائق تسليم كاملة", "تدريب تشغيل وخطة صيانة وقائية"],
  },
  {
    num: "٠٣",
    title: "الأنظمة المنفصلة عن الشبكة",
    tag: "Off-Grid",
    desc: "حلول طاقة كاملة للمواقع البعيدة عن الشبكة: المزارع النائية، المخيمات، محطات الاتصالات، والقرى — طاقة لا تنقطع أينما كنت.",
    points: ["بطاريات ليثيوم LFP بإدارة BMS ذكية", "مراقبة عن بُعد على مدار الساعة", "تصميم هجين مع مولد احتياطي عند الحاجة"],
  },
  {
    num: "٠٤",
    title: "توريد الهياكل المعدنية",
    tag: "Structures",
    desc: "شبكة موردين معتمدون وهياكل مصمّمة لمناخ الخليج: أرضية، أسطح، مظلات سيارات، وأنظمة Agri-PV — بضمانات صدأ تصل إلى ٢٥ عاماً.",
    points: ["فولاذ مغلفن بالغمس الحار وZAM للسواحل", "تصميم وفق الكود السعودي للبناء SBC", "توريد مباشر لشركات الطاقة الشمسية"],
  },
];

const partners = ["Jinko Solar", "LONGi", "AiKO", "Sofar", "VEICHI", "DC Cable — UCIC"];

const whyPoints = [
  { t: "تخصصٌ لا تعميم", d: "عمقنا الحقيقي في ضخ المياه والأنظمة المنفصلة — نتقن ما نَعِد به" },
  { t: "أرقامٌ تشهد", d: "أكثر من ٢٠ ميجاوات في أول عام سعودي، و+٢٠٠ منظومة ضخ منفّذة" },
  { t: "شراكات عالمية", d: "نورّد من الصف الأول عالمياً — لا وسطاء ولا بدائل مجهولة" },
  { t: "التزامٌ صارم", d: "جداول زمنية تُحترم، ومواصفات لا تقبل التنازل" },
  { t: "فريق هندسي", d: "مهندسون مرخّصون يقودون التنفيذ — لا عمال تركيب فقط" },
  { t: "ما بعد التسليم", d: "صيانة دورية ودعم فني مستمر — الشراكة لا تنتهي عند التشغيل" },
];

export default function Home() {
  return (
    <SmoothScroll>
      <RouteScrollReset />
      <Loader />
      <ScrollProgress />
      <main className="flex-1">
        <Navbar />

        {/* ═══════ العنقود الافتتاحي — رحلة المحطات (قطرة → صحراء → لوح) ═══════ */}
        <OpeningCluster />

        {/* ═══════ من نحن + الأرقام (قسم طبيعي — تحريري) ═══════ */}
        <section
          id="about"
          className="pattern-dunes relative bg-ivory py-24 md:py-36 px-6 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="sun-halo">
              {/* ترويسة بمعيّن — نفس موتيف مسار الرحلة */}
              <div className="flex items-center gap-3">
                <span className="block size-2 rotate-45 bg-ochre-deep" />
                <span className="font-body text-sm font-medium tracking-[0.25em] text-oasis">
                  من نحن
                </span>
              </div>

              <h2 className="mt-6 font-heading text-3xl md:text-5xl lg:text-6xl text-ink leading-[1.35] max-w-4xl">
                <span className="font-normal">طاقةٌ نظيفة،</span>
                <span className="text-ochre-deep font-bold"> ومياهٌ تروي المستقبل</span>
              </h2>

              <p className="mt-8 font-body text-lg font-normal leading-loose text-ink/75 max-w-3xl">
                شركة الطاقة الخضراء المتقدمة (ATG) شركة متخصصة في أنظمة الطاقة
                الشمسية، تأسست عام 2017 في المملكة الأردنية الهاشمية على يد كوادر
                هندسية تمتلك خبرة عميقة في قطاع الطاقة المتجددة، وتوسعت عام 2025
                نحو المملكة العربية السعودية لتنفّذ أكثر من 20 ميجاوات في عامها
                الأول.
              </p>
            </Reveal>

            {/* شريط الأرقام — تحريري بلا صناديق، أرقام تُعدّ تصاعدياً */}
            <Reveal className="mt-20">
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`group px-6 py-8 text-center ${
                      i !== 0 ? "border-s border-ochre/30" : ""
                    } ${i >= 2 ? "max-lg:border-t max-lg:border-ochre/30" : ""} ${
                      i === 2 ? "max-lg:border-s-0" : ""
                    }`}
                  >
                    <CountUp
                      to={s.num}
                      prefix={s.prefix}
                      className="block font-heading text-5xl md:text-6xl font-bold text-ochre-deep leading-none transition-transform duration-500 group-hover:-translate-y-1"
                    />
                    <div className="mt-2 font-body text-sm font-medium tracking-widest text-oasis">
                      {s.unit}
                    </div>
                    <p className="mt-3 font-body text-xs md:text-sm font-normal leading-relaxed text-ink/65">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════ عنقود الذروة — رحلة الماء (كابل → بئر → انفجار → مزرعة) ═══════ */}
        <ClimaxCluster />

        {/* ═══════ التحول الميداني قبل وبعد ═══════ */}
        <BeforeAfterSlider />

        {/* ═══════ الخدمات الأربعة (قسم طبيعي — النجمة: ضخ المياه) ═══════ */}
        <section id="services" className="relative overflow-hidden bg-ivory py-24 md:py-36 px-6 md:px-12">
          {/* شعار العجلة المحفور في المنتصف مع نبض ضوء ذهبي خفيف */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 animate-pulse-gold select-none"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withV("/images/icon.svg")}
              alt=""
              className="w-[500px] md:w-[750px] h-auto"
              width={170}
              height={171}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="block size-2 rotate-45 bg-ochre-deep" />
                <span className="font-body text-sm font-medium tracking-[0.25em] text-oasis">
                  خدماتنا
                </span>
              </div>
              <h2 className="mt-6 font-heading text-3xl md:text-5xl lg:text-6xl text-ink leading-[1.35]">
                <span className="font-normal">أربع ركائز…</span>
                <span className="text-ochre-deep font-bold"> منظومةٌ واحدة</span>
              </h2>
            </Reveal>

            {/* ⭐ الخدمة النجمة — ضخ المياه بالطاقة الشمسية */}
            <Reveal className="mt-16">
              <div className="shine group relative overflow-hidden rounded-3xl border border-ochre/40 bg-gradient-to-b from-ivory-soft to-ivory p-8 md:p-14 shadow-[0_4px_60px_-20px_rgba(184,146,63,0.35)] transition-all duration-500 hover:border-ochre-deep hover:shadow-[0_10px_70px_-18px_rgba(184,146,63,0.5)]">
                <span className="absolute top-6 start-8 font-heading text-7xl md:text-8xl font-normal text-ochre/20 select-none">
                  ٠١
                </span>
                <div className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ochre-deep px-4 py-1.5 font-body text-xs font-semibold text-ivory">
                      <span className="block size-1.5 rotate-45 bg-ivory" />
                      الخدمة الأبرز
                    </span>
                    <h3 className="mt-5 font-heading text-2xl md:text-4xl font-bold text-ink leading-snug">
                      أنظمة ضخ المياه
                      <span className="gold-metallic font-bold"> بالطاقة الشمسية</span>
                    </h3>
                    <p className="mt-5 font-body text-base md:text-lg font-normal leading-loose text-ink/75">
                      قلب تخصصنا وأكثر خدماتنا طلباً — أنظمة ضخ مباشرة، مع تخزين،
                      وهجينة؛ بمضخات غاطسة وسطحية تغطي قدرات تصل حتى ١٠٠٠
                      حصان. نخدم الري الزراعي، مشاريع المياه الجوفية، والمناطق
                      البعيدة عن شبكة المياه في المملكة.
                    </p>
                  </div>
                  <ul className="shrink-0 space-y-4 font-body text-sm md:text-base font-normal text-ink/75 md:pt-14">
                    {[
                      "انفرترات VEICHI SI23 بتقنية MPPT",
                      "ضخ مباشر بلا بطاريات — اقتصادي للري",
                      "أنظمة هجينة بانقطاعٍ صفري",
                      "خبرة +٢٠٠ منظومة منفّذة",
                    ].map((p) => (
                      <li key={p} className="flex items-center gap-3">
                        <span className="block size-1.5 shrink-0 rotate-45 bg-ochre-deep" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* بقية الخدمات الثلاث */}
            <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0">
              {services.map((s, i) => (
                <Reveal
                  key={s.num}
                  delay={i * 0.12}
                  className={`group px-0 md:px-8 py-2 md:py-4 ${
                    i !== 0 ? "md:border-s md:border-ochre/30" : "md:ps-0"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-heading text-4xl font-normal text-ochre/40 transition-colors duration-500 group-hover:text-ochre-deep">
                      {s.num}
                    </span>
                    <span dir="ltr" className="font-body text-[0.65rem] font-semibold tracking-[0.2em] text-oasis">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-xl md:text-2xl font-semibold text-ink leading-snug">
                    {s.title}
                  </h3>
                  {/* خط ذهبي يتمدد عند التحويم */}
                  <span className="mt-3 block h-0.5 w-10 origin-right bg-ochre-deep transition-all duration-500 group-hover:w-24" />
                  <p className="mt-4 font-body text-sm font-normal leading-relaxed text-ink/70">
                    {s.desc}
                  </p>
                  <ul className="mt-5 space-y-2.5 font-body text-xs md:text-sm font-normal text-ink/65">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5">
                        <span className="block size-1 shrink-0 rotate-45 bg-ochre-deep" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ لماذا ATG + شركاء النجاح (قسم فاتح — تخطيط: بيانٌ ثابت + قائمة) ═══════ */}
        <section
          id="partners"
          className="relative overflow-hidden bg-ivory-soft py-24 md:py-36 px-6 md:px-12"
        >
          {/* توهّج شمسي علوي ناعم يميّز القسم */}
          <div className="pointer-events-none absolute -top-32 start-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(213,175,102,0.16),transparent_65%)]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-y-14 md:grid-cols-[0.85fr_1.15fr] md:gap-x-16 lg:gap-x-24">
              {/* البيان — ثابت أثناء التمرير على الديسكتوب */}
              <div className="md:sticky md:top-28 md:self-start">
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="block size-2 rotate-45 bg-ochre-deep" />
                    <span className="font-body text-sm font-medium tracking-[0.25em] text-oasis">
                      لماذا نحن
                    </span>
                  </div>
                  <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-[1.35]">
                    <span className="font-normal block">لا نبيع ألواحاً…</span>
                    <span className="text-ochre-deep font-bold">نبني شراكاتٍ تدوم</span>
                  </h2>
                  <p className="mt-6 font-body text-base md:text-lg font-normal leading-loose text-ink/70">
                    ثماني سنواتٍ من الهندسة الميدانية علّمتنا أن الطاقة الشمسية
                    ليست منتجاً يُباع، بل التزامٌ يُبنى. هذه ستةُ أسبابٍ تجعلنا
                    الخيار الأوثق.
                  </p>
                  <a
                    href="#contact"
                    className="mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold text-ochre-deep transition-colors hover:text-ink"
                  >
                    <span className="block size-1.5 rotate-45 bg-ochre-deep" />
                    ابدأ شراكتك معنا
                  </a>
                </Reveal>
              </div>

              {/* قائمة الأسباب — صفوف بفواصل ذهبية */}
              <div>
                {whyPoints.map((w, i) => (
                  <Reveal key={w.t} delay={(i % 2) * 0.08}>
                    <div className="group flex gap-5 border-b border-ochre/20 py-6 first:pt-0 last:border-0">
                      <span className="mt-1.5 block size-2.5 shrink-0 rotate-45 border border-ochre-deep bg-transparent transition-all duration-500 group-hover:bg-ochre-deep group-hover:shadow-[0_0_12px_rgba(184,146,63,0.5)]" />
                      <div>
                        <h3 className="font-heading text-lg md:text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-ochre-deep">
                          {w.t}
                        </h3>
                        <p className="mt-2 font-body text-sm md:text-base font-normal leading-relaxed text-ink/65">
                          {w.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* شركاء النجاح */}
            <Reveal className="mt-24">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-ochre/30" />
                <span className="font-body text-xs font-medium tracking-[0.3em] text-ink/60">
                  شركاء النجاح
                </span>
                <span className="h-px flex-1 bg-ochre/30" />
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {partners.map((p) => (
                  <span
                    key={p}
                    dir="ltr"
                    className="partner-badge group flex items-center gap-2 rounded-full border border-ochre/30 bg-ivory px-5 py-2.5 font-body text-base md:text-lg font-medium tracking-wide text-ink/70 hover:text-ochre-deep"
                  >
                    <span className="block size-1.5 rotate-45 bg-ochre/40 transition-colors duration-300 group-hover:bg-ochre-deep" />
                    {p}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* فاصل التموّجات — توقيع الهوية البصرية للشركة */}
            <Reveal className="mt-16">
              <div
                className="mx-auto aspect-[2334/386] w-full max-w-3xl bg-[url('/images/brand/band.webp')] bg-contain bg-center bg-no-repeat opacity-90"
                aria-hidden
              />
            </Reveal>
          </div>
        </section>

        {/* ═══════ تواصل معنا ═══════ */}
        <section id="contact" className="relative bg-ivory py-24 md:py-32 px-6 md:px-12">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="block size-2 rotate-45 bg-ochre-deep" />
                <span className="font-body text-sm font-medium tracking-[0.25em] text-oasis">
                  تواصل معنا
                </span>
              </div>
              <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-[1.35]">
                <span className="font-normal">لنبدأ الحكاية</span>
                <span className="text-ochre-deep font-bold"> معاً</span>
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              <Reveal delay={0}>
                <div className="group pt-5">
                  <GoldRule className="mb-5" />
                  <h3 className="font-heading text-lg font-semibold text-ink transition-colors group-hover:text-ochre-deep">
                    أسواقنا
                  </h3>
                  <p className="mt-3 font-body text-sm font-normal leading-relaxed text-ink/70">
                    المملكة العربية السعودية — السوق الرئيسي
                    <br />
                    المملكة الأردنية الهاشمية — سوق التأسيس
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="group pt-5">
                  <GoldRule className="mb-5" />
                  <h3 className="font-heading text-lg font-semibold text-ink transition-colors group-hover:text-ochre-deep">
                    أوقات العمل
                  </h3>
                  <p className="mt-3 font-body text-sm font-normal leading-relaxed text-ink/70">
                    السبت – الخميس
                    <br />
                    ٨:٠٠ صباحاً – ٥:٠٠ مساءً
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="group pt-5">
                  <GoldRule className="mb-5" />
                  <h3 className="font-heading text-lg font-semibold text-ink transition-colors group-hover:text-ochre-deep">
                    اطلب عرض سعر
                  </h3>
                  <p className="mt-3 font-body text-sm font-normal leading-relaxed text-ink/70">
                    بيانات التواصل المباشر تُستكمل قريباً —
                    <br />
                    هاتف، واتساب، وبريد رسمي
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════ الفوتر ═══════ */}
        <footer className="relative overflow-hidden bg-ink px-6 pt-20 pb-8 md:px-12">
          {/* باترن التموّجات — النسخة البيضا الأنيقة على الخلفية الداكنة */}
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/images/brand/ripples-white.webp')] bg-[length:1000px_auto] bg-left-top bg-no-repeat opacity-[0.22]"
          />
          <div className="film-grain pointer-events-none absolute inset-0" />
          {/* شريط ذهبي علوي رفيع */}
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-ochre-deep to-transparent" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
              {/* الهوية — اللوغو الأبيض */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/brand/logo-white.png"
                  alt="شركة الطاقة الخضراء المتقدمة — ATG"
                  className="h-12 w-auto md:h-14"
                  width={709}
                  height={233}
                />
                <p className="mt-6 max-w-xs font-body text-sm font-normal leading-relaxed text-ivory/60">
                  شريككم الأمثل في أنظمة الطاقة الشمسية — من التصميم الهندسي إلى
                  ما بعد التشغيل. من الأردن إلى السعودية ودول الخليج.
                </p>
              </div>

              {/* روابط سريعة */}
              <nav aria-label="روابط الفوتر">
                <h3 className="font-heading text-sm font-semibold text-ivory/90">
                  الموقع
                </h3>
                <ul className="mt-5 space-y-3 font-body text-sm font-normal text-ivory/60">
                  {[
                    { l: "من نحن", h: "#about" },
                    { l: "خدماتنا", h: "#services" },
                    { l: "شركاؤنا", h: "#partners" },
                    { l: "تواصل معنا", h: "#contact" },
                  ].map((x) => (
                    <li key={x.h}>
                      <a
                        href={x.h}
                        className="inline-flex items-center gap-2 transition-colors hover:text-ochre"
                      >
                        <span className="block size-1 rotate-45 bg-ochre/60" />
                        {x.l}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* الخدمات */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-ivory/90">
                  خدماتنا
                </h3>
                <ul className="mt-5 space-y-3 font-body text-sm font-normal text-ivory/60">
                  {[
                    "أنظمة EPC المتكاملة",
                    "ضخ المياه بالطاقة الشمسية",
                    "الأنظمة المنفصلة عن الشبكة",
                    "توريد الهياكل المعدنية",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="block size-1 rotate-45 bg-ochre/60" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* تواصل */}
              <div>
                <h3 className="font-heading text-sm font-semibold text-ivory/90">
                  تواصل
                </h3>
                <ul className="mt-5 space-y-3 font-body text-sm font-normal text-ivory/60">
                  <li>المملكة العربية السعودية</li>
                  <li>المملكة الأردنية الهاشمية</li>
                  <li>السبت – الخميس · ٨ص – ٥م</li>
                </ul>
                <a
                  href="#contact"
                  className="mt-6 inline-block rounded-full border border-ochre/50 px-5 py-2.5 font-body text-sm font-semibold text-ochre transition-colors hover:bg-ochre hover:text-ink"
                >
                  اطلب عرض سعر
                </a>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center gap-3 border-t border-ivory/10 pt-8 text-center md:flex-row md:justify-between md:text-right">
              <p className="font-body text-xs font-normal text-ivory/50">
                © ٢٠٢٦ شركة الطاقة الخضراء المتقدمة — ATG · جميع الحقوق محفوظة
              </p>
              <p className="font-body text-xs font-normal text-ivory/40">
                رؤية السعودية ٢٠٣٠ — نحو طاقة أنظف ومستقبل مستدام
              </p>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}
