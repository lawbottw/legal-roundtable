import { NextRequest, NextResponse } from 'next/server';
import { SitemapService } from '@/services/sitemap';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 檢查是否要求圖片sitemap
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // 生成 sitemap XML 並保存到 public/sitemap.xml
    const sitemapXml = await SitemapService.generateSitemapXml();
    
    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 也可以通過 POST 請求觸發
    await SitemapService.generateSitemapXml();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sitemap generated successfully' 
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}
