'use client'
import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, ChevronRight, Filter, BookOpen, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data for articles
  const articles = [
    {
      id: 1,
      title: '人工智慧在法律服務中的應用與挑戰',
      excerpt: '探討 AI 技術如何改變傳統法律實務，包括合約審查、法律研究和預測分析等領域的創新應用...',
      author: '張律師',
      date: '2024-03-15',
      category: '科技法律',
      readTime: '8 分鐘',
      tags: ['AI', '科技法', '創新'],
      featured: true
    },
    {
      id: 2,
      title: '企業併購中的法律風險評估',
      excerpt: '深入分析企業併購過程中常見的法律陷阱，提供實務經驗分享和風險控制策略...',
      author: '李律師',
      date: '2024-03-12',
      category: '企業法務',
      readTime: '12 分鐘',
      tags: ['併購', '企業法', '風險管理']
    },
    {
      id: 3,
      title: '個人資料保護法最新修正解析',
      excerpt: '詳細解讀個資法修正條文，探討對企業營運的實際影響與因應策略...',
      author: '王律師',
      date: '2024-03-10',
      category: '資訊法律',
      readTime: '6 分鐘',
      tags: ['個資法', '隱私保護', '法規更新']
    }
  ];

  const categories = ['all', '科技法律', '企業法務', '資訊法律', '智慧財產', '勞動法律', '金融法律'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = sortedArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-primary/5 border-b border-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              法律專業
              <span className="text-primary">知識庫</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              匯聚專業律師觀點，提供深度法律分析與實務見解
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="搜尋文章、作者或關鍵字..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background border-2 border-primary/20 rounded-2xl focus:border-primary focus:outline-none text-foreground placeholder-muted-foreground text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category === 'all' ? '全部類別' : category}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="newest">最新發布</option>
                  <option value="oldest">最早發布</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-16">
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 lg:p-12 border border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    精選文章
                  </span>
                  <span className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-xs">
                    {featuredArticle.category}
                  </span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                  
                  <Button className="group rounded-xl">
                    閱讀全文
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {regularArticles.map((article, index) => (
            <article
              key={article.id}
              className="group bg-background border border-primary/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full text-xs">
                    {article.category}
                  </span>
                  <div className="flex gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-6 w-full group/btn rounded-xl">
                  繼續閱讀
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <Button variant="secondary" size="lg" className="rounded-xl">
            載入更多文章
          </Button>
        </div>
        
        <Newsletter />
      </div>
    </div>
  );
};

export default BlogPage;