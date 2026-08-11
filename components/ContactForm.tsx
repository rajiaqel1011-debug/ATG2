"use client";

import { useState } from "react";

const COMPANY_EMAIL = "info@atggreen.com";
const DEFAULT_WHATSAPP_NUMBER = "";

export interface ATGServiceOption {
  id: "pumping" | "epc" | "offgrid" | "structures";
  num: string;
  name: string;
  tag: string;
  icon: string;
  desc: string;
}

const ATG_SERVICES: ATGServiceOption[] = [
  {
    id: "pumping",
    num: "٠١",
    name: "ضخ المياه بالطاقة الشمسية",
    tag: "Solar Pumping Systems",
    icon: "💧",
    desc: "حلول ري زراعي وآبار ارتوازية بقدرات من 0.75kW حتى 132kW+",
  },
  {
    id: "epc",
    num: "٠٢",
    name: "أنظمة EPC المتكاملة",
    tag: "On-Grid & Hybrid EPC",
    icon: "⚡",
    desc: "منظومات تجارية وصناعية وسكنية متصلة وفق الكود السعودي",
  },
  {
    id: "offgrid",
    num: "٠٣",
    name: "الأنظمة المنفصلة عن الشبكة",
    tag: "Off-Grid Storage",
    icon: "🔋",
    desc: "طاقة للمواقع النائية مع بطاريات ليثيوم LFP ومراقبة ذكية",
  },
  {
    id: "structures",
    num: "٠٤",
    name: "توريد الهياكل المعدنية",
    tag: "Mounting Structures",
    icon: "🏗️",
    desc: "هياكل أرضية وأسطح ومظلات بالفولاذ المغلفن وZAM",
  },
];

const inputCls =
  "w-full rounded-xl border border-ochre/25 bg-ivory px-4 py-3.5 font-body text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink/35 hover:border-ochre/50 focus:border-ochre-deep focus:bg-ivory focus:ring-2 focus:ring-ochre-deep/20 shadow-sm";
const labelCls = "mb-2 flex items-center justify-between font-body text-xs font-semibold tracking-wider text-ink/80 uppercase";

export default function ContactForm() {
  const [selectedService, setSelectedService] = useState<ATGServiceOption["id"]>("pumping");
  const [country, setCountry] = useState("المملكة العربية السعودية 🇸🇦");

  // حقول المواصفات
  const [pumpDepth, setPumpDepth] = useState("");
  const [pumpPower, setPumpPower] = useState("");
  const [epcFacility, setEpcFacility] = useState("منشأة تجارية / مصنع");
  const [epcCapacity, setEpcCapacity] = useState("");
  const [offgridLoad, setOffgridLoad] = useState("");
  const [hasGenerator, setHasGenerator] = useState("نعم");
  const [structureType, setStructureType] = useState("هياكل أرضية Ground-Mounted");
  const [materialType, setMaterialType] = useState("فولاذ مغلفن بالغمس الحار Hot-Dip Galvanized");

  const [sentMsg, setSentMsg] = useState<string | null>(null);

  const handleSend = (targetType: "whatsapp" | "email", e: React.FormEvent) => {
    e.preventDefault();
    const formEl = (e.target as HTMLElement).closest("form") as HTMLFormElement;
    if (!formEl) return;

    const f = new FormData(formEl);
    const name = (f.get("name") as string) || "";
    const company = (f.get("company") as string) || "";
    const phone = (f.get("phone") as string) || "";
    const email = (f.get("email") as string) || "";
    const notes = (f.get("notes") as string) || "";

    if (!name || !phone) {
      alert("يرجى تعبئة الاسم الكامل ورقم الهاتف / الواتساب.");
      return;
    }

    const activeServ = ATG_SERVICES.find((s) => s.id === selectedService);

    const waLines = [
      `*طلب عرض سعر جديد — ATG* ⚡`,
      `─────────────────`,
      `*الخدمة المطلوبة:* ${activeServ?.icon} ${activeServ?.name} (${activeServ?.tag})`,
      `*الدولة / السوق:* ${country}`,
    ];

    if (selectedService === "pumping") {
      if (pumpDepth) waLines.push(`• *عمق البئر / مصدر الماء:* ${pumpDepth}`);
      if (pumpPower) waLines.push(`• *القدرة / التدفق المطلوب:* ${pumpPower}`);
    } else if (selectedService === "epc") {
      if (epcFacility) waLines.push(`• *نوع المنشأة:* ${epcFacility}`);
      if (epcCapacity) waLines.push(`• *الاستهلاك / القدرة التقديرية:* ${epcCapacity}`);
    } else if (selectedService === "offgrid") {
      if (offgridLoad) waLines.push(`• *طبيعة الأحمال:* ${offgridLoad}`);
      waLines.push(`• *مولد ديزل احتياطي:* ${hasGenerator}`);
    } else if (selectedService === "structures") {
      waLines.push(`• *نوع التثبيت:* ${structureType}`);
      waLines.push(`• *خامة الفولاذ:* ${materialType}`);
    }

    waLines.push("");
    waLines.push(`*بيانات العميل والاتصال:*`);
    waLines.push(`• *الاسم الكامل:* ${name}`);
    if (company) waLines.push(`• *الجهة / الشركة:* ${company}`);
    waLines.push(`• *رقم الهاتف / واتساب:* ${phone}`);
    if (email) waLines.push(`• *البريد الإلكتروني:* ${email}`);

    if (notes) {
      waLines.push("");
      waLines.push(`*ملاحظات إضافية:*`);
      waLines.push(notes);
    }

    const fullMessageText = waLines.join("\n");

    if (targetType === "whatsapp") {
      const waUrl = DEFAULT_WHATSAPP_NUMBER
        ? `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessageText)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessageText)}`;
      window.open(waUrl, "_blank");
      setSentMsg("تمت صياغة رسالة الواتساب المنسقة وفتح التطبيق بنجاح 💬⚡");
    } else {
      const mailUrl = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(
        `طلب عرض سعر (${activeServ?.name}) — ${name}`
      )}&body=${encodeURIComponent(fullMessageText)}`;
      window.location.href = mailUrl;
      setSentMsg("تمت صياغة البريد الإلكتروني الرسمي وإطلاقه بنجاح ✉️⚡");
    }
  };

  const activeServ = ATG_SERVICES.find((s) => s.id === selectedService);

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* هالة خلفية ذهبية ناعمة */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-b from-ochre/15 via-ochre-deep/5 to-transparent blur-2xl opacity-60" />

      <form
        className="relative overflow-hidden rounded-[2.2rem] border border-ochre/35 bg-ivory-soft p-6 sm:p-10 md:p-14 shadow-[0_20px_70px_-20px_rgba(184,146,63,0.25)] backdrop-blur-xl"
        noValidate
      >
        {/* شريط ذهبي علوي رفيع مميز */}
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-ochre-deep to-transparent" />

        {/* ═══ الخطوة الأولى: تحديد الخدمة ═══ */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between border-b border-ochre/20 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-ochre-deep font-heading text-xs font-bold text-ivory">
                ١
              </span>
              <h3 className="font-heading text-xl font-bold text-ink">
                اختر الخدمة المطلوبة
              </h3>
            </div>
            <span className="font-body text-xs font-medium text-ochre-deep">
              من تخصصات ATG الأربعة
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ATG_SERVICES.map((s) => {
              const active = selectedService === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedService(s.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-5 text-right transition-all duration-300 outline-none ${
                    active
                      ? "border-ochre-deep bg-ivory shadow-[0_8px_30px_-10px_rgba(184,146,63,0.4)] ring-2 ring-ochre-deep/40 translate-y-[-2px]"
                      : "border-ochre/25 bg-ivory/70 hover:border-ochre-deep/40 hover:bg-ivory hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-3xl shrink-0 transition-transform duration-300 group-hover:scale-110">
                      {s.icon}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-body text-[0.65rem] font-bold tracking-widest transition-colors ${
                        active
                          ? "bg-ochre-deep text-ivory"
                          : "bg-ochre/15 text-ochre-deep"
                      }`}
                    >
                      {s.num}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-heading text-base font-bold text-ink transition-colors group-hover:text-ochre-deep">
                      {s.name}
                    </h4>
                    <span dir="ltr" className="block font-body text-[0.65rem] font-semibold text-oasis tracking-wider mt-0.5">
                      {s.tag}
                    </span>
                    <p className="mt-2 font-body text-xs font-normal leading-relaxed text-ink/70">
                      {s.desc}
                    </p>
                  </div>

                  {active && (
                    <span className="absolute -top-1 -end-1 size-3 rounded-full bg-ochre-deep ring-4 ring-ivory" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ الخطوة الثانية: المواصفات التقنية والموقع ═══ */}
        <div className="mb-10 rounded-2xl border border-ochre/25 bg-ivory/90 p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-ochre/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-ochre-deep font-heading text-xs font-bold text-ivory">
                ٢
              </span>
              <h3 className="font-heading text-lg font-bold text-ink">
                المواصفات التقنية والموقع — ({activeServ?.name})
              </h3>
            </div>
            <span className="hidden sm:inline font-body text-xs font-normal text-ink/60">
              تساعد مهندسينا في إعداد الدراسة
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* اختيار الدولة */}
            <div>
              <label htmlFor="country" className={labelCls}>
                <span>الدولة / منطقة المشروع</span>
                <span className="text-ochre-deep">*</span>
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputCls}
              >
                <option value="المملكة العربية السعودية 🇸🇦">المملكة العربية السعودية 🇸🇦</option>
                <option value="المملكة الأردنية الهاشمية 🇯🇴">المملكة الأردنية الهاشمية 🇯🇴</option>
                <option value="دول الخليج العربي 🌍">دول الخليج العربي (الإمارات، الكويت، قطر...)</option>
              </select>
            </div>

            {/* حقول ضخ المياه */}
            {selectedService === "pumping" && (
              <>
                <div>
                  <label htmlFor="pumpDepth" className={labelCls}>
                    <span>عمق البئر / مصدر الماء</span>
                    <span className="text-ink/40 font-normal">اختياري</span>
                  </label>
                  <input
                    id="pumpDepth"
                    type="text"
                    className={inputCls}
                    placeholder="مثال: 120 متر / بئر ارتوازي"
                    value={pumpDepth}
                    onChange={(e) => setPumpDepth(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="pumpPower" className={labelCls}>
                    <span>قدرة المضخة / معدل التدفق المطلوب</span>
                    <span className="text-ink/40 font-normal">اختياري</span>
                  </label>
                  <input
                    id="pumpPower"
                    type="text"
                    className={inputCls}
                    placeholder="مثال: مضخة 30 حصان / تدفق 50 م³ في الساعة"
                    value={pumpPower}
                    onChange={(e) => setPumpPower(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* حقول أنظمة EPC */}
            {selectedService === "epc" && (
              <>
                <div>
                  <label htmlFor="epcFacility" className={labelCls}>
                    <span>نوع المنشأة</span>
                    <span className="text-ochre-deep">*</span>
                  </label>
                  <select
                    id="epcFacility"
                    value={epcFacility}
                    onChange={(e) => setEpcFacility(e.target.value)}
                    className={inputCls}
                  >
                    <option value="منشأة تجارية / مصنع">منشأة تجارية / مصنع / مستودع</option>
                    <option value="مشروع زراعي كبير">مشروع زراعي كبير</option>
                    <option value="مبنى سكني / فيلا">مبنى سكني / فيلا</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="epcCapacity" className={labelCls}>
                    <span>القدرة التقديرية / الفاتورة</span>
                    <span className="text-ink/40 font-normal">اختياري</span>
                  </label>
                  <input
                    id="epcCapacity"
                    type="text"
                    className={inputCls}
                    placeholder="مثال: قدرة 100kW / فاتورة 15 ألف ريال"
                    value={epcCapacity}
                    onChange={(e) => setEpcCapacity(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* حقول الأنظمة المنفصلة Off-Grid */}
            {selectedService === "offgrid" && (
              <>
                <div>
                  <label htmlFor="offgridLoad" className={labelCls}>
                    <span>ساعات التشغيل وطبيعة الأحمال</span>
                    <span className="text-ink/40 font-normal">اختياري</span>
                  </label>
                  <input
                    id="offgridLoad"
                    type="text"
                    className={inputCls}
                    placeholder="مثال: إنارة وتكييف ومضخة 24/7"
                    value={offgridLoad}
                    onChange={(e) => setOffgridLoad(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="hasGenerator" className={labelCls}>
                    <span>مولد ديزل احتياطي بالموقع</span>
                    <span className="text-ochre-deep">*</span>
                  </label>
                  <select
                    id="hasGenerator"
                    value={hasGenerator}
                    onChange={(e) => setHasGenerator(e.target.value)}
                    className={inputCls}
                  >
                    <option value="نعم">نعم — يتوفر مولد احتياطي</option>
                    <option value="لا">لا — يعتمد على الشمس والبطاريات 100%</option>
                  </select>
                </div>
              </>
            )}

            {/* حقول الهياكل المعدنية Structures */}
            {selectedService === "structures" && (
              <>
                <div>
                  <label htmlFor="structureType" className={labelCls}>
                    <span>نوع التثبيت والهيكل</span>
                    <span className="text-ochre-deep">*</span>
                  </label>
                  <select
                    id="structureType"
                    value={structureType}
                    onChange={(e) => setStructureType(e.target.value)}
                    className={inputCls}
                  >
                    <option value="هياكل أرضية Ground-Mounted">هياكل أرضية Ground-Mounted</option>
                    <option value="أسطح جمالونات / ساندويتش بنل">أسطح جمالونات / ساندويتش بنل Roof</option>
                    <option value="مظلات سيارات Solar Carport">مظلات سيارات Solar Carport</option>
                    <option value="أنظمة دمج زراعي Agri-PV">أنظمة دمج زراعي Agri-PV</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="materialType" className={labelCls}>
                    <span>نوع الفولاذ والتغليف</span>
                    <span className="text-ochre-deep">*</span>
                  </label>
                  <select
                    id="materialType"
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className={inputCls}
                  >
                    <option value="فولاذ مغلفن بالغمس الحار Hot-Dip Galvanized">فولاذ مغلفن بالغمس الحار Hot-Dip Galvanized</option>
                    <option value="فولاذ زام ZAM للمناطق الساحلية">فولاذ زام ZAM للمناطق الساحلية والشديدة الرطوبة</option>
                    <option value="ألمنيوم أنودايزد Anodized Aluminum">ألمنيوم أنودايزد Anodized Aluminum</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══ الخطوة الثالثة: بيانات العميل والاتصال ═══ */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between border-b border-ochre/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-ochre-deep font-heading text-xs font-bold text-ivory">
                ٣
              </span>
              <h3 className="font-heading text-lg font-bold text-ink">
                بيانات التواصل المباشر
              </h3>
            </div>
            <span className="font-body text-xs font-medium text-ochre-deep">
              سنتواصل معك خلال ٢٤ ساعة
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>
                <span>الاسم الكامل</span>
                <span className="text-ochre-deep">*</span>
              </label>
              <input id="name" name="name" required autoComplete="name" className={inputCls} placeholder="اسمك الكريم" />
            </div>
            <div>
              <label htmlFor="company" className={labelCls}>
                <span>اسم الجهة / الشركة / المزرعة</span>
                <span className="text-ink/40 font-normal">اختياري</span>
              </label>
              <input id="company" name="company" autoComplete="organization" className={inputCls} placeholder="اسم الجهة أو المزرعة" />
            </div>
            <div>
              <label htmlFor="phone" className={labelCls}>
                <span>الهاتف / واتساب</span>
                <span className="text-ochre-deep">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                className={`${inputCls} text-right`}
                placeholder="+966 5X XXX XXXX"
              />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>
                <span>البريد الإلكتروني</span>
                <span className="text-ink/40 font-normal">اختياري</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                className={`${inputCls} text-right`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="notes" className={labelCls}>
              <span>ملاحظات إضافية للمهندسين</span>
              <span className="text-ink/40 font-normal">اختياري</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className={`${inputCls} resize-y`}
              placeholder="اكتب أي ملاحظات أو استفسارات إضافية تود إطلاع مهندسينا عليها..."
            />
          </div>
        </div>

        {/* ═══ منطقة الأزرار الإجراءات الفاخرة الموحدة بالهوية ═══ */}
        <div className="pt-6 border-t border-ochre/25">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* زر الواتساب — بأخضر الحياة الرسمي لشركة ATG (#0B7A5C) */}
            <button
              type="button"
              onClick={(e) => handleSend("whatsapp", e)}
              className="btn-glow flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0B7A5C] hover:bg-[#08634a] px-6 py-4 font-heading text-base font-bold text-ivory transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(11,122,92,0.5)] hover:shadow-[0_12px_35px_-6px_rgba(11,122,92,0.65)] hover:translate-y-[-1px]"
            >
              <svg className="size-5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.762.459 3.483 1.332 5.004L2 22l5.127-1.334c1.472.802 3.136 1.226 4.885 1.226 5.508 0 9.99-4.478 9.99-9.984 0-5.506-4.482-9.984-9.99-9.984zm0 18.232c-1.503 0-2.973-.404-4.254-1.168l-.305-.181-3.16.822.844-3.076-.198-.315c-.84-1.337-1.284-2.883-1.284-4.473 0-4.542 3.696-8.236 8.357-8.236 4.66 0 8.356 3.694 8.356 8.236 0 4.542-3.696 8.236-8.356 8.236z"/>
              </svg>
              <span>إرسال عبر الواتساب</span>
            </button>

            {/* زر البريد الرسمي — متناسق الارتفاع والهندسة */}
            <button
              type="button"
              onClick={(e) => handleSend("email", e)}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-ochre/40 bg-ivory px-6 py-4 font-heading text-base font-bold text-ink hover:border-ochre-deep hover:bg-ochre-deep hover:text-ivory transition-all duration-300 shadow-sm"
            >
              <svg className="size-5 shrink-0 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0017.25 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>إرسال بالبريد الرسمي</span>
            </button>
          </div>

          <p className="mt-4 text-center font-body text-xs font-normal text-ink/60">
            🔒 نلتزم بالخصوصية الكاملة لبياناتكم ومشاريعكم وفق أعلى المعايير الفنية.
          </p>

          {sentMsg && (
            <p
              role="status"
              className="mt-4 rounded-2xl border border-pine/30 bg-pine/10 p-4 text-center font-body text-sm font-medium text-pine animate-fadeIn"
            >
              {sentMsg}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
