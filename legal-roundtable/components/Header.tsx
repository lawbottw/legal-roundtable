import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Header Component
export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 md:px-8">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <Image src="/img/logo_rmbg.png" alt="Logo" height={100} width={100} className="h-10 w-auto" />
            <div>
              <p className="text-xl font-bold text-foreground leading-none">法律圓桌</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center space-x-2 md:space-x-6">
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            專欄文章
          </Link>
          <Link href="/author" className="text-sm font-medium hover:text-primary transition-colors">
            作家
          </Link>
        </nav>
      </div>
    </header>
  );
};