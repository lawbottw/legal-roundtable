"use client";

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { uploadImage } from '@/services/ImageService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

// 生成標題 ID 的輔助函數 (與 blog page 一致)
const generateHeadingId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-');
};

export function MarkdownEditor({ value, onChange, label = '內容' }: MarkdownEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [showAltDialog, setShowAltDialog] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 保存當前光標位置
    const currentPosition = textareaRef.current?.selectionStart || value.length;
    setCursorPosition(currentPosition);

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'articles/content');
      setPendingImageUrl(imageUrl);
      setImageAlt(file.name.replace(/\.[^/.]+$/, '')); // 預設使用檔名作為 alt
      setShowAltDialog(true);
    } catch (error) {
      alert('圖片上傳失敗');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInsertImage = () => {
    const markdownImage = `![${imageAlt}](${pendingImageUrl})`;
    
    // 在光標位置插入圖片
    const before = value.substring(0, cursorPosition);
    const after = value.substring(cursorPosition);
    const newValue = before + '\n' + markdownImage + '\n' + after;
    
    onChange(newValue);
    setShowAltDialog(false);
    setImageAlt('');
    setPendingImageUrl('');
    
    // 設置焦點回到 textarea 並移動光標到插入的圖片後面
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = cursorPosition + markdownImage.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 100);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? '上傳中...' : '插入圖片'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">編輯</TabsTrigger>
          <TabsTrigger value="preview">預覽</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-2">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[400px] font-mono"
            placeholder="輸入 Markdown 格式的內容..."
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-2">
          <div className="min-h-[400px] border rounded-md p-4 bg-background prose prose-lg max-w-none overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => {
                  const text = children?.toString() || '';
                  const id = generateHeadingId(text);
                  return <h1 id={id} className="text-foreground/95 mb-6 mt-8 scroll-mt-24">{children}</h1>;
                },
                h2: ({ children }) => {
                  const text = children?.toString() || '';
                  const id = generateHeadingId(text);
                  return <h2 id={id} className="text-foreground/90 mb-5 mt-8 border-l-4 border-primary pl-4 scroll-mt-24">{children}</h2>;
                },
                h3: ({ children }) => {
                  const text = children?.toString() || '';
                  const id = generateHeadingId(text);
                  return <h3 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h3>;
                },
                h4: ({ children }) => {
                  const text = children?.toString() || '';
                  const id = generateHeadingId(text);
                  return <h4 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h4>;
                },
                h5: ({ children }) => {
                  const text = children?.toString() || '';
                  const id = generateHeadingId(text);
                  return <h5 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h5>;
                },
                h6: ({ children }) => {
                  const text = children?.toString() || '';
                  const id = generateHeadingId(text);
                  return <h6 id={id} className="text-foreground/90 mb-4 mt-6 scroll-mt-24">{children}</h6>;
                },
                p: ({ children }) => <p className="text-foreground/90 mb-4">{children}</p>,
                strong: ({ children }) => (
                  <strong className="underline decoration-yellow-700 decoration-4 underline-offset-3">
                    {children}
                  </strong>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
                li: ({ children }) => <li className="ml-4 mb-2">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-foreground/30 pl-4 py-2 my-4 bg-foreground/5 italic">{children}</blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-muted text-foreground px-2 py-1 rounded-md text-sm font-mono">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-md mb-4 overflow-x-auto">{children}</pre>
                ),
                hr: () => <hr className="my-6 border-foreground/20" />,
                a: ({ children, href }) => (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img src={src} alt={alt || ''} className="rounded-lg my-4 max-w-full h-auto" />
                ),
              }}
            >
              {value}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alt Text Dialog */}
      <Dialog open={showAltDialog} onOpenChange={setShowAltDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設置圖片描述</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-alt">圖片描述 (Alt Text)</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="例如：訴訟流程示意圖"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInsertImage();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                圖片描述有助於 SEO 和無障礙使用
              </p>
            </div>
            {pendingImageUrl && (
              <div className="border rounded-lg p-2">
                <img src={pendingImageUrl} alt="預覽" className="max-h-48 mx-auto" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAltDialog(false)}>
              取消
            </Button>
            <Button onClick={handleInsertImage}>
              插入圖片
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
