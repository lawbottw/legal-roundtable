'use client'
import { useState } from "react";
import { Search, Calendar, User, ArrowRight, BookOpen, Scale, Briefcase, Users, Filter, Star } from "lucide-react";
import { Button } from '@/components/ui/button';

// 模擬數據
const featuredAuthors = [
  {
    id: 1,
    name: "陳律師",
    title: "資深商務律師",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    articlesCount: 28,
    speciality: "商業法",
    bio: "專精於公司法、證券法及併購案件"
  },
  {
    id: 2,
    name: "林法官",
    title: "退休法官",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    articlesCount: 35,
    speciality: "民事訴訟",
    bio: "三十年司法經驗，專長民事及商事審理"
  },
  {
    id: 3,
    name: "王教授",
    title: "法學院教授",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    articlesCount: 42,
    speciality: "憲法學",
    bio: "憲法學權威，多項重要釋憲案參與者"
  }
];

const articles = [
  {
    id: 1,
    title: "數位時代的個人資料保護：GDPR在台灣的實務應用",
    excerpt: "隨著數位科技的快速發展，個人資料保護議題日益重要。本文深入探討GDPR規範對台灣企業的影響，以及實務上的應對策略...",
    author: "陳律師",
    category: "資訊法",
    date: "2024-03-15",
    readTime: "8 分鐘",
    views: 1248,
    featured: true,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "公司治理新趨勢：ESG原則在企業法務的實踐",
    excerpt: "ESG（環境、社會、治理）已成為現代企業治理的重要指標。本文分析ESG原則如何影響公司法實務，並提供具體的合規建議...",
    author: "林法官",
    category: "公司法",
    date: "2024-03-12",
    readTime: "12 分鐘",
    views: 892,
    featured: false,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "勞動法新制解析：遠距工作的法律規範與實務問題",
    excerpt: "後疫情時代遠距工作成為常態，相關的勞動法規範也隨之演進。本文整理最新的法規變化，並分析實務上常見的爭議問題...",
    author: "王教授",
    category: "勞動法",
    date: "2024-03-10",
    readTime: "10 分鐘",
    views: 673,
    featured: true,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "智慧財產權保護：AI創作物的著作權歸屬問題",
    excerpt: "人工智慧技術的發展帶來了新的法律挑戰，特別是AI創作物的著作權歸屬問題。本文探討相關判例及未來的發展方向...",
    author: "陳律師",
    category: "智財法",
    date: "2024-03-08",
    readTime: "15 分鐘",
    views: 1456,
    featured: false,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "金融科技監理沙盒：創新與風險控制的平衡",
    excerpt: "金融科技的快速發展需要適當的監理框架。本文分析監理沙盒制度的運作機制，以及如何在創新與風險控制間取得平衡...",
    author: "林法官",
    category: "金融法",
    date: "2024-03-05",
    readTime: "11 分鐘",
    views: 758,
    featured: false,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    title: "環境法新發展：氣候變遷訴訟的興起與挑戰",
    excerpt: "氣候變遷議題催生了新型態的環境訴訟。本文分析國際間相關案例的發展趨勢，以及對台灣環境法實務的啟示...",
    author: "王教授",
    category: "環境法",
    date: "2024-03-03",
    readTime: "13 分鐘",
    views: 534,
    featured: false,
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=250&fit=crop"
  }
];

const categories = ["全部", "公司法", "勞動法", "智財法", "資訊法", "金融法", "環境法"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "全部" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">特約作者</h2>
              <p className="text-muted-foreground">來自法律界的權威專家</p>
            </div>
            <Button variant="ghost" className="p-0 h-auto">
              <span className="text-sm font-medium mr-1">查看全部作者</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-6">
            {featuredAuthors.map((author) => (
              <div 
                key={author.id} 
                className="flex-1 min-w-[320px] max-w-[calc(50%-12px)] bg-background border border-muted rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20 group"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-muted group-hover:border-primary/30 transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {author.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{author.title}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {author.articlesCount} 篇文章
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {author.speciality}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{author.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-start mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
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
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-2xl font-bold text-foreground">精選文章</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredArticles.map((article) => (
                  <article 
                    key={article.id} 
                    className="group cursor-pointer bg-background border border-muted rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                          {article.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {article.date}
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{article.views} 次閱讀</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
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
                  <article 
                    key={article.id} 
                    className="group cursor-pointer bg-background border border-muted rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-48 flex-shrink-0">
                        <div className="aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                            {article.category}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {article.date}
                          </span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{article.views} 次閱讀</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
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