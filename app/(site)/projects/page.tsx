"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { getStoredProjects, fetchServerProjects } from "@/lib/projectsStore";
import { Project } from "@/types/project";

const stats = [
  { prefix: "+", num: 20, unit: "ميجاوات", label: "قدرة منجزة في السعودية" },
  { prefix: "+", num: 200, unit: "منظومة", label: "ضخ شمسي منفّذة" },
  { prefix: "+", num: 100, unit: "٪", label: "التزام بالكود السعودي SBC" },
  { prefix: "+", num: 10, unit: "سنوات", label: "خبرة هندسية تراكمية" },
];

const sectors = [
  { t: "الزراعة والري", d: "ضخ مياه للمزارع والمشاريع الزراعية والمياه الجوفية." },
  { t: "المواقع النائية", d: "أنظمة off-grid للمخيمات والقرى ومحطات الاتصالات." },
  { t: "المنشآت التجارية", d: "أنظمة EPC مربوطة بالشبكة لخفض فاتورة الطاقة." },
  { t: "القطاع السكني", d: "حلول سكنية موثوقة بمعايير الكود السعودي." },
];

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjectsList(getStoredProjects());
    fetchServerProjects().then((data) => {
      if (data) setProjectsList(data);
    });
  }, []);

  const filteredProjects = projectsList.filter((p) => {
    const matchesCategory = filter === "all" || p.category === filter;
    const matchesSearch =
      search === "" ||
      p.title.includes(search) ||
      p.loc.includes(search) ||
      p.cap.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHero
        crumb="متحف المشاريع"
        kicker="متحف المشاريع الميدانية"
        title="أرقامٌ تشهد،"
        highlight="ومواقعُ تروى"
        subtitle="أكثر من ٢٠٠ منظومة ضخ و٢٠ ميجاوات منجزة عبر الأردن والسعودية — كل مشروعٍ التزامٌ يُبنى، لا صفقةٌ تُغلق."
      />

      {/* ═══ الإحصائيات ═══ */}
      <section className="relative bg-ivory px-6 pt-16 md:px-12 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="grid grid-cols-3 divide-x divide-ochre/20 rtl:divide-x-reverse rounded-3xl border border-ochre/25 bg-ivory-soft shadow-sm">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-8 text-center md:py-10">
                  <CountUp
                    to={s.num}
                    prefix={s.prefix}
                    className="block font-heading text-4xl md:text-6xl font-bold text-ochre-deep leading-none"
                  />
                  <div className="mt-2 font-body text-xs md:text-sm font-bold tracking-widest text-[#185F74]">
                    {s.unit}
                  </div>
                  <p className="mt-2 font-body text-[0.7rem] md:text-sm font-normal leading-relaxed text-ink/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ متحف المشاريع الميدانية مع الفلترة والتفاصيل ═══ */}
      <section className="relative overflow-hidden bg-ivory px-6 py-16 md:px-12 md:py-24">
        {/* بقع إضاءة متحفية ذهبية خافتة بالخلفية */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(213,175,102,0.14),transparent_70%)] select-none" />
        <div className="pointer-events-none absolute bottom-10 start-10 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(24,95,116,0.08),transparent_70%)] select-none" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col gap-6 mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="block size-2.5 rotate-45 bg-ochre-deep animate-pulse" />
                  <span className="font-body text-xs font-bold tracking-[0.25em] text-[#0B7A5C] uppercase">
                    قاعة معروضات التحف الهندسيّة — ATG Museum
                  </span>
                </div>

                {/* حقل البحث التفاعلي */}
                <input
                  type="text"
                  placeholder="ابحث عن تحفة، موقع، أو قدرة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-72 rounded-full border border-ochre/40 bg-ivory-soft px-5 py-2.5 font-body text-xs md:text-sm text-ink outline-none transition-colors focus:border-ochre-deep shadow-sm"
                />
              </div>

              {/* فلتر القطاعات */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "جميع المعروضات" },
                  { id: "pumping", label: "ضخ شمسي زراعي" },
                  { id: "well", label: "آبار جوفية" },
                  { id: "epc", label: "EPC تجاري" },
                  { id: "offgrid", label: "Off-Grid" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`rounded-full px-4 py-2 font-body text-xs md:text-sm font-bold transition-all duration-300 ${
                      filter === cat.id
                        ? "bg-ochre-deep text-ivory shadow-lg scale-105"
                        : "border border-ochre/30 bg-ivory-soft text-ink/70 hover:border-ochre-deep hover:text-ink"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* شبكة بطاقات المشاريع (معرض المتحف) */}
          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center rounded-3xl border border-dashed border-ochre/30 bg-ivory-soft">
              <p className="font-body text-base text-ink/60">
                لا توجد تحف هندسيّة تطابق بحثك حالياً.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.08}>
                  <ProjectCard
                    project={p}
                    index={i}
                    onSelect={(selected) => setSelectedProject(selected)}
                  />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal>
            <p className="mt-8 text-center font-body text-xs font-normal text-ink/50">
              نماذج توثيقية حقيقية لبعض المشاريع المنفذة عبر مناطق الأردن والمملكة العربية السعودية. اضغط على أي مشروع لفتح متحف التفاصيل الهندسيّة.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ القطاعات التي نخدمها ═══ */}
      <section className="relative overflow-hidden bg-ivory-soft px-6 py-20 md:px-12 md:py-28 border-t border-ochre/20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block size-2 rotate-45 bg-ochre-deep" />
              <span className="font-body text-xs font-bold tracking-[0.25em] text-[#185F74] uppercase">
                القطاعات التي نخدمها
              </span>
            </div>
            <h2 className="mt-6 font-heading text-3xl md:text-5xl font-bold text-ink leading-snug">
              أينما احتجتَ طاقةً أو ماءً… <span className="text-ochre-deep">نصل</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-12 gap-y-2 md:grid-cols-2">
            {sectors.map((s, i) => (
              <Reveal key={s.t} delay={(i % 2) * 0.08}>
                <div className="group flex gap-5 border-b border-ochre/20 py-6">
                  <span className="mt-1.5 block size-2.5 shrink-0 rotate-45 border border-ochre-deep bg-transparent transition-all duration-500 group-hover:bg-ochre-deep group-hover:shadow-[0_0_12px_rgba(184,146,63,0.5)]" />
                  <div>
                    <h3 className="font-heading text-lg md:text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-ochre-deep">
                      {s.t}
                    </h3>
                    <p className="mt-2 font-body text-sm md:text-base font-normal leading-relaxed text-ink/65">
                      {s.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* نافذة تفاصيل المشروع (المتحف) */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CtaBand
        title="مشروعك القادم يبدأ بمكالمة"
        subtitle="شاركنا موقعك وااحتياجك، ونعود إليك بتصوّرٍ هندسي أولي وعرضٍ واضح."
      />
    </>
  );
}
