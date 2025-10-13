'use client';

import { useEffect, useRef } from 'react';

interface UseViewTrackerOptions {
  articleId: string;
  minReadTime?: number; // 最小閱讀時間（秒），預設 10 秒
}

export function useViewTracker({ articleId, minReadTime = 10 }: UseViewTrackerOptions) {
  const startTimeRef = useRef<number>(0);
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    // 檢查是否已在此 session 中追蹤過此文章
    const sessionKey = `article_viewed_${articleId}`;
    const hasViewedInSession = sessionStorage.getItem(sessionKey);

    if (hasViewedInSession) {
      return;
    }

    // 記錄開始時間
    startTimeRef.current = Date.now();

    // 追蹤用戶是否達到最小閱讀時間
    const trackView = async () => {
      if (hasTrackedRef.current) return;

      const readTime = (Date.now() - startTimeRef.current) / 1000;
      
      if (readTime >= minReadTime) {
        hasTrackedRef.current = true;
        sessionStorage.setItem(sessionKey, 'true');

        try {
          await fetch('/api/articles/increment-view', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ articleId }),
          });
        } catch (error) {
          console.error('Failed to track view:', error);
        }
      }
    };

    // 設定定時器檢查閱讀時間
    const timer = setTimeout(trackView, minReadTime * 1000);

    // 處理頁面離開事件
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackView();
      }
    };

    const handleBeforeUnload = () => {
      trackView();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [articleId, minReadTime]);
}
