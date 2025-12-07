'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

// 移除 Markdown 連結，只保留文字
const removeMarkdownLinks = (text: string): string => {
  // 將 [text](url) 替換為 text
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 提取標題
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    const idCountMap: Record<string, number> = {}; // 追蹤 ID 出現次數
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      // 先移除 Markdown 連結
      const text = removeMarkdownLinks(match[2].trim());
      const baseId = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中文字符
        .replace(/\s+/g, '-');
      
      // 處理重複 ID
      if (idCountMap[baseId] === undefined) {
        idCountMap[baseId] = 0;
      } else {
        idCountMap[baseId]++;
      }
      
      const id = idCountMap[baseId] === 0 ? baseId : `${baseId}-${idCountMap[baseId]}`;
      
      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // 監聽滾动事件來更新活動標題
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        if (heading.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <div className={cn("", className)}>
      <div className="bg-muted/20 rounded-lg border">
        <div className="px-6 pt-4">
          <h3 className="font-semibold text-lg text-foreground mb-2">文章目錄</h3>
        </div>
        <nav className="px-6 pb-6 xl:max-h-[60vh] overflow-y-auto overflow-x-hidden space-y-2">
          {tocItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "block w-full text-left text-sm hover:text-primary transition-colors",
                "text-muted-foreground hover:bg-muted/40 cursor-pointer rounded px-2 py-1",
                "break-words hyphens-auto whitespace-normal",
                {
                  "ml-0": item.level === 1,
                  "ml-1": item.level === 2,
                  "ml-4": item.level === 3,
                  "ml-7": item.level >= 4,
                },
                activeId === item.id && "text-primary bg-primary/10 font-medium"
              )}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
