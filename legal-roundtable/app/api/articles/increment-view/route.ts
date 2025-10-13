import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/services/ArticleService';

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();

    if (!articleId || typeof articleId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    await incrementViews(articleId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing view:', error);
    return NextResponse.json(
      { error: 'Failed to increment view' },
      { status: 500 }
    );
  }
}
