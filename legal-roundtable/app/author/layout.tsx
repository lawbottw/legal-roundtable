import { Metadata } from "next";


export const metadata: Metadata = {
  title: "作者群 - 法律圓桌",
  description: "律師、法務、法律工作者的知識分享平台，探索多元法律觀點與實務經驗。",
  openGraph: {
    title: "法律知識專欄文章 - 法律圓桌",
    description: "律師、法務、法律工作者的知識分享平台，探索多元法律觀點與實務經驗。",
    url: "https://lawtable.org/author",
    type: "website",
    images: [
      {
        url: "https://lawtable.org/img/logo.png",
        width: 1200,
        height: 630,
        alt: "作者群 - 法律圓桌"
      }
    ]
  }
};

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
