"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Author } from "@/types/author";
import { Article } from "@/types/article";
import { getAuthor } from "@/services/AuthorService";
import { getArticlesByAuthor } from "@/services/ArticleService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/categories";

import { 
  BookOpen, 
  Calendar, 
  Eye, 
  ArrowLeft, 
  Sparkles,
  FileText,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [authorData, articlesData] = await Promise.all([
          getAuthor(authorId),
          getArticlesByAuthor(authorId, 50)
        ]);

        if (!authorData) {
          setError("找不到該作者");
          return;
        }

        setAuthor(authorData);
        setArticles(articlesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("載入資料時發生錯誤");
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchData();
    }
  }, [authorId]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };

  // Helper to get category name in Chinese
  const getCategoryName = (key: string) => {
    return categories[key as keyof typeof categories]?.name || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>發生錯誤</CardTitle>
            <CardDescription>{error || "找不到該作者"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Back Button */}
        <div>
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            返回
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Author Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="top-8 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
              <div className="w-full aspect-square relative border-b border-border/50">
                <Image 
                  src={author.avatar || '/img/default.png'} 
                  alt={author.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
              
              <div className="p-6">
                {/* Name with sparkle */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="">
                      {author.name}
                    </h1>
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    <FileText className="w-3 h-3 mr-1" />
                    {author.title ? author.title : "專欄作家"}
                  </Badge>
                </div>
                {/* Description */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    關於作者
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {author.description}
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
                    <div className="text-2xl font-bold text-primary">
                      {articles.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      發表文章
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                    <div className="text-2xl font-bold text-foreground">
                      {articles.reduce((sum, article) => sum + (article.views || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      總閱讀數
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-2">
            <div className="mb-6 px-6">
              <h2 className="font-bold mb-2">發表文章</h2>
              <p className="text-muted-foreground">
                共 {articles.length} 篇文章
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              {articles.length === 0 ? (
                <div className="rounded-xl bg-card/50 backdrop-blur-sm p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">目前還沒有發表任何文章</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="rounded-xl bg-card/50 backdrop-blur-sm p-6 cursor-pointer hover:bg-card/70 transition-all duration-300 group border-b border-border"
                      onClick={() => router.push(`/blog/${article.category}/${article.id}`)}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                        {article.featured && (
                          <Badge variant="default" className="shrink-0">
                            精選
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.updatedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {(article.views || 0).toLocaleString()} 次閱讀
                        </div>
                        {article.category && (
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(article.category)}
                          </Badge>
                        )}
                      </div>

                      {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.keywords.slice(0, 5).map((keyword, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs hover:bg-accent transition-colors"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}