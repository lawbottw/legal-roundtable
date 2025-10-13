'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Author } from '@/types/author';
import { useRouter } from 'next/navigation';
import { User, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          title: doc.data().title,
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

  const handleCardClick = (authorId: string) => {
    router.push(`/author/${authorId}`);
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-foreground animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground font-medium">載入作者資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 max-w-4xl">
        {/* 頁面標題 */}
        <div className="mb-16 text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            專欄作家
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            由經驗豐富的法律專家組成,致力於為您提供專業、易懂的法律知識
          </p>
        </div>

        {/* 作者列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {authors
            .filter((author) => !!author.name)
            .map((author) => (
              <article
                key={author.id}
                className="flex flex-col border border-border rounded-lg overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => handleCardClick(author.id)}
              >
                {/* 作者圖片 - 較小的比例 */}
                <div className="w-full aspect-[4/3] bg-accent/5 relative overflow-hidden border-b border-border">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/10">
                      <span className="text-5xl font-bold text-foreground/20">
                        {getInitials(author.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 作者資訊 - 使用 flex-1 讓內容區域填充空間 */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-foreground">
                        {author.name}
                      </h2>
                      
                      {author.title && (
                        <p className="text-sm text-muted-foreground font-medium">
                          {author.title}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {author.description}
                    </p>
                  </div>

                  {/* 查看所有文章按鈕 - 固定在底部 */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full justify-between group hover:bg-accent/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(author.id);
                      }}
                    >
                      <span className="text-sm font-medium">查看所有文章</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* 空狀態 */}
        {authors.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">尚無作者資料</h3>
            <p className="text-base text-muted-foreground">
              目前還沒有任何作者資訊,請稍後再來查看
            </p>
          </div>
        )}
      </div>
    </div>
  );
}