import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, 
    orderBy, limit, where, increment, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Article, ArticleFormData, ArticleWithAuthor } from "@/types/article";
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

// Helper function to convert Article to ArticleWithAuthor
export function addAuthorToArticle(article: Article, author: Author): ArticleWithAuthor {
  return {
    ...article,
    author
  };
}

// Get latest articles (default 20)
export const getLatestArticles = async (limitCount: number = 20): Promise<Article[]> => {
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
    
    return articles;
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    throw new Error("Failed to fetch latest articles");
  }
};

// Get article by ID
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertToArticle(docSnap.id, docSnap.data());
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    throw new Error("Failed to fetch article");
  }
};

// Get featured articles
export const getFeaturedArticles = async (limitCount: number = 5): Promise<Article[]> => {
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
    
    return articles;
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    throw new Error("Failed to fetch featured articles");
  }
};

// Get articles by category
export const getArticlesByCategory = async (
  category: string, 
  limitCount: number = 20
): Promise<Article[]> => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      articlesRef,
      where("category", "==", category),
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    
    querySnapshot.forEach((doc) => {
      articles.push(convertToArticle(doc.id, doc.data()));
    });
    
    return articles;
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    throw new Error("Failed to fetch articles by category");
  }
};

// Get articles by author
export const getArticlesByAuthor = async (
  authorId: string, 
  limitCount: number = 20
): Promise<Article[]> => {
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
    
    return articles;
  } catch (error) {
    console.error("Error fetching articles by author:", error);
    throw new Error("Failed to fetch articles by author");
  }
};

// Create a new article
export const createArticle = async (articleData: ArticleFormData): Promise<string> => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const docRef = await addDoc(articlesRef, {
      ...articleData,
      updatedAt: serverTimestamp(),
      views: 0,
      featured: articleData.featured || false
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article");
  }
};

// Update article data
export const updateArticle = async (
  id: string, 
  updateData: Partial<ArticleFormData>
): Promise<void> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Failed to update article");
  }
};

// Delete article
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Failed to delete article");
  }
};

// Increment article views
export const incrementViews = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
    throw new Error("Failed to increment views");
  }
};

// // Search articles by title or keywords
// export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
//   try {
//     const articlesRef = collection(db, ARTICLES_COLLECTION);
//     const querySnapshot = await getDocs(articlesRef);
//     const articles: Article[] = [];
    
//     querySnapshot.forEach((doc) => {
//       const articleData = { id: doc.id, ...doc.data() } as Article;
      
//       // Simple text search in title, excerpt, and keywords
//       const searchLower = searchTerm.toLowerCase();
//       const titleMatch = articleData.title.toLowerCase().includes(searchLower);
//       const excerptMatch = articleData.excerpt.toLowerCase().includes(searchLower);
//       const keywordMatch = articleData.keywords.some(keyword => 
//         keyword.toLowerCase().includes(searchLower)
//       );
      
//       if (titleMatch || excerptMatch || keywordMatch) {
//         articles.push(articleData);
//       }
//     });
    
//     // Sort by updatedAt desc
//     return articles.sort((a, b) => b.updatedAt.seconds - a.updatedAt.seconds);
//   } catch (error) {
//     console.error("Error searching articles:", error);
//     throw new Error("Failed to search articles");
//   }
// };

// // Get popular articles (sorted by views)
// export const getPopularArticles = async (limitCount: number = 10): Promise<Article[]> => {
//   try {
//     const articlesRef = collection(db, ARTICLES_COLLECTION);
//     const q = query(
//       articlesRef,
//       orderBy("views", "desc"),
//       limit(limitCount)
//     );
    
//     const querySnapshot = await getDocs(q);
//     const articles: Article[] = [];
    
//     querySnapshot.forEach((doc) => {
//       articles.push({
//         id: doc.id,
//         ...doc.data()
//       } as Article);
//     });
    
//     return articles;
//   } catch (error) {
//     console.error("Error fetching popular articles:", error);
//     throw new Error("Failed to fetch popular articles");
//   }
// };

// // Get all categories (unique)
// export const getCategories = async (): Promise<string[]> => {
//   try {
//     const articlesRef = collection(db, ARTICLES_COLLECTION);
//     const querySnapshot = await getDocs(articlesRef);
//     const categories = new Set<string>();
    
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       if (data.category) {
//         categories.add(data.category);
//       }
//     });
    
//     return Array.from(categories).sort();
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw new Error("Failed to fetch categories");
//   }
// };

// // Toggle featured status
// export const toggleFeatured = async (id: string): Promise<void> => {
//   try {
//     const docRef = doc(db, ARTICLES_COLLECTION, id);
//     const docSnap = await getDoc(docRef);
    
//     if (docSnap.exists()) {
//       const currentFeatured = docSnap.data().featured || false;
//       await updateDoc(docRef, {
//         featured: !currentFeatured,
//         updatedAt: serverTimestamp()
//       });
//     }
//   } catch (error) {
//     console.error("Error toggling featured status:", error);
//     throw new Error("Failed to toggle featured status");
//   }
// };

// Get articles by category with author data
export const getArticlesByCategoryWithAuthor = async (
  category: string, 
  limitCount: number = 20
): Promise<ArticleWithAuthor[]> => {
  try {
    // 先獲取文章
    const articles = await getArticlesByCategory(category, limitCount);
    
    if (articles.length === 0) {
      return [];
    }
    
    // 收集所有作者 ID
    const authorIds = articles.map(article => article.authorId);
    
    // 批次獲取作者資料
    const authorMap = await getAuthorsByIds(authorIds);
    
    // 組合文章和作者資料
    const articlesWithAuthor: ArticleWithAuthor[] = articles.map(article => {
      const author = authorMap.get(article.authorId);
      if (!author) {
        throw new Error(`Author not found for article ${article.id}`);
      }
      return addAuthorToArticle(article, author);
    });
    
    return articlesWithAuthor;
  } catch (error) {
    console.error("Error fetching articles by category with author:", error);
    throw new Error("Failed to fetch articles by category with author");
  }
};