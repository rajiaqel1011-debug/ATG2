import { Project } from "@/types/project";

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    category: "pumping",
    categoryLabel: "ضخ شمسي زراعي",
    img: "/videos/web/posters/farm.jpg",
    type: "ضخ شمسي زراعي",
    title: "ري مزرعة نخيل — القصيم",
    cap: "٧٥ كيلوواط · ضخ مباشر",
    loc: "المملكة العربية السعودية — القصيم",
    year: "٢٠٢٥",
    status: "completed",
    statusLabel: "مكتمل ومُشغّل",
    desc: "منظومة ضخ مياه متكاملة تعمل بالطاقة الشمسية المباشرة بدون بطاريات، تروي مزرعة نخيل شاسعة في منطقة القصيم باستهلاك صفر ديزل.",
    specs: [
      "مضخة غاطسة عالية الكفاءة بقدرة 75 كيلوواط",
      "انفرتر VEICHI SI23 بتقنية MPPT المتقدمة",
      "توفير +45,000 لتر ديزل سنوياً",
      "تشغيل تلقائي مع شروق الشمس وحتى الغروب",
    ],
  },
  {
    id: "proj-2",
    category: "well",
    categoryLabel: "آبار جوفية",
    img: "/videos/web/posters/well.jpg",
    type: "آبار جوفية",
    title: "منظومة بئر عميق — حائل",
    cap: "قدرة حتى ١٠٠٠ حصان · مضخة غاطسة",
    loc: "المملكة العربية السعودية — حائل",
    year: "٢٠٢٥",
    status: "completed",
    statusLabel: "مكتمل ومُشغّل",
    desc: "مشروع استخراج مياه جوفية من بئر عميق بقدرة جبارة تصل حتى 1000 حصان، مجهّزة بأحدث الحساسات وأنظمة المراقبة والتحكم الميداني.",
    specs: [
      "عمق البئر: 280 متراً تحت سطح الأرض",
      "محولات وكوابل صناعية مقاومة لظروف الصحراء",
      "نظام حماية من الجفاف والضخ الجاف",
      "مربوطة بنظام مراقبة ذكي عن بُعد",
    ],
  },
  {
    id: "proj-3",
    category: "epc",
    categoryLabel: "EPC تجاري",
    img: "/videos/web/posters/panel.jpg",
    type: "EPC تجاري",
    title: "نظام أسطح لمنشأة تجارية — عَمّان",
    cap: "٢٥٠ كيلوواط · مربوط بالشبكة",
    loc: "المملكة الأردنية الهاشمية — عَمّان",
    year: "٢٠٢٤",
    status: "completed",
    statusLabel: "مكتمل ومُشغّل",
    desc: "منظومة طاقة شمسية كبرى على أسطح منشأة صناعية تجارية كبرى مربوطة بالشبكة الكهربائية لتخفيض فاتورة الطاقة بنسبة 85%.",
    specs: [
      "ألواح شمسية Jinko Solar N-Type ذات كفاءة 25%",
      "انفرترات كبرى مع نظام صافي القياس Net Metering",
      "هياكل ألومنيوم مغلفنة مقاومة للرياح والأحمال",
      "عائد استثماري خيالي خلال أقل من 3 سنوات",
    ],
  },
  {
    id: "proj-4",
    category: "pumping",
    categoryLabel: "ضخ هجين",
    img: "/videos/web/posters/water-burst.jpg",
    type: "ضخ هجين",
    title: "مشروع ري بانقطاعٍ صفري — الخرج",
    cap: "٤٥ كيلوواط · هجين + تخزين",
    loc: "المملكة العربية السعودية — الخرج",
    year: "٢٠٢٥",
    status: "completed",
    statusLabel: "مكتمل ومُشغّل",
    desc: "نظام ري هجين يجمع بين الطاقة الشمسية والمولد المباشر لضمان ري المحاصيل الحساسة بضغط مياه ثابت وبدون أي انقطاع على مدار اليوم.",
    specs: [
      "تحويل تلقائي سلس بين الشمس والمولد",
      "توفير 70% من تكلفة التشغيل اليومية",
      "نظام تنقيط وحساسات ضغط مياه ذكية",
      "ضمان شامل للمكونات والتشغيل الميداني",
    ],
  },
  {
    id: "proj-5",
    category: "offgrid",
    categoryLabel: "Off-Grid",
    img: "/videos/web/posters/cable.jpg",
    type: "Off-Grid",
    title: "موقع نائي منفصل عن الشبكة — تبوك",
    cap: "٣٠ كيلوواط · بطاريات LFP",
    loc: "المملكة العربية السعودية — تبوك",
    year: "٢٠٢٥",
    status: "in_progress",
    statusLabel: "قيد التنفيذ",
    desc: "محطة طاقة منفصلة تماماً بالبطاريات لتغذية موقع زراعي نائي ومباني السكن والاتصالات بطاقة ناصعة ومستمرة 24 ساعة.",
    specs: [
      "بنك بطاريات ليثيوم LFP بعمر افتراضي +15 سنة",
      "إدارة بطاريات ذكية BMS وحماية حرارية",
      "تغذية أحمال حرجة ومحركات مضخات",
      "شاشات تحكم لمسية ومراقبة سحابية",
    ],
  },
  {
    id: "proj-6",
    category: "epc",
    categoryLabel: "Agri-PV",
    img: "/videos/web/posters/drop-to-desert.jpg",
    type: "Agri-PV",
    title: "هياكل مزرعة شمسية زراعية — وادي رم",
    cap: "هياكل مغلفنة ZAM · ٢٥ سنة ضمان",
    loc: "المملكة الأردنية الهاشمية — وادي رم",
    year: "٢٠٢٤",
    status: "completed",
    statusLabel: "مكتمل ومُشغّل",
    desc: "تصميم وتوريد وتركيب هياكل فولاذية عالية المزايا ومقاومة للتآكل والصدأ لدمج الألواح الشمسية مع المزارع الحقلية.",
    specs: [
      "فولاذ مغلفن بالغمس الحار وطلاء ZAM",
      "تحمل رياح تصل إلى 150 كم/ساعة",
      "ضمان ضد الصدأ والتآكل مدته 25 عاماً",
      "حماية الزراعات السفلى من الإشعاع الشمسي الحارق",
    ],
  },
];

const STORAGE_KEY = "atg_projects_v1";

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return initialProjects;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(raw) as Project[];
  } catch (err) {
    console.error("Error reading projects store", err);
    return initialProjects;
  }
}

export function saveProjects(projects: Project[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (err) {
    console.error("Error saving projects store", err);
    if (typeof window !== "undefined") {
      alert("⚠️ تعذر حفظ المشروع: مساحة التخزين ممتلئة. تم ضغط الصورة قدر الإمكان، يرجى تجربة صورة أخرى أو تقليل أبعادها.");
    }
    return false;
  }
}

/** ضغط الصور المرفوعة تلقائياً وتحويلها إلى WebP/JPEG خفيفة جداً (~80KB) لمنع امتلاء الذاكرة */
export function compressImage(file: File, maxWidth = 1200, maxHeight = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
