"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/admin/LoginForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { getArticleById, createArticle, updateArticle } from '@/services/ArticleService';
import { uploadImage } from '@/services/ImageService';
import { Article, ArticleFormData, QAItem } from '@/types/article';
import { categories } from '@/data/categories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Upload, X, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function ArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const articleId = params.articleId as string;
  const isNewArticle = articleId === 'new';

  const [loading, setLoading] = useState(!isNewArticle);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    authorId: '',
    category: '',
    readTime: 5,
    featured: false,
    image: '',
    content: '',
    keywords: [],
    qa: []
  });
  
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (user && isAdmin) {
      if (!isNewArticle) {
        loadArticle();
      } else {
        setFormData({
          ...formData,
          authorId: user.uid
        });
      }
    }
  }, [user, isAdmin, articleId]);

  const loadArticle = async () => {
    try {
      const article = await getArticleById(articleId);
      if (article) {
        // Check if user owns this article
        if (article.authorId !== user?.uid) {
          alert('您沒有權限編輯此文章');
          router.push('/admin');
          return;
        }

        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          authorId: article.authorId,
          category: article.category,
          readTime: article.readTime,
          featured: article.featured,
          image: article.image,
          content: article.content,
          keywords: article.keywords,
          qa: article.qa || []
        });
      } else {
        alert('找不到文章');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Failed to load article:', error);
      alert('載入文章失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'articles/covers');
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      alert('圖片上傳失敗');
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDelete = () => {
    setFormData({ ...formData, image: '' });
  };

  const handleAddKeyword = () => {
    // Split keyword input by commas and trim whitespace
    const keywordsToAdd = keywordInput.split(',').map(k => k.trim()).filter(k => k);
    
    const newKeywords = keywordsToAdd.filter(
      keyword => keyword && !formData.keywords.includes(keyword)
    );
    
    if (newKeywords.length > 0) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, ...newKeywords]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleAddQA = () => {
    setFormData({
      ...formData,
      qa: [...(formData.qa || []), { question: '', answer: '' }]
    });
  };

  const handleUpdateQA = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQA = [...(formData.qa || [])];
    updatedQA[index] = { ...updatedQA[index], [field]: value };
    setFormData({ ...formData, qa: updatedQA });
  };

  const handleRemoveQA = (index: number) => {
    const updatedQA = (formData.qa || []).filter((_, i) => i !== index);
    setFormData({ ...formData, qa: updatedQA });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Filter out Q&A items with empty question or answer
      const filteredQA = (formData.qa || []).filter(
        qa => qa.question.trim() !== '' && qa.answer.trim() !== ''
      );

      if (isNewArticle) {
        const newId = await createArticle({
          ...formData,
          authorId: user.uid,
          qa: filteredQA
        });
        alert('文章創建成功！');
        router.push(`/admin/${newId}`);
      } else {
        await updateArticle(articleId, {
          ...formData,
          authorId: user.uid,
          qa: filteredQA
        });
        alert('文章更新成功！');
      }
    } catch (error) {
      alert('操作失敗，請稍後再試');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">載入文章中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/admin')}>
              ← 返回
            </Button>
            <h1 className="text-3xl font-bold text-foreground m-0 p-0">
              {isNewArticle ? '新增文章' : '編輯文章'}
            </h1>
          </div>
          {!isNewArticle && formData.category && (
            <Button 
              variant="outline" 
              onClick={() => window.open(`/blog/${formData.category}/${articleId}`, '_blank')}
              title="查看發布的文章"
              className="p-2"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">文章資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">標題</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-foreground">摘要</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                  className="bg-background resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">分類</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-background">
                        {Object.values(categories).find(cat => cat.id === formData.category)?.name || "選擇分類"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {Object.values(categories).map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          onSelect={() => setFormData({ ...formData, category: category.id })}
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-foreground">閱讀時間 (分鐘)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    min="1"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground">封面圖片</Label>
                
                {formData.image ? (
                  <div className="relative w-full">
                    <Image
                      src={formData.image}
                      alt="封面預覽"
                      width={1200}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg border-2 border-border shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleImageDelete}
                      className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground mb-1">上傳封面圖片</p>
                        <p className="text-xs text-muted-foreground">支援 JPG、PNG 格式</p>
                      </div>
                      <label htmlFor="image" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={imageUploading}
                          asChild
                        >
                          <span>
                            {imageUploading ? (
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
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-foreground">關鍵字</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="輸入關鍵字，多個關鍵字用逗號分隔"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    className="bg-background"
                  />
                  <Button type="button" onClick={handleAddKeyword} variant="secondary">
                    新增
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword) => (
                      <div
                        key={keyword}
                        className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-primary/20 transition-colors"
                      >
                        <span className="font-medium">{keyword}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/30 border border-border">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="text-foreground cursor-pointer">
                  設為精選文章
                </Label>
              </div>

              <Separator />

              <MarkdownEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                label="文章內容"
              />

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground text-lg">Q&A 問答</Label>
                    <p className="text-sm text-muted-foreground mt-1">為文章添加常見問答</p>
                  </div>
                  <Button type="button" onClick={handleAddQA} variant="secondary" size="sm">
                    <span className="mr-1">+</span> 新增 Q&A
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {(formData.qa || []).map((qa, index) => (
                    <Card key={index} className="border-border bg-accent/20">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">Q{index + 1}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleRemoveQA(index)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`question-${index}`} className="text-sm text-foreground">問題</Label>
                            <Input
                              id={`question-${index}`}
                              value={qa.question}
                              onChange={(e) => handleUpdateQA(index, 'question', e.target.value)}
                              placeholder="輸入問題"
                              className="bg-background"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`answer-${index}`} className="text-sm text-foreground">回答</Label>
                            <Textarea
                              id={`answer-${index}`}
                              value={qa.answer}
                              onChange={(e) => handleUpdateQA(index, 'answer', e.target.value)}
                              placeholder="輸入回答"
                              rows={3}
                              className="bg-background resize-none"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {(!formData.qa || formData.qa.length === 0) && (
                    <div className="text-center py-8 bg-accent/20 rounded-lg border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">尚未新增任何 Q&A</p>
                      <p className="text-xs text-muted-foreground mt-1">點擊上方按鈕新增問答</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  disabled={saving || imageUploading}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                      儲存中...
                    </>
                  ) : (
                    isNewArticle ? '創建文章' : '更新文章'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin')}
                  className="w-full sm:w-auto"
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}