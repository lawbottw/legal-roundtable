import { Metadata } from "next";
import { getAuthorAdmin } from "@/services/AuthorServiceAdmin";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;

    const author = await getAuthorAdmin(resolvedParams.id);

    if (!author) {
      return {
        title: '作者不存在 - 法律圓桌',
        description: '作者不存在或已被移除。',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const baseUrl = 'https://lawtable.org';
    const pageUrl = `${baseUrl}/author/${resolvedParams.id}`;
    const ogImageUrl = author.avatar || `${baseUrl}/img/logo.png`;
    const authorTitle = author.title || '專欄作家';
    const authorDescription = author.description;

    return {
      title: `${author.name} ${authorTitle}`,
      description: authorDescription,
      authors: [{ name: author.name }],
      openGraph: {
        title: `${author.name} - ${authorTitle}`,
        description: authorDescription,
        url: pageUrl,
        siteName: '法律圓桌',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: author.name,
          },
        ],
        locale: 'zh_TW',
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${author.name} - ${authorTitle}`,
        description: authorDescription,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '載入中... - 法律圓桌',
      description: '正在載入作者資料，請稍候。',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
