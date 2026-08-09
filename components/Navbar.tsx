"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { v as withV } from "@/components/assetVersion";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "خدماتنا", href: "/services" },
  { label: "مشاريعنا", href: "/projects" },
  { label: "تواصل معنا", href: "/contact" },
];

export default function Navbar() {
  const [inHeroVideo, setInHeroVideo] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkVideoSection = () => {
      if (pathname !== "/") {
        setInHeroVideo(false);
        return;
      }
      const targetEl = document.getElementById("before-after") || document.getElementById("services");
      if (targetEl) {
        setInHeroVideo(window.scrollY < targetEl.offsetTop - 80);
      } else {
        setInHeroVideo(window.scrollY < 2000);
      }
    };
    checkVideoSection();
    window.addEventListener("scroll", checkVideoSection, { passive: true });
    window.addEventListener("resize", checkVideoSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkVideoSection);
      window.removeEventListener("resize", checkVideoSection);
    };
  }, [pathname]);

  // قفل تمرير الصفحة عند فتح القائمة + إغلاق بـ Esc
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isHome = pathname === "/";
  const isTransparent = isHome && inHeroVideo && !menuOpen;

  const Logo = (
    <Link
      href="/"
      onClick={() => setMenuOpen(false)}
      aria-label="ATG — Advanced Technology Green — الصفحة الرئيسية"
      className="group flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ochre-deep focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      {/* اللوجو الكامل — ATG — Advanced Technology Green */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withV("/images/Approved.svg")}
        alt="ATG — Advanced Technology Green"
        className="h-10 md:h-12 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
        width={435}
        height={171}
      />
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[100] transition-all duration-300">
      <nav
        aria-label="التنقل الرئيسي"
        className={`flex items-center justify-between px-6 md:px-12 transition-all duration-500 ${
          isTransparent
            ? "py-4 md:py-6 bg-transparent"
            : "py-3 md:py-4 bg-ivory/95 backdrop-blur-md border-b border-ochre/20 shadow-sm shadow-ochre/5"
        }`}
      >
        {/* زر CTA — ديسكتوب (على اليمين في RTL بعد العكس) */}
        <Link
          href="/contact"
          className="btn-glow hidden lg:inline-block rounded-full bg-ochre-deep px-6 py-2.5 font-body font-bold text-ivory outline-none focus-visible:ring-2 focus-visible:ring-ochre-deep focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          اطلب عرض سعر
        </Link>

        {/* روابط الديسكتوب */}
        <ul className="hidden lg:flex items-center gap-8 font-body text-[0.95rem] font-medium text-ink/85">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative rounded py-2 outline-none transition-colors hover:text-ochre-deep focus-visible:ring-2 focus-visible:ring-ochre-deep after:absolute after:bottom-0 after:right-0 after:h-[2px] after:bg-ochre after:transition-all ${
                  isActive(l.href)
                    ? "text-ochre-deep after:w-full"
                    : "after:w-0 hover:after:w-full"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* اللوجو — على اليسار في RTL بعد العكس */}
        {Logo}

        {/* زر القائمة — موبايل/تابلت */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="grid size-11 place-items-center rounded-full border border-ochre-deep/50 text-ink outline-none transition-colors hover:bg-ochre/15 focus-visible:ring-2 focus-visible:ring-ochre-deep lg:hidden"
        >
          <span className="relative block h-4 w-6" aria-hidden>
            <span
              className={`absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-all duration-300 ${
                menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-current transition-all duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 rounded bg-current transition-all duration-300 ${
                menuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* لوحة القائمة — موبايل */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden bg-ivory/97 backdrop-blur-lg transition-[max-height,opacity] duration-500 ease-out ${
          menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 pb-8 pt-2">
          {links.map((l, i) => (
            <li key={l.href} className="border-b border-ochre/15 last:border-0">
              <Link
                href={l.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`flex items-center gap-4 py-4 font-heading text-xl outline-none transition-colors hover:text-ochre-deep focus-visible:text-ochre-deep ${
                  isActive(l.href) ? "text-ochre-deep" : "text-ink"
                }`}
              >
                <span className="block size-2 rotate-45 bg-ochre-deep/60" />
                {l.label}
                <span className="ms-auto font-body text-xs text-ink/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-ochre-deep py-4 text-center font-body font-bold text-ivory outline-none transition-colors hover:bg-ink focus-visible:ring-2 focus-visible:ring-ochre-deep"
            >
              اطلب عرض سعر
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
