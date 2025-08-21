import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { rdTechStorage, storagePaths } from "@/firebase";
import { FirebaseError } from "./base";

export interface StorageFile {
  name: string;
  url: string;
  fullPath: string;
  size?: number;
  timeCreated?: string;
}

export class StorageService {
  
  // Validate image file
  static validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      throw new FirebaseError("Only JPEG, PNG, WebP, and GIF images are allowed");
    }
    
    if (file.size > maxSize) {
      throw new FirebaseError("Image size must be less than 5MB");
    }
    
    return true;
  }

  // Create image preview
  static createImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to create image preview"));
      reader.readAsDataURL(file);
    });
  }

  // Upload image with preview and compression - FIXED with better error handling
  static async uploadImageWithPreview(file: File, fileName?: string): Promise<{url: string, preview: string}> {
    try {
      console.log(`Uploading image: ${file.name}`);
      
      // Validate file
      this.validateImageFile(file);
      
      // Create preview
      const preview = await this.createImagePreview(file);
      
      // Compress if needed
      const processedFile = await this.compressImage(file);
      
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(rdTechStorage, `${storagePaths.assets}${finalFileName}`);
      
      console.log(`Uploading to path: ${storagePaths.assets}${finalFileName}`);
      
      const snapshot = await uploadBytes(storageRef, processedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`Image uploaded successfully: ${downloadURL}`);
      return { url: downloadURL, preview };
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      
      // Handle specific Firebase Storage errors
      if (error.code === 'storage/unauthorized') {
        throw new FirebaseError("You don't have permission to upload files. Please check your authentication and try again.");
      } else if (error.code === 'storage/canceled') {
        throw new FirebaseError("Upload was canceled.");
      } else if (error.code === 'storage/quota-exceeded') {
        throw new FirebaseError("Storage quota exceeded. Please contact administrator.");
      } else if (error instanceof FirebaseError) {
        throw error;
      } else {
        throw new FirebaseError("Failed to upload image. Please try again.");
      }
    }
  }

  // Simple image compression
  static async compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        let { width, height } = img;
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Return original if compression fails
          }
        }, file.type, 0.8); // 80% quality
      };
      
      img.onerror = () => resolve(file); // Return original if processing fails
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload asset file
  static async uploadAsset(file: File, fileName?: string): Promise<string> {
    try {
      console.log(`Uploading asset: ${file.name}`);
      
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(rdTechStorage, `${storagePaths.assets}${finalFileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`Asset uploaded successfully: ${downloadURL}`);
      return downloadURL;
      
    } catch (error: any) {
      console.error("Error uploading asset:", error);
      if (error.code === 'storage/unauthorized') {
        throw new FirebaseError("You don't have permission to upload files. Please check your authentication.");
      }
      throw new FirebaseError("Failed to upload asset");
    }
  }

  // Upload PDF file
  static async uploadPDF(file: File, fileName?: string): Promise<string> {
    try {
      console.log(`Uploading PDF: ${file.name}`);
      
      if (file.type !== "application/pdf") {
        throw new FirebaseError("File must be a PDF");
      }
      
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(rdTechStorage, `${storagePaths.pdfs}${finalFileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`PDF uploaded successfully: ${downloadURL}`);
      return downloadURL;
      
    } catch (error: any) {
      console.error("Error uploading PDF:", error);
      if (error.code === 'storage/unauthorized') {
        throw new FirebaseError("You don't have permission to upload files. Please check your authentication.");
      }
      throw new FirebaseError("Failed to upload PDF");
    }
  }

  // Delete file by URL
  static async deleteFile(url: string): Promise<void> {
    try {
      console.log(`Deleting file: ${url}`);
      
      const storageRef = ref(rdTechStorage, url);
      await deleteObject(storageRef);
      
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new FirebaseError("Failed to delete file");
    }
  }

  // Upload multiple assets
  static async uploadMultipleAssets(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadAsset(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple assets:", error);
      throw new FirebaseError("Failed to upload multiple assets");
    }
  }

  // FIXED: List all assets from storage
  static async listAllAssets(): Promise<StorageFile[]> {
    try {
      console.log("Listing all assets from storage");
      
      // Remove trailing slash if your storagePaths.assets has one
      const assetsPath = storagePaths.assets.replace(/\/$/, '');
      const listRef = ref(rdTechStorage, assetsPath);
      const result = await listAll(listRef);
      
      const files: StorageFile[] = [];
      
      for (const itemRef of result.items) {
        try {
          const url = await getDownloadURL(itemRef);
          files.push({
            name: itemRef.name,
            url: url,
            fullPath: itemRef.fullPath,
            // Add more metadata if available
          });
        } catch (error) {
          console.warn(`Failed to get URL for ${itemRef.name}:`, error);
        }
      }
      
      console.log(`Found ${files.length} assets`);
      return files;
      
    } catch (error) {
      console.error("Error listing assets:", error);
      throw new FirebaseError("Failed to list assets");
    }
  }

  // Delete file by URL and update Firestore references
  static async deleteAssetAndUpdateReferences(fileUrl: string): Promise<void> {
    try {
      console.log(`Deleting asset and updating references: ${fileUrl}`);
      
      // Delete from storage
      const fileRef = ref(rdTechStorage, fileUrl);
      await deleteObject(fileRef);
      
      // TODO: Update Firestore documents to remove this URL
      // This would require scanning all content documents and removing the URL
      // For now, we'll just delete from storage
      
      console.log("Asset deleted successfully");
    } catch (error) {
      console.error("Error deleting asset:", error);
      throw new FirebaseError("Failed to delete asset");
    }
  }

  // Delete file by full path
  static async deleteAssetByPath(fullPath: string): Promise<void> {
    try {
      console.log(`Deleting asset by path: ${fullPath}`);
      
      const fileRef = ref(rdTechStorage, fullPath);
      await deleteObject(fileRef);
      
      console.log("Asset deleted successfully");
    } catch (error) {
      console.error("Error deleting asset:", error);
      throw new FirebaseError("Failed to delete asset");
    }
  }

  // Upload multiple images with preview
  static async uploadMultipleImagesWithPreview(files: File[]): Promise<{url: string, preview: string}[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImageWithPreview(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw new FirebaseError("Failed to upload multiple images");
    }
  }
}
