import { Metadata } from "next";


export const metadata: Metadata = {
  title: "法律知識專欄文章 - 法律圓桌",
  description: "探索法律議題、專家見解與最新法規動態，盡在法律圓桌部落格。",
  openGraph: {
    title: "法律知識專欄文章 - 法律圓桌",
    description: "探索法律議題、專家見解與最新法規動態，盡在法律圓桌部落格。",
    url: "https://lawtable.org/blog",
    type: "website",
    images: [
      {
        url: "https://lawtable.org/img/logo.png",
        width: 1200,
        height: 630,
        alt: "法律知識專欄文章 - 法律圓桌"
      }
    ]
  }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
