"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis } from "@/components/SmoothScroll";

/** يضمن التمرير الفوري لأعلى الصفحة عند الانتقال بين الصفحات */
export default function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
