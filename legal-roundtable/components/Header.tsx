
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Scale } from 'lucide-react';

// Header Component
export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xl font-bold text-foreground leading-none">法律圓桌</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#articles" className="text-sm font-medium hover:text-primary transition-colors">
            最新文章
          </a>
          <a href="#writers" className="text-sm font-medium hover:text-primary transition-colors">
            作者群
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            關於我們
          </a>
          <Button variant="outline" size="sm">
            訂閱更新
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Users className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};