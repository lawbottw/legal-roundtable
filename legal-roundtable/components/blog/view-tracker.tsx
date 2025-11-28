'use client';

import { useEffect, useRef } from 'react';
import { incrementViews } from '@/services/ArticleService';

interface ViewTrackerProps {
  articleId: string;
}

export function ViewTracker({ articleId }: ViewTrackerProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    // 確保只執行一次
    if (hasIncremented.current) return;

    // 延遲執行，確保不阻塞頁面渲染
    const timeoutId = setTimeout(() => {
      incrementViews(articleId).catch(() => {
        // 靜默處理錯誤，不影響用戶體驗
      });
      hasIncremented.current = true;
    }, 500); // 延遲 500ms 確保頁面已完全載入

    return () => clearTimeout(timeoutId);
  }, [articleId]);

  // 不渲染任何內容
  return null;
}
