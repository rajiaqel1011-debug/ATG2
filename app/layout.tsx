import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://atg-solar.com"; // يُحدَّث عند ربط الدومين

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "ATG — Advanced Technology Green | شريككم الأمثل في أنظمة الطاقة الشمسية",
    template: "%s | ATG — Advanced Technology Green",
  },
  icons: {
    icon: [
      { url: "/images/icon.svg", type: "image/svg+xml" },
      { url: "/images/brand/icon.png", type: "image/png" },
    ],
    shortcut: "/images/icon.svg",
    apple: "/images/brand/icon.png",
  },
  description:
    "ATG — Advanced Technology Green — حلول متكاملة لأنظمة الطاقة الشمسية: أنظمة EPC، ضخ المياه بالطاقة الشمسية، الأنظمة المنفصلة عن الشبكة، وتوريد الهياكل المعدنية. خبرة منذ 2017 في الأردن والسعودية.",
  keywords: [
    "الطاقة الشمسية",
    "ضخ المياه بالطاقة الشمسية",
    "أنظمة off-grid",
    "الطاقة المتجددة السعودية",
    "ألواح شمسية",
    "EPC طاقة شمسية",
    "ATG",
    "Advanced Technology Green",
  ],
  authors: [{ name: "ATG — Advanced Technology Green" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: "ATG — Advanced Technology Green",
    title: "شريككم الأمثل في أنظمة الطاقة الشمسية",
    description:
      "من الشمس إلى الماء — حلول طاقة شمسية متكاملة في الأردن والسعودية. تصميم، توريد، تركيب، وأنظمة ضخ مياه بالطاقة الشمسية.",
    images: [
      {
        url: "/videos/web/posters/drop-to-desert.jpg",
        width: 1280,
        height: 716,
        alt: "ATG — Advanced Technology Green — من قطرة ماء تبدأ الحكاية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATG — Advanced Technology Green",
    description:
      "حلول طاقة شمسية متكاملة — من الشمس إلى الماء. الأردن والسعودية.",
    images: ["/videos/web/posters/drop-to-desert.jpg"],
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "شركة الطاقة الخضراء المتقدمة",
  alternateName: "Advanced Technology Green (ATG)",
  url: SITE_URL,
  slogan: "شريككم الأمثل في أنظمة الطاقة الشمسية",
  foundingDate: "2017",
  areaServed: ["SA", "JO"],
  knowsAbout: [
    "أنظمة الطاقة الشمسية",
    "ضخ المياه بالطاقة الشمسية",
    "الأنظمة المنفصلة عن الشبكة",
    "توريد الهياكل المعدنية",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* تخطّي إلى المحتوى — للوصولية.
            suppressHydrationWarning: إضافات RTL في المتصفح تحقن dir/data-rtlfix
            على عناصر النص العربي قبل الـhydration؛ نتساهل معها هنا. */}
        <a
          href="#about"
          suppressHydrationWarning
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ochre-deep focus:px-5 focus:py-2.5 focus:font-body focus:font-bold focus:text-ivory"
        >
          تخطّي إلى المحتوى
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
