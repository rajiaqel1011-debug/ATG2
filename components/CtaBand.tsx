import Link from "next/link";
import Reveal from "@/components/Reveal";

/** شريط دعوة للتواصل — يُختم به كل صفحة داخلية */
export default function CtaBand({
  title = "جاهزون لتحويل الشمس إلى قيمة؟",
  subtitle = "احكِ لنا عن مشروعك، ويتواصل معك فريقنا الهندسي بدراسة مبدئية وعرض واضح.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 md:px-12 md:py-28">
      {/* توهّج ذهبي */}
      <div
        className="pointer-events-none absolute start-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(213,175,102,0.16),transparent_62%)]"
        aria-hidden
      />
      <div className="film-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="mx-auto flex w-fit items-center gap-3">
            <span className="block size-2 rotate-45 bg-ochre" />
            <span className="font-body text-sm font-medium tracking-[0.25em] text-ochre">
              الخطوة التالية
            </span>
            <span className="block size-2 rotate-45 bg-ochre" />
          </div>
          <h2 className="ivory-cinema mt-6 font-heading text-3xl md:text-5xl font-bold leading-snug">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-base md:text-lg font-normal leading-loose text-ivory/70">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-ochre-deep px-8 py-3.5 font-body font-bold text-ivory transition-all hover:bg-ochre hover:text-ink hover:shadow-[0_10px_40px_-12px_rgba(213,175,102,0.6)]"
            >
              اطلب عرض سعر
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-ivory/30 px-8 py-3.5 font-body font-semibold text-ivory/90 transition-colors hover:border-ochre hover:text-ochre"
            >
              شاهد أعمالنا
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
