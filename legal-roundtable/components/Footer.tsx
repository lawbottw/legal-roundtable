import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/img/logo_rmbg.png" 
                alt="法律圓桌" 
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-bold text-foreground">法律圓桌</span>
            </div>
            <p className="text-sm text-muted-foreground">
              法律知識交流平台
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">內容分類</h4>
            <div className="flex flex-col gap-3">
              <Link href="/blog/judgment-analysis" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                裁判分析
              </Link>
              <Link href="/blog/legal-outreach" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                法律普及
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">友站連結</h4>
            <div className="flex flex-col gap-3">
              <Link href="https://www.lawbot.tw" className="text-muted-foreground hover:text-primary transition-colors text-sm" target="_blank">
                Lawbot AI
              </Link>
              <Link href="https://www.edu.lawbot.tw" className="text-muted-foreground hover:text-primary transition-colors text-sm" target="_blank">
                Lawbot 教育版
              </Link>
              <Link href="https://lawtable.org" className="text-muted-foreground hover:text-primary transition-colors text-sm" target="_blank">
                律點通 - 法律知識平台
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">聯絡我們</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground">lawbottw@gmail.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 法律圓桌. All rights reserved. | 本站內容僅供參考，不構成法律建議。
          </p>
        </div>
      </div>
    </footer>
  );
};