'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Author } from '@/types/author';
import Link from 'next/link';
import { ChevronDown, User, Sparkles } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authorsCollection = collection(db, 'authors');
        const authorsSnapshot = await getDocs(authorsCollection);
        const authorsData = authorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          avatar: doc.data().avatar,
        })) as Author[];
        setAuthors(authorsData);
      } catch (error) {
        console.error('取得作者列表時發生錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const toggleOpen = (id: string) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-lg text-muted-foreground font-medium">載入作者資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* 裝飾性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl relative z-10">
        {/* 頁面標題 */}
        <div className="mb-16 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>法律知識專家團隊</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            我們的作者
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            由經驗豐富的法律專家組成，致力於為您提供專業、易懂的法律知識
          </p>
        </div>

        {/* 作者列表 */}
        <div className="grid gap-6">
          {authors.map((author, index) => (
            <div
              key={author.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="group hover:shadow-xl transition-all duration-500 border-border/50 hover:border-accent/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <Collapsible
                    open={openStates[author.id]}
                    onOpenChange={() => toggleOpen(author.id)}
                  >
                    {/* 作者卡片主體 */}
                    <div className="p-6">
                      <div className="flex items-start gap-6">
                        {/* 頭像 */}
                        <Link
                          href={`/blog/author/${author.id}`}
                          className="flex-shrink-0 relative group/avatar"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl group-hover/avatar:blur-2xl transition-all duration-500 opacity-0 group-hover/avatar:opacity-100" />
                          <Avatar className="w-20 h-20 border-2 border-border group-hover/avatar:border-primary transition-all duration-500 group-hover/avatar:scale-110 relative z-10">
                            <AvatarImage src={author.avatar} alt={author.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground text-lg font-semibold">
                              {getInitials(author.name)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>

                        {/* 作者資訊 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <Link
                              href={`/blog/author/${author.id}`}
                              className="group/link"
                            >
                              <h2 className="text-2xl font-bold text-foreground group-hover/link:text-primary transition-colors duration-300 flex items-center gap-2">
                                {author.name}
                                <span className="inline-block transform group-hover/link:translate-x-1 transition-transform duration-300">
                                  →
                                </span>
                              </h2>
                            </Link>
                            
                            <CollapsibleTrigger asChild>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-all duration-300 text-sm font-medium text-secondary-foreground group-hover:shadow-md">
                                <span>
                                  {openStates[author.id] ? '收起' : '展開'}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-500 ${
                                    openStates[author.id] ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            </CollapsibleTrigger>
                          </div>

                          {/* 簡短描述預覽 */}
                          {!openStates[author.id] && (
                            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                              {author.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 展開的詳細內容 */}
                    <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
                      <div className="px-6 pb-6 pt-2 border-t border-border/50">
                        <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg p-6 mt-4">
                          <div className="flex items-start gap-3 mb-3">
                            <User className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                            <h3 className="text-lg font-semibold text-foreground">
                              關於作者
                            </h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed ml-8 whitespace-pre-line">
                            {author.description}
                          </p>
                          
                          <Link
                            href={`/blog/author/${author.id}`}
                            className="inline-flex items-center gap-2 mt-6 ml-8 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium"
                          >
                            <span>查看所有文章</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* 空狀態 */}
        {authors.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
              <User className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-2">尚無作者資料</h3>
            <p className="text-muted-foreground">
              目前還沒有任何作者資訊，請稍後再來查看
            </p>
          </div>
        )}
      </div>
    </div>
  );
}