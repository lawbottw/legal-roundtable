import { getArticlesByCategory } from '@/services/ArticleService';
import { categories } from '@/data/categories';
import * as fs from 'fs';
import * as path from 'path';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
}

export class SitemapService {
  private static baseUrl = 'https://lawtable.org';
  // 獲取靜態路由
  static getStaticRoutes(): SitemapUrl[] {
    const staticRoutes = [
      { path: '', priority: 1.0, changefreq: 'daily' as const },
      { path: '/blog', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/author', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/author/Hv8zDPZulpNT1kBp6ofEVSdErYJ2', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/author/R5osO6Amd6SteYBFmfxrwIKeWA22', priority: 0.7, changefreq: 'monthly' as const },
      { path: '/author/YFDFaHM1wZSXmhlLvfBDV8wQ5WN2', priority: 0.7, changefreq: 'monthly' as const },
    ];

    return staticRoutes.map(route => ({
      loc: `${this.baseUrl}${route.path}`,
      lastmod: new Date().toISOString(),
      changefreq: route.changefreq,
      priority: route.priority,
    }));
  }

  // 獲取文章路由 (/blog/[category]/[postId])
  static async getPostRoutes(): Promise<SitemapUrl[]> {
    try {
      const postRoutes: SitemapUrl[] = [];

      // 遍歷所有分類
      for (const category of Object.values(categories)) {
        // 取得該分類下所有文章
        const posts = await getArticlesByCategory(category.id);
        posts.forEach(post => {
          postRoutes.push({
            loc: `${this.baseUrl}/blog/${category.id}/${post.id}`,
            lastmod: post.updatedAt ? post.updatedAt.toDate().toISOString() : new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.6,
          });
        });
      }

      return postRoutes;
    } catch (error) {
      console.error('Error fetching post routes for sitemap:', error);
      return [];
    }
  }

  // 生成完整的 sitemap URLs
  static async getAllUrls(): Promise<SitemapUrl[]> {
    const staticRoutes = this.getStaticRoutes();
    const postRoutes = await this.getPostRoutes();

    return [
      ...staticRoutes,
      ...postRoutes,
    ];
  }

  // 生成 XML sitemap
  static async generateSitemapXml(): Promise<string> {
    const urls = await this.getAllUrls();
    
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
    const urlsetClose = '</urlset>';

    const urlElements = urls.map(url => {
      let urlElement = `  <url>\n    <loc>${url.loc}</loc>`;
      
      if (url.lastmod) {
        urlElement += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }
      
      if (url.changefreq) {
        urlElement += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }
      
      if (url.priority !== undefined) {
        urlElement += `\n    <priority>${url.priority}</priority>`;
      }
      
      urlElement += '\n  </url>';
      return urlElement;
    }).join('\n');

    const xmlContent = `${xmlHeader}\n${urlsetOpen}\n${urlElements}\n${urlsetClose}`;

    // 自動創建 /public/sitemap.xml 文件
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      
      // 確保 public 目錄存在
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      // 寫入 sitemap.xml 文件
      fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
    } catch (error) {
      console.error('Error creating sitemap.xml:', error);
    }

    return xmlContent;
  }

  // XML轉義函數
  private static escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}