
'use client';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path where the file should be stored (e.g., 'profileImages/userId').
 * @returns The public URL of the uploaded file.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw new Error('Image upload failed. Please try again.');
  }
}
