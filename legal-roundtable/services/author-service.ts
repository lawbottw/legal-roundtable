import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Author 介面定義
export interface Author {
  id: string;
  name: string;
  description: string;
}

// 更新 Author 時的資料類型（id 為只讀，不可更新）
export interface UpdateAuthorData {
  name?: string;
  description?: string;
}

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

export const updateAuthor = async (
  authorId: string, 
  updateData: UpdateAuthorData
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