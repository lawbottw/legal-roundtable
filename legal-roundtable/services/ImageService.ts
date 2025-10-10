import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const uploadImage = async (
  file: File,
  path: string = 'articles'
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const uploadMultipleImages = async (
  files: File[],
  path: string = 'articles'
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, path));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images');
  }
};
