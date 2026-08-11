"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredProjects, saveProjects, compressImage } from "@/lib/projectsStore";
import {
  checkIsAuthenticated,
  getAdminCreds,
  loginAdmin,
  logoutAdmin,
  saveAdminCreds,
} from "@/lib/adminAuth";
import { Project, ProjectCategory, ProjectStatus } from "@/types/project";
import { v as withV } from "@/components/assetVersion";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // حقول الدخول
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // المشاريع والبحث
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  // النوافذ الإضافية
  const [isAdding, setIsAdding] = useState(false);
  const [isChangingCreds, setIsChangingCreds] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCompressingImg, setIsCompressingImg] = useState(false);

  // حقول التكفيل (تعديل الحساب)
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credsSuccessMsg, setCredsSuccessMsg] = useState("");

  // حقول نموذج مشروع جديد / تعديل
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("pumping");
  const [img, setImg] = useState("/videos/web/posters/farm.jpg");
  const [cap, setCap] = useState("");
  const [loc, setLoc] = useState("");
  const [year, setYear] = useState("٢٠٢٦");
  const [status, setStatus] = useState<ProjectStatus>("completed");
  const [desc, setDesc] = useState("");
  const [spec1, setSpec1] = useState("");
  const [spec2, setSpec2] = useState("");
  const [spec3, setSpec3] = useState("");

  useEffect(() => {
    setIsClient(true);
    setIsAuthenticated(checkIsAuthenticated());
    setProjects(getStoredProjects());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const success = loginAdmin(loginUser, loginPass);
    if (success) {
      setIsAuthenticated(true);
      setLoginUser("");
      setLoginPass("");
    } else {
      setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مجدداً.");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      alert("يرجى إدخال اسم مستخدم وكلمة مرور جديدين.");
      return;
    }
    saveAdminCreds({
      username: newUsername.trim(),
      passwordHash: newPassword.trim(),
    });
    setCredsSuccessMsg("تم تحديث اسم المستخدم وكلمة المرور بنجاح!");
    setTimeout(() => {
      setCredsSuccessMsg("");
      setIsChangingCreds(false);
      setNewUsername("");
      setNewPassword("");
    }, 2000);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !cap.trim() || !loc.trim()) {
      alert("يرجى تعبئة عنوان المشروع والقدرة والموقع على الأقل.");
      return;
    }

    const categoryLabels: Record<ProjectCategory, string> = {
      pumping: "ضخ شمسي زراعي",
      well: "آبار جوفية",
      epc: "EPC تجاري",
      offgrid: "Off-Grid",
    };

    const statusLabels: Record<ProjectStatus, string> = {
      completed: "مكتمل ومُشغّل",
      in_progress: "قيد التنفيذ",
    };

    const specs = [spec1, spec2, spec3].filter((s) => s.trim() !== "");

    if (editingProject) {
      // تعديل مشروع حالي
      const updated = projects.map((p) => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title,
            category,
            categoryLabel: categoryLabels[category],
            img: img || "/videos/web/posters/farm.jpg",
            type: categoryLabels[category],
            cap,
            loc,
            year,
            status,
            statusLabel: statusLabels[status],
            desc: desc || p.desc,
            specs: specs.length > 0 ? specs : p.specs,
          };
        }
        return p;
      });
      setProjects(updated);
      saveProjects(updated);
      setEditingProject(null);
      alert("تمت تحديث تفاصيل المشروع بنجاح!");
    } else {
      // إضافة مشروع جديد
      const newProj: Project = {
        id: "proj-" + Date.now(),
        title,
        category,
        categoryLabel: categoryLabels[category],
        img: img || "/videos/web/posters/farm.jpg",
        type: categoryLabels[category],
        cap,
        loc,
        year,
        status,
        statusLabel: statusLabels[status],
        desc: desc || "مشروع حيوي متكامل نُفّذ وفق أعلى المعايير الهندسية لشركة ATG.",
        specs: specs.length > 0 ? specs : ["تصميم وتنفيذ وفق الكود السعودي", "ضمان شامل وجودة عالية"],
      };

      const updated = [newProj, ...projects];
      setProjects(updated);
      saveProjects(updated);
      setIsAdding(false);
      alert("تمت إضافة المشروع بنجاح ووضعه في متحف المشاريع!");
    }

    // إعادة تعيين النموذج
    resetForm();
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setImg(proj.img);
    setCap(proj.cap);
    setLoc(proj.loc);
    setYear(proj.year);
    setStatus(proj.status);
    setDesc(proj.desc);
    setSpec1(proj.specs[0] || "");
    setSpec2(proj.specs[1] || "");
    setSpec3(proj.specs[2] || "");
  };

  const resetForm = () => {
    setTitle("");
    setCap("");
    setLoc("");
    setDesc("");
    setSpec1("");
    setSpec2("");
    setSpec3("");
  };

  const handleDeleteProject = (id: string, projTitle: string) => {
    if (confirm(`هل أنت تأكد من حذف مشروع "${projTitle}"؟`)) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.includes(search) || p.loc.includes(search) || p.cap.includes(search)
  );

  if (!isClient) return null;

  // ════════════════════════════════════════════════════════════════
  // 🔒 شاشة تسجيل الدخول الأمنيّة (ATG Branded Security Login Screen)
  // ════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    const currentCreds = getAdminCreds();
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 dir-rtl font-body relative overflow-hidden">
        {/* خلفية الشعار المحفور */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 select-none"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withV("/images/icon.svg")}
            alt=""
            className="w-[600px] h-auto"
          />
        </div>

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-ochre/40 bg-ink/90 backdrop-blur-2xl p-8 md:p-10 shadow-[0_20px_70px_rgba(213,175,102,0.18)]">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withV("/images/Approved-white.svg")}
                alt="ATG Logo"
                className="h-12 w-auto mx-auto"
              />
            </Link>
            <h1 className="mt-4 font-heading text-xl font-bold text-ivory">
              لوحة تحكم الإدارة لـ ATG
            </h1>
            <p className="mt-1 font-body text-xs font-normal text-ivory/60">
              يرجى إدخال بيانات الدخول لإدارة مشاريع المتحف الهندسي
            </p>
          </div>

          {loginError && (
            <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-bold text-red-300 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-ochre mb-2">
                اسم المستخدم (Username)
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full rounded-2xl border border-ochre/30 bg-ink/60 px-4 py-3.5 text-sm text-ivory outline-none focus:border-ochre transition-colors dir-ltr text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ochre mb-2">
                كلمة المرور (Password)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full rounded-2xl border border-ochre/30 bg-ink/60 px-4 py-3.5 text-sm text-ivory outline-none focus:border-ochre transition-colors dir-ltr text-left"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-ochre-deep py-4 font-body text-sm font-bold text-ivory shadow-lg transition-all hover:bg-ochre hover:shadow-xl"
            >
              تسجيل الدخول الآمن ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 🖥️ لوحة التحكم الرئيسية بعد الدخول (ATG Admin Dashboard)
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-ivory text-ink font-body dir-rtl">
      {/* ═══ الهيدر العلوي للوحة الإدارة ═══ */}
      <header className="sticky top-0 z-50 border-b border-ochre/30 bg-ink px-6 py-4 text-ivory shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withV("/images/Approved-white.svg")}
                alt="ATG"
                className="h-9 w-auto"
              />
            </Link>
            <span className="hidden sm:inline text-ochre/40">|</span>
            <h1 className="font-heading text-lg font-bold text-ochre">
              لوحة إدارة مشاريع ATG
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChangingCreds(true)}
              className="rounded-full border border-ochre/40 bg-ink/60 px-4 py-1.5 text-xs font-bold text-ivory transition-all hover:bg-ochre-deep"
            >
              تغيير الحساب 🔑
            </button>

            <Link
              href="/projects"
              target="_blank"
              className="hidden sm:inline-flex rounded-full border border-ochre/40 bg-ink/60 px-4 py-1.5 text-xs font-bold text-ivory transition-all hover:bg-ochre-deep"
            >
              معاينة المتحف ↗
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600/80 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-red-600"
            >
              خروج 🚪
            </button>
          </div>
        </div>
      </header>

      {/* ═══ المحتوى الرئيسي ═══ */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* شريط الإحصائيات والأزرار */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-ochre/20">
          <div>
            <span className="font-body text-xs font-bold tracking-[0.2em] text-[#0B7A5C] uppercase block mb-1">
              إدارة المتحف الميداني
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink">
              المشاريع المعروضة ({projects.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="ابحث عن مشروع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border border-ochre/30 bg-ivory-soft px-4 py-2 text-xs md:text-sm text-ink outline-none focus:border-ochre-deep"
            />
            <button
              onClick={() => {
                resetForm();
                setEditingProject(null);
                setIsAdding(!isAdding);
              }}
              className="rounded-full bg-ochre-deep px-6 py-2.5 font-body text-xs md:text-sm font-bold text-ivory shadow-md transition-all hover:bg-ink hover:shadow-xl shrink-0"
            >
              {isAdding ? "إغلاق النموذج ×" : "+ إضافة مشروع جديد"}
            </button>
          </div>
        </div>

        {/* ═══ نافذة تغيير بيانات الدخول (Security Settings Modal) ═══ */}
        {isChangingCreds && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
            <div className="relative w-full max-w-md rounded-3xl border border-ochre/40 bg-ivory p-8 shadow-2xl">
              <button
                onClick={() => setIsChangingCreds(false)}
                className="absolute top-4 end-4 text-ink/50 hover:text-ink font-bold"
              >
                ✕
              </button>
              <h3 className="font-heading text-xl font-bold text-ink mb-4 border-b border-ochre/20 pb-3">
                تغيير اسم المستخدم وكلمة المرور
              </h3>

              {credsSuccessMsg && (
                <div className="mb-4 rounded-xl bg-[#0B7A5C]/15 border border-[#0B7A5C]/40 p-3 text-xs font-bold text-[#0B7A5C] text-center">
                  {credsSuccessMsg}
                </div>
              )}

              <form onSubmit={handleChangeCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    اسم المستخدم الجديد
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: admin_atg"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full rounded-xl border border-ochre/30 bg-ivory-soft px-4 py-2.5 text-sm text-ink outline-none focus:border-ochre-deep"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/70 mb-1">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-ochre/30 bg-ivory-soft px-4 py-2.5 text-sm text-ink outline-none focus:border-ochre-deep"
                  />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingCreds(false)}
                    className="rounded-full border border-ochre/30 px-5 py-2 text-xs font-bold text-ink/70"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-ochre-deep px-6 py-2 text-xs font-bold text-ivory shadow-md"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══ نموذج إضافة / تعديل مشروع (Add / Edit Form) ═══ */}
        {(isAdding || editingProject) && (
          <form
            onSubmit={handleSaveProject}
            className="mb-12 rounded-3xl border border-ochre/40 bg-ivory-soft p-6 md:p-10 shadow-xl space-y-6 animate-fadeIn"
          >
            <h3 className="font-heading text-xl font-bold text-ink border-b border-ochre/20 pb-4">
              {editingProject ? `تعديل مشروع: ${editingProject.title}` : "إضافة مشروع جديد للمتحف"}
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  عنوان المشروع *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ري مزرعة نخيل — القصيم"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  القطاع والتصنيف *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep"
                >
                  <option value="pumping">ضخ شمسي زراعي</option>
                  <option value="well">آبار جوفية</option>
                  <option value="epc">EPC تجاري</option>
                  <option value="offgrid">Off-Grid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  القدرة ونوع النظام *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ٧٥ كيلوواط · ضخ مباشر"
                  value={cap}
                  onChange={(e) => setCap(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  الموقع والدولة *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المملكة العربية السعودية — القصيم"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  سنة التنفيذ
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  حالة المشروع (Status) *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep font-bold"
                >
                  <option value="completed">مكتمل ومُشغّل</option>
                  <option value="in_progress">قيد التنفيذ</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  صورة المشروع الرئيسية (رفع مباشر من الجهاز بنقرة واحدة) 📸
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-ochre/40 bg-ivory shadow-inner">
                  {/* زر رفع ملف صورة من الجهاز مع الضغط الذكي السريع */}
                  <label className="cursor-pointer rounded-full bg-ochre-deep px-6 py-3 font-body text-xs font-bold text-ivory shadow-md transition-all hover:bg-ink hover:shadow-lg flex items-center gap-2 shrink-0">
                    <span>{isCompressingImg ? "⏳ جاري ضغط ومعالجة الصورة..." : "📁 اختر صورة من الكمبيوتر/الهاتف"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isCompressingImg}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setIsCompressingImg(true);
                            const compressed = await compressImage(file);
                            setImg(compressed);
                          } catch (err) {
                            console.error("Error compressing image:", err);
                            alert("تعذر معالجة الصورة. يرجى اختيار صورة أخرى.");
                          } finally {
                            setIsCompressingImg(false);
                          }
                        }
                      }}
                    />
                  </label>

                  <span className="text-xs text-ink/40">أو رابط:</span>

                  <input
                    type="text"
                    placeholder="/videos/web/posters/farm.jpg"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    className="w-full rounded-xl border border-ochre/30 bg-ivory-soft px-4 py-2.5 text-xs text-ink outline-none focus:border-ochre-deep dir-ltr text-left"
                  />
                </div>

                {/* معاينة حيّة ومباشرة للصورة المرفوعة */}
                {img && (
                  <div className="mt-3 flex items-center gap-4 p-3 rounded-2xl border border-ochre/25 bg-ivory-soft">
                    <div className="size-16 rounded-xl overflow-hidden border border-ochre/40 bg-ink shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={withV(img)} alt="معاينة الصورة" className="size-full object-cover" />
                    </div>
                    <div className="text-xs text-ink/70">
                      <strong className="block font-bold text-ink">معاينة الصورة المرفوعة</strong>
                      <span>سيتم حفظ ونشر هذه الصورة تلقائياً عند الضغط على حفظ المشروع.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-ink/70 mb-2">
                  وصف المشروع التفصيلي
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً هندسياً شاملاً للمشروع وأهدافه..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-ochre-deep"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-bold text-ink/70">
                  المواصفات الفنية وأرقام الأثر
                </label>
                <input
                  type="text"
                  placeholder="مواصفة 1: مثال: مضخة غاطسة بقدرة 75 كيلوواط"
                  value={spec1}
                  onChange={(e) => setSpec1(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-2.5 text-sm text-ink outline-none focus:border-ochre-deep"
                />
                <input
                  type="text"
                  placeholder="مواصفة 2: مثال: توفير 45,000 لتر ديزل سنوياً"
                  value={spec2}
                  onChange={(e) => setSpec2(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-2.5 text-sm text-ink outline-none focus:border-ochre-deep"
                />
                <input
                  type="text"
                  placeholder="مواصفة 3: مثال: انفرتر VEICHI SI23 بتقنية MPPT"
                  value={spec3}
                  onChange={(e) => setSpec3(e.target.value)}
                  className="w-full rounded-xl border border-ochre/30 bg-ivory px-4 py-2.5 text-sm text-ink outline-none focus:border-ochre-deep"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-ochre/20">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingProject(null);
                }}
                className="rounded-full border border-ochre/30 px-6 py-2.5 text-xs font-bold text-ink/70 transition-colors hover:bg-ochre/10"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-full bg-ochre-deep px-8 py-2.5 font-body text-xs font-bold text-ivory shadow-md transition-all hover:bg-ink"
              >
                {editingProject ? "حفظ التعديلات" : "حفظ ونشر المشروع"}
              </button>
            </div>
          </form>
        )}

        {/* ═══ جدول المشاريع الحالية ═══ */}
        <div className="rounded-3xl border border-ochre/30 bg-ivory-soft overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-right font-body text-sm">
              <thead className="border-b border-ochre/25 bg-ochre/10 text-xs font-bold text-ink/80">
                <tr>
                  <th className="p-4">الصورة</th>
                  <th className="p-4">اسم المشروع</th>
                  <th className="p-4">القطاع</th>
                  <th className="p-4">القدرة والنوع</th>
                  <th className="p-4">الموقع</th>
                  <th className="p-4">الحالة (Status)</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ochre/15">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-ivory">
                    <td className="p-4">
                      <div className="size-12 rounded-xl overflow-hidden border border-ochre/30 bg-ink">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={withV(p.img)}
                          alt={p.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-ink">{p.title}</td>
                    <td className="p-4 text-xs font-medium text-ink/70">
                      {p.categoryLabel}
                    </td>
                    <td className="p-4 text-xs font-medium text-ochre-deep">
                      {p.cap}
                    </td>
                    <td className="p-4 text-xs text-ink/70">{p.loc}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-[0.7rem] font-bold ${
                          p.status === "completed"
                            ? "bg-[#0B7A5C]/20 text-[#0B7A5C]"
                            : "bg-ochre/20 text-ochre-deep"
                        }`}
                      >
                        {p.statusLabel}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="rounded-lg bg-ochre/15 border border-ochre/30 px-3 py-1.5 text-xs font-bold text-ochre-deep transition-colors hover:bg-ochre-deep hover:text-ivory"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id, p.title)}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
