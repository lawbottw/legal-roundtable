'use client';

import { useViewTracker } from '@/hooks/useViewTracker';

interface ViewTrackerProps {
  articleId: string;
  minReadTime?: number;
}

export function ViewTracker({ articleId, minReadTime = 10 }: ViewTrackerProps) {
  useViewTracker({ articleId, minReadTime });
  return null;
}
