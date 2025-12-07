import { db, admin } from "@/lib/firebase-admin";

const ARTICLES_COLLECTION = "articles";

// Increment article views using Admin SDK
export const incrementViewsAdmin = async (id: string): Promise<void> => {
  try {
    const docRef = db.collection(ARTICLES_COLLECTION).doc(id);
    await docRef.update({
      views: admin.firestore.FieldValue.increment(1)
    });
  } catch (error) {
    console.error("Error incrementing views (Admin):", error);
    throw new Error("Failed to increment views");
  }
};
