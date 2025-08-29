import { doc, getDoc, setDoc } from "firebase/firestore";
import { collections, rdTechDb } from "@/firebase";
import type { Content } from "@/models/content";
import { FirebaseError } from "./base";

export class ContentService {
  // FIXED: Fetch and properly structure section content based on your Firestore document
  static async fetchSectionContent(sectionId: string): Promise<Content | null> {
    try {
      console.log(`Fetching content for section: ${sectionId}`);

      const docRef = doc(rdTechDb, collections.content, sectionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rawData = docSnap.data();

        // Create structured data based on your models
        const structuredData: any = { id: sectionId };

        // Build the nested structure your UI expects
        const sectionData: any = {};

        // Map Firestore fields to nested structure
        Object.keys(rawData).forEach((key) => {
          if (key.startsWith(`${sectionId}.`)) {
            // Handle nested fields like "navbar.title" -> { navbar: { title: ... } }
            const fieldName = key.replace(`${sectionId}.`, "");
            sectionData[fieldName] = rawData[key];
          } else if (!["id", "updatedAt"].includes(key)) {
            // Handle direct fields like "title", "description", "hidden"
            sectionData[key] = rawData[key];
          }
        });

        // Structure it according to your Content model
        structuredData[sectionId] = sectionData;

        console.log(`Structured data for ${sectionId}:`, structuredData);
        return structuredData as Content;
      }

      // Return empty structure if document doesn't exist
      return { id: sectionId, [sectionId]: {} } as Content;
    } catch (error) {
      console.error(`Error fetching content for ${sectionId}:`, error);
      throw new FirebaseError(`Failed to fetch content for ${sectionId}`);
    }
  }

  // Update specific section content
  static async updateSectionContent(
    sectionId: string,
    content: Partial<Content>,
  ): Promise<void> {
    try {
      console.log(`Updating content for section: ${sectionId}`, content);

      const docRef = doc(rdTechDb, collections.content, sectionId);
      const updatedContent = {
        ...content,
        id: sectionId,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, updatedContent, { merge: true });

      console.log(`Content updated successfully for ${sectionId}`);
    } catch (error) {
      console.error(`Error updating content for ${sectionId}:`, error);
      throw new FirebaseError(`Failed to update content for ${sectionId}`);
    }
  }

  // FIXED: Update field using dot notation for nested fields
  static async updateSectionField(
    sectionId: string,
    sectionKey: string,
    field: string,
    value: any,
  ): Promise<void> {
    try {
      console.log(
        `Updating field ${field} in ${sectionKey} for section: ${sectionId}`,
      );

      const docRef = doc(rdTechDb, collections.content, sectionId);

      // Use dot notation for nested fields (navbar.title, navbar.logoUrl, etc.)
      const updateData = {
        [`${sectionKey}.${field}`]: value,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, updateData, { merge: true });

      console.log(`Field ${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating field ${field}:`, error);
      throw new FirebaseError(`Failed to update field ${field}`);
    }
  }

  // FIXED: Toggle visibility using dot notation
  static async toggleSectionVisibility(
    sectionId: string,
    _sectionKey: string,
  ): Promise<boolean> {
    try {
      console.log(`Toggling visibility for section: ${sectionId}`);

      const docRef = doc(rdTechDb, collections.content, sectionId);
      const docSnap = await getDoc(docRef);

      let currentHiddenState = false;

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check both direct "hidden" field and nested "sectionId.hidden"
        currentHiddenState =
          data.hidden || data[`${sectionId}.hidden`] || false;
      }

      const newHiddenState = !currentHiddenState;

      // Update the hidden field (store as direct field, not nested)
      const updateData = {
        hidden: newHiddenState,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, updateData, { merge: true });

      console.log(
        `Section ${sectionId} visibility toggled to: ${newHiddenState ? "hidden" : "visible"}`,
      );
      return newHiddenState;
    } catch (error) {
      console.error(`Error toggling visibility for ${sectionId}:`, error);
      throw new FirebaseError(`Failed to toggle section visibility`);
    }
  }

  // Add item to array field
  static async addArrayItem(
    sectionId: string,
    sectionKey: string,
    field: string,
    item: any,
  ): Promise<void> {
    try {
      const content = await ContentService.fetchSectionContent(sectionId);
      const currentSection = content?.[sectionKey as keyof Content] as any;
      const currentArray = currentSection?.[field] || [];

      const updatedArray = [...currentArray, item];

      await ContentService.updateSectionField(
        sectionId,
        sectionKey,
        field,
        updatedArray,
      );
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
    item: any,
  ): Promise<void> {
    try {
      const content = await ContentService.fetchSectionContent(sectionId);
      const currentSection = content?.[sectionKey as keyof Content] as any;
      const currentArray = currentSection?.[field] || [];

      if (index >= 0 && index < currentArray.length) {
        currentArray[index] = item;
        await ContentService.updateSectionField(
          sectionId,
          sectionKey,
          field,
          currentArray,
        );
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
    index: number,
  ): Promise<void> {
    try {
      const content = await ContentService.fetchSectionContent(sectionId);
      const currentSection = content?.[sectionKey as keyof Content] as any;
      const currentArray = currentSection?.[field] || [];

      if (index >= 0 && index < currentArray.length) {
        currentArray.splice(index, 1);
        await ContentService.updateSectionField(
          sectionId,
          sectionKey,
          field,
          currentArray,
        );
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
      const content = await ContentService.fetchSectionContent("industries");
      const industriesSection = content?.industries;
      return (
        industriesSection?.industries?.map((industry) => industry.name) || []
      );
    } catch (error) {
      console.error("Error fetching industry options:", error);
      return [];
    }
  }

  // Get available technology options
  static async getTechnologyOptions(): Promise<string[]> {
    try {
      const content = await ContentService.fetchSectionContent("technologies");
      const techSection = content?.technologies;
      return techSection?.tech?.map((tech) => tech.name) || [];
    } catch (error) {
      console.error("Error fetching technology options:", error);
      return [];
    }
  }

  // Get available tech category options
  static async getTechCategoryOptions(): Promise<string[]> {
    try {
      const content = await ContentService.fetchSectionContent("technologies");
      const techSection = content?.technologies;
      return techSection?.techCategories || [];
    } catch (error) {
      console.error("Error fetching tech category options:", error);
      return [];
    }
  }

  // Get available routes
  static getAvailableRoutes(): { path: string; displayName: string }[] {
    return [
      { path: "/", displayName: "Home" },
      // Add more routes as you create them
    ];
  }

  // Get public routes for navbar
  static getPublicRoutes(
    customNames?: string[],
  ): { path: string; displayName: string }[] {
    const routes = ContentService.getAvailableRoutes();

    if (customNames && customNames.length === routes.length) {
      return routes.map((route, index) => ({
        ...route,
        displayName: customNames[index] || route.displayName,
      }));
    }

    return routes;
  }
}
