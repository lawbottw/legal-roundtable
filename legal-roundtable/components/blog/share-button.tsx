'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Check, Link, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ShareButton({ url, title, className, size = "sm", variant = "outline" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: url,
        });
      } else {
        await handleCopyLink();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("分享失敗，請稍後再試");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("連結已複製到剪貼簿");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("複製失敗，請稍後再試");
    }
  };

  const handleLineShare = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
    window.open(lineUrl, '_blank', 'width=600,height=400');
  };

//   const handleMessengerShare = () => {
//     const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`;
//     window.open(messengerUrl, '_blank', 'width=600,height=400');
//   };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              已複製
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-1" />
              分享
              <ChevronDown className="w-3 h-3 ml-1" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNativeShare}>
          <Share2 className="w-4 h-4 mr-2" />
          系統分享
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link className="w-4 h-4 mr-2" />
          複製連結
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLineShare}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          LINE 分享
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={handleMessengerShare}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8l3.13 3.259L19.794 8l-6.601 6.963z"/>
          </svg>
          Messenger
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
