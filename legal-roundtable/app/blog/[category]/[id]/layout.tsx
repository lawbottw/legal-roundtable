import { Metadata } from 'next';
import { getArticleByIdAdmin } from '@/services/ArticleServerService';

interface Props {
  params: Promise<{ category: string; id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    // 使用 server service 取得文章資料（包含作者）
    const article = await getArticleByIdAdmin(resolvedParams.id);

    if (!article) {
      return {
        title: '文章不存在 - 法律圓桌',
        description: '您查找的文章不存在或已被移除。',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // 構建完整的 URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lawtable.org';
    const pageUrl = `${baseUrl}/blog/${resolvedParams.category}/${resolvedParams.id}`;
    const ogImageUrl = article.image || `${baseUrl}/img/default.png`;

    // 處理 keywords
    const keywordsArray = Array.isArray(article.keywords) ? article.keywords : [];
    const keywordsString = keywordsArray.length > 0 ? keywordsArray.join(', ') : undefined;

    // 處理 Firestore Timestamp
    let publishedTime: string | undefined = undefined;
    if (article.updatedAt && typeof article.updatedAt.toDate === 'function') {
      publishedTime = article.updatedAt.toDate().toISOString();
    }

    // 使用已獲取的 author 資料
    const authorName = article.author?.name || '法律圓桌團隊';

    return {
      title: article.title + ' - 法律圓桌',
      description: article.excerpt,
      keywords: keywordsString,
      authors: [{ name: authorName }],
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: pageUrl,
        siteName: '法律圓桌',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          }
        ],
        locale: 'zh_TW',
        type: 'article',
        publishedTime,
        authors: [authorName],
        tags: keywordsArray.length ? keywordsArray : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [ogImageUrl],
        creator: '@LawTable',
        site: '@LawTable',
      },
      alternates: {
        canonical: pageUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'article:author': authorName,
        'article:section': article.category || '',
        'article:tag': keywordsString || '',
        'og:locale:alternate': 'zh_CN',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '載入中... - 法律圓桌',
      description: '正在載入文章內容，請稍候。',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function BlogArticleLayout({ children }: Props) {
  return children;
}