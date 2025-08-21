import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { rdTechStorage, storagePaths } from "@/firebase";
import { FirebaseError } from "./base";

export class StorageService {
  
  // Upload asset file (images, etc.)
  static async uploadAsset(file: File, fileName?: string): Promise<string> {
    try {
      console.log(`Uploading asset: ${file.name}`);
      
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(rdTechStorage, `${storagePaths.assets}${finalFileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`Asset uploaded successfully: ${downloadURL}`);
      return downloadURL;
      
    } catch (error) {
      console.error("Error uploading asset:", error);
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
      
    } catch (error) {
      console.error("Error uploading PDF:", error);
      throw new FirebaseError("Failed to upload PDF");
    }
  }

  // Delete file from storage
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

  // Upload multiple files
  static async uploadMultipleAssets(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadAsset(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple assets:", error);
      throw new FirebaseError("Failed to upload multiple assets");
    }
  }
}
