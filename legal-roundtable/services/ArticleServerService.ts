import { collection, doc, getDocs, getDoc, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Article } from "@/types/article";
import { Author } from "@/types/author";
import { getAuthor, getAuthorsByIds } from "./AuthorService";

const ARTICLES_COLLECTION = "articles";

// Helper function to convert Firestore data to Article type
function convertToArticle(docId: string, data: any): Article {
  return {
    id: docId,
    title: data.title,
    excerpt: data.excerpt,
    authorId: data.authorId,
    category: data.category,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
    readTime: data.readTime || 5,
    views: data.views || 0,
    featured: data.featured || false,
    image: data.image || '',
    content: data.content || '',
    keywords: data.keywords || [],
    qa: data.qa || []
  } as Article;
}

// 擴展 Article 類型以包含 author 資料（僅用於 server-side）
export type ArticleWithAuthor = Article & { author: Author };

// Server-side: Get article by ID with author data
export const getArticleByIdAdmin = async (id: string): Promise<ArticleWithAuthor | null> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const article = convertToArticle(docSnap.id, docSnap.data());
    
    // 獲取作者資料
    const author = await getAuthor(article.authorId);
    
    return {
      ...article,
      author: author || {
        id: article.authorId,
        name: '未知作者',
        description: '',
        avatar: ''
      }
    };
  } catch (error) {
    console.error("Error fetching article with author:", error);
    throw new Error("Failed to fetch article with author");
  }
};

// Server-side: Get latest articles with author data
export const getLatestArticlesWithAuthors = async (limitCount: number = 20): Promise<ArticleWithAuthor[]> => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      articlesRef,
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    
    querySnapshot.forEach((doc) => {
      articles.push(convertToArticle(doc.id, doc.data()));
    });
    
    // 批次獲取所有作者資料
    const authorIds = Array.from(new Set(articles.map(a => a.authorId)));
    const authorsMap = await getAuthorsByIds(authorIds);
    
    // 附加作者資料到文章
    return articles.map(article => ({
      ...article,
      author: authorsMap.get(article.authorId) || {
        id: article.authorId,
        name: '未知作者',
        description: '',
        avatar: ''
      }
    }));
  } catch (error) {
    console.error("Error fetching latest articles with authors:", error);
    throw new Error("Failed to fetch latest articles with authors");
  }
};

// Server-side: Get articles by author with author data
export const getArticlesByAuthorWithAuthor = async (
  authorId: string, 
  limitCount: number = 20
): Promise<ArticleWithAuthor[]> => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      articlesRef,
      where("authorId", "==", authorId),
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    
    querySnapshot.forEach((doc) => {
      articles.push(convertToArticle(doc.id, doc.data()));
    });
    
    // 獲取作者資料（只需要一次）
    const author = await getAuthor(authorId);
    
    // 附加作者資料到所有文章
    return articles.map(article => ({
      ...article,
      author: author || {
        id: authorId,
        name: '未知作者',
        description: '',
        avatar: ''
      }
    }));
  } catch (error) {
    console.error("Error fetching articles by author with author:", error);
    throw new Error("Failed to fetch articles by author with author");
  }
};

// Server-side: Get featured articles with author data
export const getFeaturedArticlesWithAuthors = async (limitCount: number = 5): Promise<ArticleWithAuthor[]> => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      articlesRef,
      where("featured", "==", true),
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    
    querySnapshot.forEach((doc) => {
      articles.push(convertToArticle(doc.id, doc.data()));
    });
    
    // 批次獲取所有作者資料
    const authorIds = Array.from(new Set(articles.map(a => a.authorId)));
    const authorsMap = await getAuthorsByIds(authorIds);
    
    // 附加作者資料到文章
    return articles.map(article => ({
      ...article,
      author: authorsMap.get(article.authorId) || {
        id: article.authorId,
        name: '未知作者',
        description: '',
        avatar: ''
      }
    }));
  } catch (error) {
    console.error("Error fetching featured articles with authors:", error);
    throw new Error("Failed to fetch featured articles with authors");
  }
};