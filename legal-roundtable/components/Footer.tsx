import { Scale } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">法律圓桌</span>
            </div>
            <p className="text-sm text-muted-foreground">
              專業法律人士的知識交流平台，為法律學習者提供專業指導與深度分析。
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">內容分類</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">判決解析</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">實務指南</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">法學理論</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">職涯建議</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">作者資源</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">投稿指南</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">編輯政策</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">作者介紹</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">聯絡我們</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>email@legalroundtable.tw</li>
              <li>關注我們的社群媒體</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 法律圓桌. All rights reserved. | 本站內容僅供學術參考，不構成法律建議。
          </p>
        </div>
      </div>
    </footer>
  );
};