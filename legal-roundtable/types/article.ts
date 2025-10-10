import { Timestamp } from "firebase/firestore";
import { Author } from "./author";

export interface QAItem {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  authorId: string;
  category: string;
  updatedAt: Timestamp;
  readTime: number; // in minutes
  views?: number;
  featured: boolean;
  image: string; // URL
  content: string; // markdown
  keywords: string[];
  qa?: QAItem[]; // Q&A 欄位
}

// 新增：包含作者資料的文章型別
export interface ArticleWithAuthor extends Article {
  author: Author;
}

// 新增 ArticleFormData 型別
export interface ArticleFormData {
  title: string;
  excerpt: string;
  authorId: string;
  category: string;
  readTime: number;
  featured: boolean;
  image: string;
  content: string;
  keywords: string[];
  qa?: QAItem[];
}