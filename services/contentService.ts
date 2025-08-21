import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { rdTechDb, collections } from "@/firebase";
import { Content } from "@/models/content";
import { FirebaseError } from "./base";

export class ContentService {
  
  // Fetch specific section content
  static async fetchSectionContent(sectionId: string): Promise<Content | null> {
    try {
      console.log(`Fetching content for section: ${sectionId}`);
      
      const docRef = doc(rdTechDb, collections.content, sectionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: sectionId, ...docSnap.data() } as Content;
      }
      
      // Return empty content structure if document doesn't exist
      return { id: sectionId };
      
    } catch (error) {
      console.error(`Error fetching content for ${sectionId}:`, error);
      throw new FirebaseError(`Failed to fetch content for ${sectionId}`);
    }
  }

  // Update specific section content
  static async updateSectionContent(sectionId: string, content: Partial<Content>): Promise<void> {
    try {
      console.log(`Updating content for section: ${sectionId}`, content);
      
      const docRef = doc(rdTechDb, collections.content, sectionId);
      const updatedContent = {
        ...content,
        id: sectionId,
        updatedAt: new Date().toISOString()
      };
      
      // Use setDoc with merge to handle non-existent documents
      await setDoc(docRef, updatedContent, { merge: true });
      
      console.log(`Content updated successfully for ${sectionId}`);
    } catch (error) {
      console.error(`Error updating content for ${sectionId}:`, error);
      throw new FirebaseError(`Failed to update content for ${sectionId}`);
    }
  }

  // COMPLETELY FIXED: Update specific field within a section
  static async updateSectionField(
    sectionId: string, 
    sectionKey: string, 
    field: string, 
    value: any
  ): Promise<void> {
    try {
      console.log(`Updating field ${field} in ${sectionKey} for section: ${sectionId}`);
      
      const docRef = doc(rdTechDb, collections.content, sectionId);
      
      // Always use setDoc with merge to handle missing documents
      const updateData = {
        [`${sectionKey}.${field}`]: value,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, updateData, { merge: true });
      
      console.log(`Field ${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating field ${field}:`, error);
      throw new FirebaseError(`Failed to update field ${field}`);
    }
  }

  // COMPLETELY FIXED: Toggle section visibility
  static async toggleSectionVisibility(sectionId: string, sectionKey: string): Promise<boolean> {
    try {
      console.log(`Toggling visibility for section: ${sectionId}`);
      
      const docRef = doc(rdTechDb, collections.content, sectionId);
      const docSnap = await getDoc(docRef);
      
      let currentHiddenState = false;
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Access the section data correctly
        const sectionData = data[sectionKey] as any;
        currentHiddenState = sectionData?.hidden || false;
      }
      
      const newHiddenState = !currentHiddenState;
      
      // Use setDoc with merge to ensure document exists
      const updateData = {
        [`${sectionKey}.hidden`]: newHiddenState,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, updateData, { merge: true });
      
      console.log(`Section ${sectionId} visibility toggled to: ${newHiddenState ? 'hidden' : 'visible'}`);
      return newHiddenState;
      
    } catch (error) {
      console.error(`Error toggling visibility for ${sectionId}:`, error);
      throw new FirebaseError(`Failed to toggle section visibility`);
    }
  }

  // Add item to array field (for cards, tags, etc.)
  static async addArrayItem(
    sectionId: string, 
    sectionKey: string, 
    field: string, 
    item: any
  ): Promise<void> {
    try {
      const content = await this.fetchSectionContent(sectionId);
      const currentSection = content?.[sectionKey as keyof Content] as any;
      const currentArray = currentSection?.[field] || [];
      
      const updatedArray = [...currentArray, item];
      
      await this.updateSectionField(sectionId, sectionKey, field, updatedArray);
    } catch (error) {
      console.error(`Error adding item to ${field}:`, error);
      throw new FirebaseError(`Failed to add item to ${field}`);
    }
  }

  // Update array item at specific index
  static async updateArrayItem(
    sectionId: string, 
    sectionKey: string, 
    field: string, 
    index: number, 
    item: any
  ): Promise<void> {
    try {
      const content = await this.fetchSectionContent(sectionId);
      const currentSection = content?.[sectionKey as keyof Content] as any;
      const currentArray = currentSection?.[field] || [];
      
      if (index >= 0 && index < currentArray.length) {
        currentArray[index] = item;
        await this.updateSectionField(sectionId, sectionKey, field, currentArray);
      } else {
        throw new FirebaseError(`Invalid index ${index} for array ${field}`);
      }
    } catch (error) {
      console.error(`Error updating array item at index ${index}:`, error);
      throw new FirebaseError(`Failed to update array item`);
    }
  }

  // Remove array item at specific index
  static async removeArrayItem(
    sectionId: string, 
    sectionKey: string, 
    field: string, 
    index: number
  ): Promise<void> {
    try {
      const content = await this.fetchSectionContent(sectionId);
      const currentSection = content?.[sectionKey as keyof Content] as any;
      const currentArray = currentSection?.[field] || [];
      
      if (index >= 0 && index < currentArray.length) {
        currentArray.splice(index, 1);
        await this.updateSectionField(sectionId, sectionKey, field, currentArray);
      } else {
        throw new FirebaseError(`Invalid index ${index} for array ${field}`);
      }
    } catch (error) {
      console.error(`Error removing array item at index ${index}:`, error);
      throw new FirebaseError(`Failed to remove array item`);
    }
  }

  // Get available industry options
  static async getIndustryOptions(): Promise<string[]> {
    try {
      const content = await this.fetchSectionContent('industries');
      const industriesSection = content?.industries;
      return industriesSection?.industries?.map(industry => industry.name) || [];
    } catch (error) {
      console.error("Error fetching industry options:", error);
      return [];
    }
  }

  // Get available technology options
  static async getTechnologyOptions(): Promise<string[]> {
    try {
      const content = await this.fetchSectionContent('technologies');
      const techSection = content?.technologies;
      return techSection?.tech?.map(tech => tech.name) || [];
    } catch (error) {
      console.error("Error fetching technology options:", error);
      return [];
    }
  }

  // Get available tech category options
  static async getTechCategoryOptions(): Promise<string[]> {
    try {
      const content = await this.fetchSectionContent('technologies');
      const techSection = content?.technologies;
      return techSection?.techCategories || [];
    } catch (error) {
      console.error("Error fetching tech category options:", error);
      return [];
    }
  }

  // FIXED: Use the hook for dynamic routes
  static getAvailableRoutes(): {path: string, displayName: string}[] {
    // These are detected dynamically by the hook
    // This is a fallback for server-side usage
    return [
      { path: '/', displayName: 'Home' },
      { path: '/about', displayName: 'About' },
      { path: '/career', displayName: 'Career' },
      { path: '/contact', displayName: 'Contact' }
    ];
  }

  // Get public routes for navbar (this will be used by public-facing components)
  static getPublicRoutes(customNames?: string[]): {path: string, displayName: string}[] {
    const routes = this.getAvailableRoutes();
    
    if (customNames && customNames.length === routes.length) {
      return routes.map((route, index) => ({
        ...route,
        displayName: customNames[index] || route.displayName
      }));
    }
    
    return routes;
  }
}
