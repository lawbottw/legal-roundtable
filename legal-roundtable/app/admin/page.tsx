"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/admin/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAuthor, updateAuthor } from '@/services/AuthorService';
import { getArticlesByAuthor, deleteArticle } from '@/services/ArticleService';
import { uploadImage } from '@/services/ImageService';
import { Author } from '@/types/author';
import { Article } from '@/types/article';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, X, User, Eye, Calendar, Folder, ExternalLink, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { categories, CategoryKey } from '@/data/categories';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('author');
  
  // Author state
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorForm, setAuthorForm] = useState({ name: '', description: '', avatar: '', title: '' });
  const [authorLoading, setAuthorLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  // Load author data
  useEffect(() => {
    if (user && isAdmin) {
      loadAuthorData();
      loadArticles();
    }
  }, [user, isAdmin]);

  const loadAuthorData = async () => {
    if (!user) return;
    try {
      const authorData = await getAuthor(user.uid);
      if (authorData) {
        setAuthor(authorData);
        setAuthorForm({
          name: authorData.name,
          description: authorData.description || '',
          avatar: authorData.avatar || '',
          title: authorData.title || ''
        });
      }
    } catch (error) {
      console.error('Failed to load author:', error);
    }
  };

  const loadArticles = async () => {
    if (!user) return;
    setArticlesLoading(true);
    try {
      const userArticles = await getArticlesByAuthor(user.uid, 1000);
      setArticles(userArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'authors/avatars');
      setAuthorForm({ ...authorForm, avatar: imageUrl });
    } catch (error) {
      alert('頭像上傳失敗');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarDelete = () => {
    setAuthorForm({ ...authorForm, avatar: '' });
  };

  const handleAuthorUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAuthorLoading(true);
    try {
      await updateAuthor(user.uid, {
        id: user.uid,
        name: authorForm.name,
        description: authorForm.description,
        avatar: authorForm.avatar,
        title: authorForm.title
      });
      alert('作者資料更新成功！');
      await loadAuthorData();
    } catch (error) {
      alert('更新失敗,請稍後再試');
    } finally {
      setAuthorLoading(false);
    }
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/admin/${articleId}`);
  };

  const handleDeleteArticle = async (e: React.MouseEvent, articleId: string, articleTitle: string) => {
    e.stopPropagation();
    
    if (!confirm(`確定要刪除文章「${articleTitle}」嗎？此操作無法復原。`)) {
      return;
    }
    
    try {
      await deleteArticle(articleId);
      setArticles(articles.filter(a => a.id !== articleId));
      // toast.success('文章刪除成功');
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">管理後台</h1>
            <p className="text-muted-foreground mt-1">歡迎回來,{user.email}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="w-full sm:w-auto">
            登出
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted">
            <TabsTrigger value="author">作者資料</TabsTrigger>
            <TabsTrigger value="articles">文章管理</TabsTrigger>
          </TabsList>

          <TabsContent value="author" className="mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">編輯作者資料</CardTitle>
                <CardDescription>更新您的個人資訊</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuthorUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">姓名</Label>
                    <Input
                      id="name"
                      value={authorForm.name ?? ''}
                      onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">職稱</Label>
                    <Input
                      id="title"
                      value={authorForm.title ?? ''}
                      onChange={(e) => setAuthorForm({ ...authorForm, title: e.target.value })}
                      className="bg-background"
                      placeholder="例如：律師、法學教授"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">簡介</Label>
                    <Textarea
                      id="description"
                      value={authorForm.description ?? ''}
                      onChange={(e) => setAuthorForm({ ...authorForm, description: e.target.value })}
                      rows={4}
                      required
                      className="bg-background resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground">頭像</Label>
                    
                    {authorForm.avatar ? (
                      <div className="relative w-fit">
                        <Image
                          src={authorForm.avatar}
                          alt="Avatar"
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover border-2 border-border shadow-sm"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={handleAvatarDelete}
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <label htmlFor="avatar" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={avatarUploading}
                              asChild
                            >
                              <span>
                                {avatarUploading ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                    上傳中...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    選擇檔案
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={avatarUploading}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button 
                    type="submit" 
                    disabled={authorLoading || avatarUploading}
                    className="w-full sm:w-auto"
                  >
                    {authorLoading ? '更新中...' : '更新資料'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-foreground">我的文章</CardTitle>
                    <CardDescription>管理您發表的所有文章</CardDescription>
                  </div>
                  <Button onClick={() => router.push('/admin/new')} className="w-full sm:w-auto">
                    新增文章
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {articlesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm text-muted-foreground">載入中...</p>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12 bg-accent/30 rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground mb-2">尚無文章</p>
                    <p className="text-sm text-muted-foreground">點擊上方按鈕開始建立您的第一篇文章</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {articles.map((article) => {
                      const categoryKey = article.category as CategoryKey;
                      const categoryObj = categories[categoryKey];
                      return (
                        <div
                          key={article.id}
                          className="relative border border-border rounded-lg p-4 hover:bg-accent hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => handleArticleClick(article.id)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleDeleteArticle(e, article.id, article.title)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <h3 className="font-semibold text-lg text-foreground mb-2 pr-10">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground items-center">
                            <span className="flex items-center gap-1">
                              <Folder className="w-3 h-3" />
                              {categoryObj?.name ?? article.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {article.updatedAt.toDate().toLocaleDateString('zh-TW')}
                            </span>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="ml-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link
                                href={`/blog/${article.category}/${article.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                前台檢視
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}