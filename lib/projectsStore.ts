import { Project } from "@/types/project";

// قائمة المشاريع المبدئية خالية للبدء بالمشاريع الحقيقية مباشرة عبر لوحة التحكم
export const initialProjects: Project[] = [];

const STORAGE_KEY = "atg_projects_v1";

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return initialProjects;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading local projects store", err);
  }
  return initialProjects;
}

/** جلب المشاريع الحية الدائمة من السيرفر عبر PHP API */
export async function fetchServerProjects(): Promise<Project[]> {
  try {
    const res = await fetch("/api/projects.php", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as Project[];
      if (Array.isArray(data)) {
        saveProjects(data, false); // حفظ بالـ localStorage كـ Cache محلي
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch server projects, fallback to local store", err);
  }
  return getStoredProjects();
}

export function saveProjects(projects: Project[], syncServer = true): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    // تزامن تلقائي مع السيرفر ICDSoft عبر PHP API
    if (syncServer) {
      fetch("/api/projects.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      }).catch((err) => console.error("Server sync error:", err));
    }

    return true;
  } catch (err) {
    console.error("Error saving projects store", err);
    if (typeof window !== "undefined") {
      alert("⚠️ تعذر حفظ المشروع: مساحة التخزين ممتلئة. يرجى تجربة صورة بحجم أصغر.");
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
