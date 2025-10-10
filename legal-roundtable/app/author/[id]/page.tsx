"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Author } from "@/types/author";
import { Article } from "@/types/article";
import { getAuthor } from "@/services/AuthorService";
import { getArticlesByAuthor } from "@/services/ArticleService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">載入中...</p>
        </motion.div>
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
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            返回
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Author Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8 overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="pt-8 relative z-10">
                {/* Avatar with animated ring */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <Avatar className="w-full h-full border-4 border-background relative z-10">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {getInitials(author.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name with sparkle */}
                <motion.div 
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <motion.div
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-accent" />
                    </motion.div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {author.name}
                    </h1>
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    <FileText className="w-3 h-3 mr-1" />
                    專欄作家
                  </Badge>
                </motion.div>

                <Separator className="my-6" />

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    關於作者
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {author.description}
                  </p>
                </motion.div>

                <Separator className="my-6" />

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="text-center p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
                    <div className="text-2xl font-bold text-primary">
                      {articles.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      發表文章
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                    <div className="text-2xl font-bold text-accent">
                      {articles.reduce((sum, article) => sum + (article.views || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      總閱讀數
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Articles List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2">發表文章</h2>
              <p className="text-muted-foreground">
                共 {articles.length} 篇文章
              </p>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {articles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">目前還沒有發表任何文章</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card 
                        className="cursor-pointer overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
                        onClick={() => router.push(`/articles/${article.id}`)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                {article.excerpt}
                              </CardDescription>
                            </div>
                            {article.featured && (
                              <Badge variant="default" className="shrink-0">
                                精選
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                {article.category}
                              </Badge>
                            )}
                          </div>

                          {article.keywords && article.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
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
                        </CardContent>
                      </Card>
                    </motion.div>
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