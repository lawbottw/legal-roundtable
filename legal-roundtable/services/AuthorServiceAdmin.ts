import { db } from "@/lib/firebase-admin";
import { Author } from "@/types/author";

export const getAuthorAdmin = async (authorId: string): Promise<Author | null> => {
  try {
    const authorRef = db.collection("authors").doc(authorId);
    const authorSnap = await authorRef.get();
    
    if (authorSnap.exists) {
      const data = authorSnap.data();
      if (!data) return null;
      
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
    return null;
  }
};
