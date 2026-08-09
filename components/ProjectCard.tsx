"use client";

import { Project } from "@/types/project";
import { v as withV } from "@/components/assetVersion";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  index?: number;
}

export default function ProjectCard({ project, onSelect, index = 0 }: ProjectCardProps) {
  return (
    <article
      onClick={() => onSelect(project)}
      className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-ochre/35 bg-ink/90 shadow-[0_8px_35px_-10px_rgba(30,26,23,0.3)] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-ochre hover:shadow-[0_20px_60px_-15px_rgba(213,175,102,0.45)]"
    >
      {/* إطار إضاءة محيطية ذهبية للمتحف */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-tr from-ochre/30 via-ochre-deep/20 to-oasis/30" />

      {/* زوايا الإطار الفني للمتحف */}
      <span className="pointer-events-none absolute top-3 start-3 z-20 size-3 border-t-2 border-s-2 border-ochre/50 transition-colors group-hover:border-ochre" />
      <span className="pointer-events-none absolute top-3 end-3 z-20 size-3 border-t-2 border-e-2 border-ochre/50 transition-colors group-hover:border-ochre" />
      <span className="pointer-events-none absolute bottom-3 start-3 z-20 size-3 border-b-2 border-s-2 border-ochre/50 transition-colors group-hover:border-ochre" />
      <span className="pointer-events-none absolute bottom-3 end-3 z-20 size-3 border-b-2 border-e-2 border-ochre/50 transition-colors group-hover:border-ochre" />

      {/* الصورة خلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
        style={{ backgroundImage: `url('${withV(project.img)}')` }}
        aria-hidden
      />

      {/* تدرّج متحفي سينمائي دافئ */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20 opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

      {/* الشارات العلوية */}
      <div className="absolute top-5 start-5 end-5 z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/75 backdrop-blur-md px-3 py-1 font-body text-[0.65rem] font-bold tracking-widest text-ochre shadow-md border border-ochre/30">
          <span className="block size-1.5 rotate-45 bg-ochre animate-pulse" />
          تحفة رقم ٠{index + 1}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-[0.68rem] font-bold shadow-md backdrop-blur-md border border-white/20 ${
            project.status === "completed"
              ? "bg-[#0B7A5C]/90 text-ivory"
              : "bg-ochre-deep/90 text-ivory"
          }`}
        >
          <span className="block size-1.5 rotate-45 bg-ivory" />
          {project.statusLabel}
        </span>
      </div>

      {/* المحتوى في أسفل الإطار المتحفي */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 z-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-ochre-deep/90 backdrop-blur-md px-3.5 py-1 font-body text-[0.7rem] font-bold text-ivory shadow-lg border border-white/20">
          <span className="block size-1.5 rotate-45 bg-ivory" />
          {project.type}
        </span>

        <h3 className="mt-3 font-heading text-xl md:text-2xl font-bold text-ivory leading-snug group-hover:text-ochre transition-colors drop-shadow-md">
          {project.title}
        </h3>

        <p className="mt-1.5 font-body text-xs md:text-sm font-medium text-ivory/85">
          {project.cap}
        </p>

        <div className="mt-4 pt-3 border-t border-ivory/15 flex items-center justify-between font-body text-xs font-bold text-ochre">
          <span className="flex items-center gap-2">
            <span className="block size-1.5 rotate-45 bg-ochre" />
            {project.loc}
          </span>
          <span className="inline-flex items-center gap-1 text-ivory/80 group-hover:text-ochre transition-colors">
            دخول المعرض ↗
          </span>
        </div>
      </div>
    </article>
  );
}
