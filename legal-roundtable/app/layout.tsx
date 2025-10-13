import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";
import { AuthProvider } from '@/contexts/AuthContext';

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: '--font-noto-sans-tc',
});


export const metadata: Metadata = {
  title: "法律圓桌 - 台灣法律專業知識與實務分析",
  description: "法律圓桌是一個專為法律工作者打造的專業平台，撰文者包含律師、法務、法律科技從業人員等，匯集實務見解、判決分析與法律新知，讓專業知識更可近、更可懂。",
  keywords: ["法律問題"],
  authors: [{ name: "" }],
  creator: "",
  publisher: "",
  applicationName: "",
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
    title: "",
    description: "",
    url: "",
    siteName: "",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "",
    description: "",
    images: [""],
  },
  alternates: {
    canonical: "",
  },
  category: "",
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
        "@id": "https://easy-law.net/#organization",
        name: "",
        alternateName: [""],
        url: "https://easy-law.net/",
        logo: {
          "@type": "ImageObject",
          url: "https://easy-law.net/logo.png",
          width: 512,
          height: 512
        },
        description: "",
        foundingDate: "2024",
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
      // {
      //   "@type": "Service",
      //   "@id": "https://easy-law.net/#service",
      //   name: "",
      //   description: "",
      //   provider: {
      //     "@id": "https://easy-law.net/#organization"
      //   },
      //   serviceType: "法律諮詢",
      //   category: ["法律服務", "AI諮詢", "線上法律諮詢"],
      //   audience: {
      //     "@type": "Audience",
      //     name: "一般民眾及法律工作者"
      //   },
      //   areaServed: {
      //     "@type": "Country",
      //     name: "台灣"
      //   },
      //   availableChannel: {
      //     "@type": "ServiceChannel",
      //     name: "線上平台",
      //     serviceUrl: "https://easy-law.net/c/"
      //   },
      //   offers: {
      //     "@type": "Offer",
      //     name: "免費AI法律諮詢",
      //     description: "完全免費的AI法律諮詢服務，無需註冊",
      //     price: "0",
      //     priceCurrency: "TWD",
      //     availability: "https://schema.org/InStock",
      //     validFrom: "2024-01-01"
      //   },
      //   hasOfferCatalog: {
      //     "@type": "OfferCatalog",
      //     name: "法律諮詢服務項目",
      //     itemListElement: [
      //       {
      //         "@type": "Offer",
      //         itemOffered: {
      //           "@type": "Service",
      //           name: "民事法律諮詢",
      //           description: "民事糾紛、契約問題、財產權等相關法律諮詢"
      //         }
      //       },
      //       {
      //         "@type": "Offer", 
      //         itemOffered: {
      //           "@type": "Service",
      //           name: "刑事法律諮詢",
      //           description: "刑事案件、告訴告發、刑責認定等相關法律諮詢"
      //         }
      //       },
      //       {
      //         "@type": "Offer",
      //         itemOffered: {
      //           "@type": "Service", 
      //           name: "勞動法律諮詢",
      //           description: "勞資糾紛、職場權益、勞動契約等相關法律諮詢"
      //         }
      //       }
      //     ]
      //   }
      // },
      // {
      //   "@type": "WebSite",
      //   "@id": "https://easy-law.net/#website",
      //   url: "https://easy-law.net/",
      //   name: "EasyLaw 律點通",
      //   alternateName: "律點通",
      //   description: "台灣免費AI法律諮詢",
      //   publisher: {
      //     "@id": "https://easy-law.net/#organization"
      //   },
      //   inLanguage: "zh-TW",
      //   potentialAction: {
      //     "@type": "SearchAction",
      //     target: "https://easy-law.net/c?textInput={search_term_string}",
      //     "query-input": "required name=search_term_string"
      //   }
      // },
      // {
      //   "@type": "WebPage",
      //   "@id": "https://easy-law.net/#webpage",
      //   url: "https://easy-law.net",
      //   name: "台灣免費AI法律諮詢 | EasyLaw 律點通",
      //   description: "EasyLaw 律點通是台灣領先的AI法律諮詢平台，提供24/7免費諮詢服務。基於2000萬筆判決資料的數據，為您解答各種法律問題。",
      //   isPartOf: {
      //     "@id": "https://easy-law.net/#website"
      //   },
      //   about: {
      //     "@id": "https://easy-law.net/#organization"
      //   },
      //   mainEntity: {
      //     "@id": "https://easy-law.net/#service"
      //   },
      //   inLanguage: "zh-TW"
      // }
    ]
  };

  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body className={`${notoSansTC.variable} font-noto-sans-tc antialiased`}>
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
            <div className="min-h-dvh flex flex-col">
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
