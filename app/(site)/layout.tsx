import type { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import RouteScrollReset from "@/components/RouteScrollReset";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* التخطيط المشترك لصفحات الموقع الداخلية (من نحن، خدماتنا، مشاريعنا، تواصل).
   الصفحة الرئيسية (app/page.tsx) خارج هذه المجموعة وتحتفظ بتخطيطها السينمائي. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <RouteScrollReset />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
