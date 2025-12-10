"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSitemapPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const generateSitemap = async () => {
    setIsGenerating(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/sitemap', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage('❌ Failed to generate sitemap');
      }
    } catch (error) {
      setMessage('❌ Error generating sitemap');
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>管理工具</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateSitemap}
            disabled={isGenerating}
            className="w-full cursor-pointer"
          >
            {isGenerating ? '生成中...' : '生成 Sitemap'}
          </Button>
          
          {message && (
            <div className="p-3 bg-muted rounded-md text-sm">
              {message}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>• 點擊按鈕生成 sitemap.xml</p>
            <p>• 文件會保存到 /public/sitemap.xml</p>
            <p>• 也可以直接訪問 <code>/api/sitemap</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
