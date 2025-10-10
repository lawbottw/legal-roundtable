import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { Author } from "@/types/author";

export const getAuthor = async (authorId: string): Promise<Author | null> => {
  try {
    const authorRef = doc(db, "authors", authorId);
    const authorSnap = await getDoc(authorRef);
    
    if (authorSnap.exists()) {
      const data = authorSnap.data();
      return {
        id: authorSnap.id,
        name: data.name,
        description: data.description,
        avatar: data.avatar,
        title: data.title
      } as Author;
    } else {
      console.log("找不到該作者");
      return null;
    }
  } catch (error) {
    console.error("取得作者資料時發生錯誤:", error);
    throw new Error("無法取得作者資料");
  }
};

// 新增：批次獲取多個作者資料
export const getAuthorsByIds = async (authorIds: string[]): Promise<Map<string, Author>> => {
  const authorMap = new Map<string, Author>();
  
  if (authorIds.length === 0) return authorMap;
  
  try {
    // 使用 Set 去除重複的 ID
    const uniqueIds = Array.from(new Set(authorIds));
    
    // 批次獲取所有作者
    const authorPromises = uniqueIds.map(id => getAuthor(id));
    const authors = await Promise.all(authorPromises);
    
    // 建立 Map
    authors.forEach(author => {
      if (author) {
        authorMap.set(author.id, author);
      }
    });
    
    return authorMap;
  } catch (error) {
    console.error("批次取得作者資料時發生錯誤:", error);
    throw new Error("無法批次取得作者資料");
  }
};

export const updateAuthor = async (
  authorId: string, 
  updateData: Partial<Author>
): Promise<void> => {
  try {
    // 過濾掉 undefined 的值
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    if (Object.keys(filteredData).length === 0) {
      throw new Error("沒有提供要更新的資料");
    }
    
    const authorRef = doc(db, "authors", authorId);
    await updateDoc(authorRef, filteredData);
    
    console.log("作者資料更新成功");
  } catch (error) {
    console.error("更新作者資料時發生錯誤:", error);
    throw new Error("無法更新作者資料");
  }
};