'use client'
import { useState, useEffect } from "react";
import { Calendar, BookOpen, User, ArrowRight, Star, Filter, X, Loader2, ChevronDown } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getLatestArticles, getFeaturedArticles } from '@/services/ArticleService';
import { getAuthorsByIds } from '@/services/AuthorService';
import { categories, CategoryKey } from '@/data/categories';
import { Article } from '@/types/article';
import { Author } from '@/types/author';
import Link from 'next/link';
import Image from 'next/image';

type ArticleWithAuthor = Article & { author: Author };
type AuthorWithCount = Author & { articlesCount: number };

const DEFAULT_IMAGE = '/img/default.png';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("全部");
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [featuredAuthors, setFeaturedAuthors] = useState<AuthorWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [latestArticles, featuredArticles] = await Promise.all([
          getLatestArticles(20),
          getFeaturedArticles(8)
        ]);

        const authorIds = Array.from(
          new Set([...latestArticles, ...featuredArticles].map(article => article.authorId))
        );

        const authorsMap = await getAuthorsByIds(authorIds);

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

        const authorCountMap = new Map<string, number>();
        latestArticles.forEach(article => {
          const count = authorCountMap.get(article.authorId) || 0;
          authorCountMap.set(article.authorId, count + 1);
        });

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
  const authorOptions = ["全部", ...featuredAuthors.map(author => author.name)];

  const filteredArticles = articles.filter(article => {
    const categoryName = categories[article.category as CategoryKey]?.name;
    const matchesCategory = selectedCategory === "全部" || categoryName === selectedCategory;
    const matchesAuthor = selectedAuthor === "全部" || article.author.name === selectedAuthor;
    return matchesCategory && matchesAuthor;
  });

  const featuredArticlesList = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const activeFiltersCount = (selectedCategory !== "全部" ? 1 : 0) + (selectedAuthor !== "全部" ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-foreground animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground font-medium">載入中...</p>
        </div>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground">文章分類</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="w-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-primary" />
          <label className="text-sm font-semibold text-foreground">作者篩選</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {authorOptions.map((author) => (
            <Button
              key={author}
              onClick={() => setSelectedAuthor(author)}
              variant={selectedAuthor === author ? "default" : "secondary"}
              className="w-full"
            >
              {author}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  // Generate structured data for breadcrumb
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: "https://lawtable.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "法律知識專欄",
        item: "https://lawtable.org/blog",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* Hero Section with Gradient Overlay */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/blog-hero.jpg"
            alt="法律專欄"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              法律專欄
            </h1>
            <p className="text-lg md:text-xl text-white leading-relaxed drop-shadow-md">
              深度法律分析,專業見解分享<br />
              由多領域法律專家為您解讀最新法律議題
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Desktop Filter - 分類和作者在同一行 */}
          <div className="hidden lg:block py-6">
            <div className="flex items-center justify-between gap-4">
              {/* 分類篩選 */}
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {categoryOptions.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* 作者下拉選單 */}
              <div className="relative flex-shrink-0">
                <Button
                  onClick={() => setIsAuthorDropdownOpen(!isAuthorDropdownOpen)}
                  variant={selectedAuthor !== "全部" ? "default" : "outline"}
                  className="min-w-[140px] justify-between"
                >
                  <span className="truncate">{selectedAuthor}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${isAuthorDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
                {isAuthorDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {authorOptions.map((author) => {
                      const authorData = featuredAuthors.find(a => a.name === author);
                      return (
                        <Button
                          key={author}
                          onClick={() => {
                            setSelectedAuthor(author);
                            setIsAuthorDropdownOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-4"
                        >
                          {authorData && author !== "全部" ? (
                            <>
                              <Avatar className="w-8 h-8 flex-shrink-0 mr-3">
                                <AvatarImage src={authorData.avatar} alt={author} />
                                <AvatarFallback className="text-xs bg-muted">{author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="font-medium text-sm text-foreground">{author}</div>
                                <div className="text-xs text-muted-foreground">{authorData.articlesCount} 篇文章</div>
                              </div>
                            </>
                          ) : (
                            <span className="font-medium text-sm text-foreground pl-2">{author}</span>
                          )}
                          {selectedAuthor === author && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Filter - 底部抽屜 */}
          <div className="lg:hidden py-4">
            <div className="flex items-center gap-3">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1 h-11 relative justify-start">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>篩選條件</span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="default" className="ml-auto h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                  <SheetHeader className="px-6 pt-6 pb-4">
                    <SheetTitle className="text-xl font-bold">篩選文章</SheetTitle>
                  </SheetHeader>
                  <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">共</span>
                <span className="text-sm font-bold text-foreground">{filteredArticles.length}</span>
                <span className="text-sm font-medium text-muted-foreground">篇</span>
              </div>
            </div>

            {/* Active Filters - Mobile */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {selectedCategory !== "全部" && (
                  <Badge variant="secondary" className="gap-1.5 pl-3 pr-2 py-1.5 whitespace-nowrap">
                    <BookOpen className="h-3 w-3" />
                    {selectedCategory}
                    <Button
                      onClick={() => setSelectedCategory("全部")}
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-4 w-4 p-0 hover:bg-background/50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedAuthor !== "全部" && (
                  <Badge variant="secondary" className="gap-1.5 pl-3 pr-2 py-1.5 whitespace-nowrap">
                    <User className="h-3 w-3" />
                    {selectedAuthor}
                    <Button
                      onClick={() => setSelectedAuthor("全部")}
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-4 w-4 p-0 hover:bg-background/50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
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
                <Link key={author.id} href={`/author/${author.id}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50 group">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="w-16 h-16 border-2 border-border group-hover:border-primary transition-colors">
                        <AvatarImage src={author.avatar} alt={author.name} />
                        <AvatarFallback className="bg-muted">{author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {author.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{author.title || '法律專家'}</p>
                        <Badge variant="secondary" className="text-xs mb-3">
                          {author.articlesCount} 篇文章
                        </Badge>
                        {author.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {author.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Featured Articles */}
          {featuredArticlesList.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 text-primary mr-2 fill-primary" />
                <h2 className="text-2xl font-bold text-foreground">精選文章</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredArticlesList.map((article) => (
                  <Link key={article.id} href={`/blog/${article.id}`}>
                    <article className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/50">
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <Image
                          src={article.image || DEFAULT_IMAGE}
                          alt={article.title}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                          <Badge variant="secondary">
                            {categories[article.category as CategoryKey]?.name || article.category}
                          </Badge>
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
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={article.author.avatar} alt={article.author.name} />
                              <AvatarFallback className="text-xs bg-muted">{article.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{article.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{article.views || 0} 次閱讀</span>
                            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
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
                    <article className="group cursor-pointer bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-48 flex-shrink-0">
                          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={article.image || DEFAULT_IMAGE}
                              alt={article.title}
                              width={192}
                              height={144}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                            <Badge variant="secondary">
                              {categories[article.category as CategoryKey]?.name || article.category}
                            </Badge>
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
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                                <AvatarFallback className="text-xs bg-muted">{article.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{article.author.name}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{article.views || 0} 次閱讀</span>
                              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
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
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">找不到相關文章</h3>
              <p className="text-muted-foreground mb-4">請嘗試調整篩選條件</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("全部");
                  setSelectedAuthor("全部");
                }}
              >
                重設篩選
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}