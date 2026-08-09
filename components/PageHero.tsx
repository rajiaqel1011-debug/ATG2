import Link from "next/link";
import Reveal from "@/components/Reveal";

/** ترويسة صفحة موحّدة — خلفية فاتحة (ليقرأ الناف بار الشفاف)، مسار تنقّل،
 *  كِكر بمعيّن، عنوان كبير، وسطر تعريفي. تُفرِّغ ارتفاع الناف بار الثابت. */
export default function PageHero({
  kicker,
  title,
  highlight,
  subtitle,
  crumb,
}: {
  kicker: string;
  title: string;
  highlight?: string;
  subtitle: string;
  crumb: string;
}) {
  return (
    <section className="pattern-dunes relative overflow-hidden bg-ivory-soft px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
      {/* توهّج شمسي علوي ناعم */}
      <div
        className="pointer-events-none absolute -top-40 start-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(213,175,102,0.18),transparent_65%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        {/* مسار التنقّل */}
        <Reveal>
          <nav
            aria-label="مسار التنقّل"
            className="flex items-center gap-2 font-body text-xs font-medium text-ink/50"
          >
            <Link href="/" className="transition-colors hover:text-ochre-deep">
              الرئيسية
            </Link>
            <span className="text-ochre-deep">/</span>
            <span className="text-ink/70">{crumb}</span>
          </nav>

          {/* الكِكر */}
          <div className="mt-8 flex items-center gap-3">
            <span className="block size-2 rotate-45 bg-ochre-deep" />
            <span className="font-body text-sm font-medium tracking-[0.25em] text-oasis">
              {kicker}
            </span>
          </div>

          {/* العنوان */}
          <h1 className="mt-6 font-heading text-4xl md:text-6xl lg:text-7xl text-ink leading-[1.25] max-w-4xl">
            <span className="font-normal">{title}</span>
            {highlight ? (
              <>
                {" "}
                <span className="text-ochre-deep font-bold">{highlight}</span>
              </>
            ) : null}
          </h1>

          {/* السطر التعريفي */}
          <p className="mt-7 max-w-2xl font-body text-lg font-normal leading-loose text-ink/70">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
