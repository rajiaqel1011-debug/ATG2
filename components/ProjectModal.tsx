"use client";

import { useEffect } from "react";
import { Project } from "@/types/project";
import { v as withV } from "@/components/assetVersion";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-ink/85 backdrop-blur-xl transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      {/* هالة الإضاءة الشديدة الفخامة خلف النافذة */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(213,175,102,0.22),transparent_65%)]" />

      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-ochre/50 bg-ivory shadow-[0_25px_80px_-15px_rgba(184,146,63,0.35)] transition-transform duration-500 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زوايا المتحف الذهبية */}
        <span className="pointer-events-none absolute top-4 start-4 z-30 size-4 border-t-2 border-s-2 border-ochre" />
        <span className="pointer-events-none absolute top-4 end-4 z-30 size-4 border-t-2 border-e-2 border-ochre" />
        <span className="pointer-events-none absolute bottom-4 start-4 z-30 size-4 border-b-2 border-s-2 border-ochre" />
        <span className="pointer-events-none absolute bottom-4 end-4 z-30 size-4 border-b-2 border-e-2 border-ochre" />

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          aria-label="إغلاق المعرض"
          className="absolute top-6 end-6 z-40 grid size-11 place-items-center rounded-full bg-ink/80 text-ivory backdrop-blur-md border border-ochre/40 transition-all hover:bg-ochre-deep hover:scale-110 hover:shadow-lg"
        >
          ✕
        </button>

        {/* صوّرة المعرض السينمائية */}
        <div className="relative h-72 md:h-[420px] w-full overflow-hidden bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withV(project.img)}
            alt={project.title}
            className="h-full w-full object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ink/40 to-transparent" />

          {/* البادجات العلوية الفاخرة */}
          <div className="absolute top-6 start-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#185F74] px-4 py-1.5 font-body text-xs font-bold text-ivory shadow-lg border border-white/20">
              <span className="block size-1.5 rotate-45 bg-ivory" />
              جناح: {project.categoryLabel}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-body text-xs font-bold shadow-lg border border-white/20 ${
                project.status === "completed"
                  ? "bg-[#0B7A5C] text-ivory"
                  : "bg-ochre-deep text-ivory"
              }`}
            >
              <span className="block size-1.5 rotate-45 bg-ivory" />
              {project.statusLabel}
            </span>
          </div>

          {/* العنوان الرئيسي للمتحف */}
          <div className="absolute bottom-6 start-8 end-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="block size-2 rotate-45 bg-ochre-deep animate-pulse" />
              <span className="font-body text-xs font-bold tracking-[0.25em] text-ochre-deep uppercase">
                جناح المعروضات الميدانية — ATG Museum
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* تفاصيل المشروع والبيانات الهندسيّة */}
        <div className="p-6 md:p-12 space-y-10">
          {/* شريط الإحصاءات السريع */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 rounded-2xl border border-ochre/35 bg-ivory-soft shadow-inner">
            <div>
              <span className="block font-body text-xs font-medium text-ink/50">الموقع والجغرافية</span>
              <strong className="block mt-1 font-body text-sm md:text-base font-bold text-ink">
                {project.loc}
              </strong>
            </div>
            <div>
              <span className="block font-body text-xs font-medium text-ink/50">القدرة والمنظومة</span>
              <strong className="block mt-1 font-body text-sm md:text-base font-bold text-ochre-deep">
                {project.cap}
              </strong>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block font-body text-xs font-medium text-ink/50">سنة الإنجاز</span>
              <strong className="block mt-1 font-body text-sm md:text-base font-bold text-[#185F74]">
                {project.year}
              </strong>
            </div>
          </div>

          {/* الوصف الهندسي */}
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-ink mb-3 flex items-center gap-2">
              <span className="block size-2.5 rotate-45 bg-ochre-deep" />
              التفاصيل الفنية والهندسية
            </h3>
            <p className="font-body text-base md:text-lg font-normal leading-relaxed text-ink/80">
              {project.desc}
            </p>
          </div>

          {/* المواصفات الفنية والأثر */}
          {project.specs && project.specs.length > 0 && (
            <div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-ink mb-5 flex items-center gap-2">
                <span className="block size-2.5 rotate-45 bg-[#0B7A5C]" />
                مواصفات الأثر والتميز الميداني
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {project.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-5 rounded-2xl border border-ochre/25 bg-ivory-soft transition-all hover:border-ochre-deep hover:shadow-md"
                  >
                    <span className="mt-1.5 block size-2 shrink-0 rotate-45 bg-ochre-deep" />
                    <span className="font-body text-sm md:text-base font-medium text-ink/85">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* زر التوجّه للاستشارة */}
          <div className="pt-6 border-t border-ochre/25 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-body text-xs text-ink/60 max-w-md leading-relaxed">
              تم توثيق هذا المشروع ضمن سجلات شركة ATG للهندسة والطاقة الشمسية المتقدمة وفق أعلى معايير الجودة والسلامة.
            </p>
            <a
              href="/contact"
              className="w-full sm:w-auto rounded-full bg-ochre-deep px-8 py-4 text-center font-body text-sm font-bold text-ivory shadow-lg transition-all hover:bg-ink hover:shadow-2xl hover:scale-105"
            >
              طلب استشارة لمشروع مماثل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
