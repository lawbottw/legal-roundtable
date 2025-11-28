import type { Metadata } from "next";
// import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";
import { AuthProvider } from '@/contexts/AuthContext';

// const notoSansTC = Noto_Sans_TC({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "700", "900"],
//   variable: '--font-noto-sans-tc',
// });


export const metadata: Metadata = {
  title: "法律圓桌 - 法律專業知識與實務分析平台",
  description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
  keywords: ["法律問題", "法普文章", '裁判分析', '實務見解', '交流平台'],
  authors: [{ name: "法律圓桌" }],
  creator: "法律圓桌",
  publisher: "法律圓桌",
  applicationName: "法律圓桌",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  },
  openGraph: {
    title: "法律圓桌 - 台灣法律專業知識與實務分析",
    description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
    url: "https://lawtable.org",
    siteName: "法律圓桌",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://lawtable.org/img/logo.png",
        width: 1200,
        height: 630,
        alt: "法律圓桌 - 台灣法律專業知識與實務分析",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "法律圓桌 - 台灣法律專業知識與實務分析",
    description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
    images: ["https://lawtable.org/img/logo.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://lawtable.org/#organization",
        name: "法律圓桌 - 台灣法律專業知識與實務分析",
        alternateName: ["法律論壇"],
        url: "https://lawtable.org/",
        logo: {
          "@type": "ImageObject",
          url: "https://lawtable.org/logo.png",
          width: 512,
          height: 512
        },
        description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
        foundingDate: "2025",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["zh-TW", "Chinese"]
        },
        areaServed: {
          "@type": "Country",
          name: "台灣"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://lawtable.org/#website",
        url: "https://lawtable.org/",
        name: "法律圓桌 - 台灣法律專業知識與實務分析",
        alternateName: "法律圓桌",
        description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
        publisher: {
          "@id": "https://lawtable.org/#organization"
        },
        inLanguage: "zh-TW",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://lawtable.org/c?textInput={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://lawtable.org/#webpage",
        url: "https://lawtable.org",
        name: "法律圓桌 - 台灣法律專業知識與實務分析",
        description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
        isPartOf: {
          "@id": "https://lawtable.org/#website"
        },
        about: {
          "@id": "https://lawtable.org/#organization"
        },
        mainEntity: {
          "@id": "https://lawtable.org/#service"
        },
        inLanguage: "zh-TW"
      }
    ]
  };

  return (
    <html lang="zh-TW">
      <body>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
          id='gtag'
        />

        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}');
          `}
        </Script>
            <div className="min-h-dvh flex flex-col bg-background text-foreground">
              <main className="flex-1">
                <Header />
                <AuthProvider>
                  {children}
                </AuthProvider>
                <Footer />
              </main>
            </div>
      </body>
    </html>
  );
}
