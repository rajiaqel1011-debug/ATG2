import Link from "next/link";
import { v as withV } from "@/components/assetVersion";

const siteLinks = [
  { l: "الرئيسية", h: "/" },
  { l: "من نحن", h: "/about" },
  { l: "خدماتنا", h: "/services" },
  { l: "مشاريعنا", h: "/projects" },
  { l: "تواصل معنا", h: "/contact" },
];

const serviceLinks = [
  { l: "ضخ المياه بالطاقة الشمسية", h: "/services#pumping" },
  { l: "أنظمة EPC المتكاملة", h: "/services#epc" },
  { l: "الأنظمة المنفصلة عن الشبكة", h: "/services#offgrid" },
  { l: "توريد الهياكل المعدنية", h: "/services#structures" },
];

/** فوتر الموقع المشترك — يظهر في كل الصفحات عبر layout المجموعة */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-6 pt-20 pb-8 md:px-12">
      {/* باترن التموّجات — النسخة البيضا الأنيقة على الخلفية الداكنة */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/brand/ripples-white.webp')] bg-[length:1000px_auto] bg-left-top bg-no-repeat opacity-[0.22]"
        aria-hidden
      />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />
      {/* شريط ذهبي علوي رفيع */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-ochre-deep to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* الهوية — اللوغو الأبيض */}
          <div>
            <Link href="/" aria-label="ATG — Advanced Technology Green — الرئيسية">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withV("/images/Approved-white.svg")}
                alt="ATG — Advanced Technology Green"
                className="h-12 w-auto md:h-14 opacity-90"
                width={435}
                height={171}
              />
            </Link>
            <p className="mt-6 max-w-xs font-body text-sm font-normal leading-relaxed text-ivory/60">
              شريككم الأمثل في أنظمة الطاقة الشمسية — من التصميم الهندسي إلى ما
              بعد التشغيل. من الأردن إلى السعودية ودول الخليج.
            </p>
          </div>

          {/* روابط الموقع */}
          <nav aria-label="روابط الفوتر">
            <h3 className="font-heading text-sm font-semibold text-ivory/90">
              الموقع
            </h3>
            <ul className="mt-5 space-y-3 font-body text-sm font-normal text-ivory/60">
              {siteLinks.map((x) => (
                <li key={x.h}>
                  <Link
                    href={x.h}
                    className="inline-flex items-center gap-2 transition-colors hover:text-ochre"
                  >
                    <span className="block size-1 rotate-45 bg-ochre/60" />
                    {x.l}
                  </Link>
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
              {serviceLinks.map((s) => (
                <li key={s.h}>
                  <Link
                    href={s.h}
                    className="inline-flex items-center gap-2 transition-colors hover:text-ochre"
                  >
                    <span className="block size-1 rotate-45 bg-ochre/60" />
                    {s.l}
                  </Link>
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
              <li className="pt-1">
                <a
                  href="mailto:info@atggreen.com"
                  className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-ochre hover:underline"
                >
                  ✉️ info@atggreen.com
                </a>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full border border-ochre/50 px-5 py-2.5 font-body text-sm font-semibold text-ochre transition-colors hover:bg-ochre hover:text-ink"
            >
              اطلب عرض سعر
            </Link>
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
  );
}
