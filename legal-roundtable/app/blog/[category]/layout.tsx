import { Metadata } from "next";
import { categories } from "@/data/categories";

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = categories[category as keyof typeof categories];
  
  if (!categoryInfo) {
    return {
      title: "分類不存在 | 法律圓桌",
      description: "您查找的法律分類不存在，請返回專欄首頁瀏覽其他內容。"
    };
  }

  const seoTitle = `${categoryInfo.h1} | 法律圓桌`;
  const seoDescription = categoryInfo.description;
  const canonicalUrl = `https://easy-law.net/blog/${category}`;
  const imageUrl = `https://easy-law.net${categoryInfo.image}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      categoryInfo.name,
      "裁判分析",
      "法律普及",
      "律師",
      "法律知識",
      "法律圓桌"
    ],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: "法律圓桌",
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${categoryInfo.name} - 法律圓桌`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>;
}
