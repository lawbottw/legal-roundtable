'use client'
import { useState, useEffect } from "react";
import { Search, Calendar, User, ArrowRight, BookOpen, Star } from "lucide-react";
import { Button } from '@/components/ui/button';
import { getLatestArticles, getFeaturedArticles } from '@/services/ArticleService';
import { getAuthorsByIds } from '@/services/AuthorService';
import { categories, CategoryKey } from '@/data/categories';
import { Article } from '@/types/article';
import { Author } from '@/types/author';
import Link from 'next/link';
import Image from 'next/image';

// 擴展 Article 和 Author 類型以包含額外資料（僅用於顯示）
type ArticleWithAuthor = Article & { author: Author };
type AuthorWithCount = Author & { articlesCount: number };

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [featuredAuthors, setFeaturedAuthors] = useState<AuthorWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [latestArticles, featuredArticles] = await Promise.all([
          getLatestArticles(20),
          getFeaturedArticles(8)
        ]);

        // 收集所有唯一的 authorId
        const authorIds = Array.from(
          new Set([...latestArticles, ...featuredArticles].map(article => article.authorId))
        );

        // 批次獲取所有作者資料
        const authorsMap = await getAuthorsByIds(authorIds);

        // 將作者資料附加到文章上
        const articlesWithAuthors: ArticleWithAuthor[] = latestArticles.map(article => ({
          ...article,
          author: authorsMap.get(article.authorId) || {
            id: article.authorId,
            name: '未知作者',
            description: '',
            avatar: ''
          }
        }));

        setArticles(articlesWithAuthors);

        // 計算每位作者的文章數量
        const authorCountMap = new Map<string, number>();
        latestArticles.forEach(article => {
          const count = authorCountMap.get(article.authorId) || 0;
          authorCountMap.set(article.authorId, count + 1);
        });

        // 建立帶有文章數量的作者列表
        const authorsWithCount: AuthorWithCount[] = Array.from(authorsMap.values())
          .map(author => ({
            ...author,
            articlesCount: authorCountMap.get(author.id) || 0
          }))
          .slice(0, 8);

        setFeaturedAuthors(authorsWithCount);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categoryKeys = Object.keys(categories) as CategoryKey[];
  const categoryOptions = ["全部", ...categoryKeys.map(key => categories[key].name)];

  const filteredArticles = articles.filter(article => {
    const categoryName = categories[article.category as CategoryKey]?.name;
    const matchesCategory = selectedCategory === "全部" || categoryName === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticlesList = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 border-b border-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              法律專欄
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              深度法律分析，專業見解分享 - 由資深法律專家為您解讀最新法律議題
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="搜尋文章..."
              className="w-full pl-10 pr-4 py-3 border border-muted rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Featured Authors Section */}
      {featuredAuthors.length > 0 && (
        <section id="writers" className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">特約作者</h2>
                <p className="text-muted-foreground">來自法律界的專業作者</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredAuthors.map((author) => (
                <div 
                  key={author.id} 
                  className="bg-background border border-muted rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20 group"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {author.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{author.title || '法律專家'}</p>
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {author.articlesCount} 篇文章
                        </span>
                      </div>
                      {author.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {author.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-start mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticlesList.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-2xl font-bold text-foreground">精選文章</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredArticlesList.map((article) => (
                  <Link key={article.id} href={`/blog/${article.id}`}>
                    <article className="group cursor-pointer bg-background border border-muted rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                      {article.image && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={800}
                            height={450}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                            {categories[article.category as CategoryKey]?.name || article.category}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.updatedAt.seconds * 1000).toLocaleDateString('zh-TW')}
                          </span>
                          <span>{article.readTime || 5} 分鐘閱讀</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                              {article.author.avatar ? (
                                <Image
                                  src={article.author.avatar}
                                  alt={article.author.name}
                                  width={20}
                                  height={20}
                                  className="object-cover"
                                />
                              ) : (
                                <User className="h-3 w-3 text-primary" />
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{article.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{article.views || 0} 次閱讀</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">最新文章</h2>
              <div className="grid gap-6">
                {regularArticles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.id}`}>
                    <article className="group cursor-pointer bg-background border border-muted rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                      <div className="flex flex-col md:flex-row gap-6">
                        {article.image && (
                          <div className="md:w-48 flex-shrink-0">
                            <div className="aspect-[4/3] overflow-hidden rounded-lg">
                              <Image
                                src={article.image}
                                alt={article.title}
                                width={192}
                                height={144}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                              {categories[article.category as CategoryKey]?.name || article.category}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(article.updatedAt.seconds * 1000).toLocaleDateString('zh-TW')}
                            </span>
                            <span>{article.readTime || 5} 分鐘閱讀</span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                                {article.author.avatar ? (
                                  <Image
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                  />
                                ) : (
                                  <User className="h-3 w-3 text-primary" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{article.author.name}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{article.views || 0} 次閱讀</span>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">找不到相關文章</h3>
              <p className="text-muted-foreground">請嘗試調整搜尋條件或選擇其他分類</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}