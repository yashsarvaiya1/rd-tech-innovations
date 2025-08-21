import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Content } from "@/models/content";
import { ContentService } from "@/services/contentService";

interface PublicContentState {
  // Data State
  content: Record<string, Content>;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSectionContent: (sectionId: string) => Promise<void>;
  fetchAllContent: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getSectionContent: (sectionId: string) => Content | null;
  isSectionVisible: (sectionId: string, sectionKey: string) => boolean;
}

const sections = [
  "navbar",
  "landingPage",
  "companyMarquee",
  "companyBrief",
  "serviceOptions",
  "projects",
  "testimonials",
  "technologies",
  "industries",
  "contactUs",
  "footer",
  "whyUs",
  "vision",
  "eventsPhotoWall",
  "career",
  "jobOpening",
];

export const useContentStore = create<PublicContentState>()(
  devtools(
    (set, get) => ({
      // Initial State
      content: {},
      loading: false,
      error: null,

      // Actions
      fetchSectionContent: async (sectionId) => {
        const { content } = get();
        
        try {
          set({ loading: true, error: null });
          
          console.log(`[ContentStore] Fetching content for section: ${sectionId}`);
          const sectionContent = await ContentService.fetchSectionContent(sectionId);
          
          if (sectionContent) {
            set({
              content: { ...content, [sectionId]: sectionContent },
              loading: false
            }, false, "fetchSectionContent");
          }
          
        } catch (error) {
          console.error(`[ContentStore] Error fetching content for ${sectionId}:`, error);
          set({ error: `Failed to fetch ${sectionId} content`, loading: false });
        }
      },

      fetchAllContent: async () => {
        try {
          set({ loading: true, error: null });
          
          console.log("[ContentStore] Fetching all content sections");
          
          const contentPromises = sections.map(async (sectionId) => {
            try {
              const sectionContent = await ContentService.fetchSectionContent(sectionId);
              return { sectionId, content: sectionContent };
            } catch (error) {
              console.warn(`[ContentStore] Failed to fetch ${sectionId}:`, error);
              return { sectionId, content: null };
            }
          });
          
          const results = await Promise.allSettled(contentPromises);
          const newContent: Record<string, Content> = {};
          
          results.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value.content) {
              newContent[result.value.sectionId] = result.value.content;
            }
          });
          
          set({ content: newContent, loading: false }, false, "fetchAllContent");
          console.log(`[ContentStore] Fetched content for ${Object.keys(newContent).length} sections`);
          
        } catch (error) {
          console.error("[ContentStore] Error fetching all content:", error);
          set({ error: "Failed to fetch website content", loading: false });
        }
      },

      setError: (error) => {
        set({ error }, false, "setError");
      },

      clearError: () => {
        set({ error: null }, false, "clearError");
      },

      // Getters
      getSectionContent: (sectionId) => {
        const { content } = get();
        return content[sectionId] || null;
      },

      isSectionVisible: (sectionId, sectionKey) => {
        const { content } = get();
        const sectionContent = content[sectionId];
        if (!sectionContent) return false;
        
        const section = sectionContent[sectionKey as keyof Content] as any;
        return !section?.hidden;
      },
    }),
    {
      name: "content-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
