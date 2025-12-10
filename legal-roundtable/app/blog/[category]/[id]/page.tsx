import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtonClient } from "@/components/blog/share-button-client";
import { ViewTracker } from "@/components/blog/view-tracker";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getArticleByIdAdmin, getLatestArticlesWithAuthors, getArticlesByAuthorWithAuthor } from '@/services/ArticleServerService';
import { categories, CategoryKey } from '@/data/categories';
import { ArticleWithAuthor } from '@/types/article';
import { extractH1FromMarkdown } from '@/lib/markdown-utils';
import Script from "next/script";
import { ReactNode } from 'react';

interface PageParams {
  category: string;
  id: string;
}

// 移除 Markdown 連結，只保留文字
const removeMarkdownLinks = (text: string): string => {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

// 遞迴提取 React children 的純文字
const extractTextFromChildren = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren((children as { props: { children?: ReactNode } }).props.children);
  }
  return '';
};

// 生成標題 ID 的輔助函數
const generateHeadingId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-');
};

// 建立 heading ID 計數器的工廠函數
const createHeadingIdGenerator = () => {
  const idCountMap: Record<string, number> = {};
  
  return (text: string) => {
    const baseId = generateHeadingId(text);
    
    if (idCountMap[baseId] === undefined) {
      idCountMap[baseId] = 0;
    } else {
      idCountMap[baseId]++;
    }
    
    return idCountMap[baseId] === 0 ? baseId : `${baseId}-${idCountMap[baseId]}`;
  };
};

// 移除第一個 H1 的輔助函數
function removeFirstH1(markdown: string): string {
  let found = false;
  return markdown
    .split('\n')
    .filter(line => {
      if (!found && /^#\s+/.test(line.trim())) {
        found = true;
        return false;
      }
      return true;
    })
    .join('\n');
}

export default async function BlogPostPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = await params;

  // 檢查分類是否存在
  const categoryKey = resolvedParams.category as CategoryKey;
  const category = categories[categoryKey];
  
  if (!category) {
    console.error('Category not found:', resolvedParams.category);
    notFound();
  }

  // 使用 server service 獲取文章（包含作者資料）
  const post = await getArticleByIdAdmin(resolvedParams.id);

  if (!post) {
    notFound();
  }

  // 獲取推薦文章：優先同作者文章，不足則補充最新文章
  let relatedPosts: ArticleWithAuthor[] = [];
  
  if (post.authorId) {
    const authorArticles = await getArticlesByAuthorWithAuthor(post.authorId, 3);
    // 排除當前文章
    relatedPosts = authorArticles.filter(article => article.id !== post.id).slice(0, 2);
  }
  
  // 如果同作者文章不足 2 篇，補充最新文章
  if (relatedPosts.length < 2) {
    const latestArticles = await getLatestArticlesWithAuthors(5);
    const additionalArticles = latestArticles
      .filter(article => article.id !== post.id && !relatedPosts.some(p => p.id === article.id))
      .slice(0, 2 - relatedPosts.length);
    relatedPosts = [...relatedPosts, ...additionalArticles];
  }

  // 基礎 URL
  const baseUrl = 'https://lawtable.org';
  const articleUrl = `${baseUrl}/blog/${resolvedParams.category}/${resolvedParams.id}`;

  // 提取 H1 標題
  const extractedH1 = extractH1FromMarkdown(post.content || '') || post.title;

  // 移除第一個 H1
  const contentWithoutFirstH1 = removeFirstH1(post.content || post.excerpt || '');

  // 結構化資料
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Breadcrumb 結構化資料
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "首頁",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "法律專欄",
            "item": `${baseUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": category.name,
            "item": `${baseUrl}/blog/${resolvedParams.category}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": extractedH1
          }
        ]
      },
      // Article 結構化資料
      {
        "@type": "Article",
        "headline": extractedH1,
        "description": post.excerpt,
        "image": post.image ? {
          "@type": "ImageObject",
          "url": post.image,
          "width": 1200,
          "height": 630
        } : undefined,
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "url": baseUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "法律圓桌",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`,
            "width": 180,
            "height": 60
          },
          "url": baseUrl
        },
        "datePublished": post.updatedAt && typeof post.updatedAt.toDate === 'function' 
          ? post.updatedAt.toDate().toISOString() 
          : new Date().toISOString(),
        "dateModified": post.updatedAt && typeof post.updatedAt.toDate === 'function'
          ? post.updatedAt.toDate().toISOString()
          : new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleUrl
        },
        "articleSection": category.name,
        "keywords": Array.isArray(post.keywords) ? post.keywords.join(", ") : "",
        "wordCount": (post.content || post.excerpt || "").split(/\s+/).length,
        "timeRequired": `PT${post.readTime || "5"}M`,
        "inLanguage": "zh-TW",
        "isAccessibleForFree": true
      },
      // WebPage 結構化資料
      {
        "@type": "WebPage",
        "@id": articleUrl,
        "url": articleUrl,
        "name": extractedH1,
        "description": post.excerpt,
        "isPartOf": {
          "@type": "WebSite",
          "url": baseUrl,
          "name": "法律圓桌"
        },
        "inLanguage": "zh-TW",
        "primaryImageOfPage": post.image ? {
          "@type": "ImageObject",
          "url": post.image,
          "width": 1200,
          "height": 630
        } : undefined
      },
      // FAQ 結構化資料
      ...(post.qa && post.qa.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": post.qa.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* View Tracker - client component */}
      <ViewTracker articleId={resolvedParams.id} />
      
      <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />

      <article className="max-w-7xl mx-auto px-3 md:px-6 py-12">
        <div className="mb-4">
          {/* Mobile breadcrumb - simplified */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4 md:hidden">
            <Link href="/blog" className="hover:text-foreground transition-colors">法律專欄</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="truncate">{extractedH1}</span>
          </div>
          
          {/* Desktop breadcrumb - full path */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">首頁</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-foreground transition-colors">法律專欄</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/blog/${resolvedParams.category}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{extractedH1}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {extractedH1}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Link href={`/author/${post.author.id}`} className="flex items-center gap-3 group hover:text-primary transition-colors">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={post.author.avatar || '/logo.png'} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium group-hover:text-primary">{post.author.name}</span>
                  {post.author.title && (
                    <div className="text-sm text-muted-foreground">{post.author.title}</div>
                  )}
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.updatedAt && typeof post.updatedAt.toDate === 'function' 
                  ? post.updatedAt.toDate().toLocaleDateString('zh-TW')
                  : '日期未知'}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}分鐘
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Badge variant="secondary">{category.name}</Badge>
            {Array.isArray(post.keywords) && post.keywords.map((keyword: string) => (
              <Badge key={keyword} variant="outline">{keyword}</Badge>
            ))}
            <div className="flex items-center gap-2">
              <ShareButtonClient 
                url={articleUrl}
                title={extractedH1}
              />
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Main Content Layout */}
        <div className="flex gap-8">
          {/* Article Content */}
          <div className="flex-1 min-w-0">
            {/* TOC for mobile - shows above content */}
            <div className="xl:hidden mb-8">
              <TableOfContents content={contentWithoutFirstH1} />
            </div>

            <div className="prose prose-lg max-w-none mb-16">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={(() => {
                  // 為每次渲染建立新的 ID 生成器
                  const getUniqueId = createHeadingIdGenerator();
                  
                  return {
                    h1: ({ children }) => {
                      const text = extractTextFromChildren(children);
                      const id = getUniqueId(text);
                      return <h1 id={id} className="text-foreground/95 mb-6 mt-8 scroll-mt-24">{children}</h1>;
                    },
                    h2: ({ children }) => {
                      const text = extractTextFromChildren(children);
                      const id = getUniqueId(text);
                      return <h2 id={id} className="text-foreground/90 mb-5 mt-8 border-l-4 border-primary pl-4 scroll-mt-24">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = extractTextFromChildren(children);
                      const id = getUniqueId(text);
                      return <h3 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h3>;
                    },
                    h4: ({ children }) => {
                      const text = extractTextFromChildren(children);
                      const id = getUniqueId(text);
                      return <h4 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h4>;
                    },
                    h5: ({ children }) => {
                      const text = extractTextFromChildren(children);
                      const id = getUniqueId(text);
                      return <h5 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h5>;
                    },
                    h6: ({ children }) => {
                      const text = extractTextFromChildren(children);
                      const id = getUniqueId(text);
                      return <h6 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h6>;
                    },
                    p: ({ children }) => <p className="text-foreground/90 mb-4">{children}</p>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/90 hover:text-primary underline underline-offset-4">{children}</a>,
                    strong: ({ children }) => (
                      <strong className="underline decoration-yellow-700 decoration-4 underline-offset-3">
                        {children}
                      </strong>
                    ),
                    img: ({ src, alt }) => (
                      <img 
                        src={src} 
                        alt={alt || ''} 
                        className="rounded-lg my-6 max-w-full h-auto shadow-md"
                        loading="lazy"
                      />
                    ),
                  };
                })()}
              >
                {contentWithoutFirstH1}
              </ReactMarkdown>
            </div>

            {/* Quick Q&A Section */}
            {post.qa && post.qa.length > 0 && (
              <section className="mb-8 qa-section">
                <h2 className="text-2xl font-bold mb-8">常見問題快速解答</h2>
                <div className="space-y-6">
                  {post.qa.map((item, index) => (
                    <div key={index} className="bg-muted/20 rounded-lg p-6 border-l-4 border-primary">
                      <h3 className="font-semibold text-lg mb-3 text-yellow-700">Q: {item.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">A: {item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Website Disclaimer */}
            <section className="mb-8">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-200">※ 網站聲明</h3>
                <div className="text-amber-700 dark:text-amber-300">
                  <p className='text-base'>著作權由「法律圓桌」所有，非經正式書面授權，不得任意使用。</p>
                  <p className='text-base'>文章資料內容僅供參考，所引用資料也請自行查核法令動態及現行有效之實務見解，不宜直接引用為主張或訴訟用途，具體個案仍請洽詢專業律師。</p>
                </div>
              </div>
            </section>

            <Separator className="mb-6" />

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-bold mb-8">相關文章推薦</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((article) => {
                    const articleCategory = categories[article.category as CategoryKey];
                    return (
                      <Link key={article.id} href={`/blog/${article.category}/${article.id}`}>
                        <div className="flex flex-col flex-1 h-full group p-4 rounded-lg border-0 bg-muted/20 hover:bg-muted/40 transition-all duration-200 hover:scale-[1.02]">
                          <Badge variant="outline" className="mb-1">
                            {articleCategory?.name || article.category}
                          </Badge>
                          <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="flex-1 text-base text-secondary-foreground leading-normal mb-3 line-clamp-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{article.author.name}</span>
                            <span>{article.readTime}分鐘</span>
                            <span className="group-hover:text-primary transition-colors">閱讀更多 →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - TOC for desktop */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24 max-h-1/2">
              <TableOfContents content={contentWithoutFirstH1} />
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
