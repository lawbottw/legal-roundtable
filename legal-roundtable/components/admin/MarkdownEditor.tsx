"use client";

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadImage } from '@/services/ImageService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'articles/content');
      const markdownImage = `![${file.name}](${imageUrl})`;
      onChange(value + '\n' + markdownImage);
    } catch (error) {
      alert('圖片上傳失敗');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
              }}
            >
              {value}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
