'use client'
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { onSnapshot, doc, DocumentData } from "firebase/firestore";
import { rdTechDb, collections } from "@/firebase";
import { Content } from "@/models/content";
import { ContentService } from "@/services/contentService";

interface PublicContentState {
  initialize: any;
  // Data State
  content: Record<string, any>;
  loading: boolean;
  error: string | null;
  
  // Real-time subscriptions
  subscriptions: Array<() => void>;
  isSubscribed: boolean;
  
  // Individual section properties for direct access
  navbar: any;
  landingPage: any;
  companyMarquee: any;
  companyBrief: any;
  serviceOptions: any;
  projects: any;
  testimonials: any;
  technologies: any;
  industries: any;
  contactUs: any;
  footer: any;
  whyUs: any;
  vision: any;
  eventsPhotoWall: any;
  career: any;
  jobOpening: any;
  
  // Actions
  fetchSectionContent: (sectionId: string) => Promise<void>;
  fetchAllContent: () => Promise<void>;
  subscribeToRealTimeUpdates: () => () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters
  getSectionContent: (sectionId: string) => any;
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

// FIXED: Helper function to extract nested data properly
function extractSectionData(rawData: any, sectionId: string): any {
  console.log(`🔍 Extracting data for ${sectionId}:`, rawData);
  
  // Initialize result object
  const result: any = {};
  
  // Extract all fields from the raw Firestore document
  Object.keys(rawData).forEach(key => {
    if (key.startsWith(`${sectionId}.`)) {
      // Handle dot notation fields like "navbar.logoUrl" -> logoUrl
      const fieldName = key.replace(`${sectionId}.`, '');
      result[fieldName] = rawData[key];
      console.log(`📝 Extracted ${sectionId}.${fieldName}:`, rawData[key]);
    } else if (!['id', 'updatedAt'].includes(key)) {
      // Handle direct fields like "hidden", "title", etc.
      result[key] = rawData[key];
      console.log(`📝 Extracted direct field ${key}:`, rawData[key]);
    }
  });
  
  console.log(`✅ Final extracted data for ${sectionId}:`, result);
  return result;
}

export const useContentStore = create<PublicContentState>()(
  devtools(
    (set, get) => ({
      // Initial State
      content: {},
      loading: false,
      error: null,
      subscriptions: [],
      isSubscribed: false,
      
      // Initialize all sections to null
      navbar: null,
      landingPage: null,
      companyMarquee: null,
      companyBrief: null,
      serviceOptions: null,
      projects: null,
      testimonials: null,
      technologies: null,
      industries: null,
      contactUs: null,
      footer: null,
      whyUs: null,
      vision: null,
      eventsPhotoWall: null,
      career: null,
      jobOpening: null,

      // Actions
      fetchSectionContent: async (sectionId) => {
        const { content } = get();
        
        try {
          set({ loading: true, error: null });
          
          console.log(`[ContentStore] Fetching content for section: ${sectionId}`);
          const sectionContent = await ContentService.fetchSectionContent(sectionId);
          
          if (sectionContent) {
            console.log(`[ContentStore] Raw fetched data for ${sectionId}:`, sectionContent);
            
            // FIXED: Extract the raw Firestore data correctly
            // The ContentService returns structured data, we need the raw data
            const rawData = (sectionContent as any)[sectionId] || sectionContent;
            const cleanedData = extractSectionData(rawData, sectionId);

            set({
              content: { ...content, [sectionId]: sectionContent },
              [sectionId]: cleanedData, // Set cleaned individual section
              loading: false
            }, false, "fetchSectionContent");

            console.log(`[ContentStore] ✅ Successfully processed ${sectionId}:`, cleanedData);
          }
          
        } catch (error) {
          console.error(`[ContentStore] ❌ Error fetching content for ${sectionId}:`, error);
          set({ error: `Failed to fetch ${sectionId} content`, loading: false });
        }
      },

      fetchAllContent: async () => {
        try {
          set({ loading: true, error: null });
          
          console.log("[ContentStore] 🚀 Fetching all content sections");
          
          const contentPromises = sections.map(async (sectionId) => {
            try {
              const sectionContent = await ContentService.fetchSectionContent(sectionId);
              return { sectionId, content: sectionContent };
            } catch (error) {
              console.warn(`[ContentStore] ⚠️ Failed to fetch ${sectionId}:`, error);
              return { sectionId, content: null };
            }
          });
          
          const results = await Promise.allSettled(contentPromises);
          const newContent: Record<string, any> = {};
          const sectionUpdates: Record<string, any> = {};
          
          results.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value.content) {
              const { sectionId, content } = result.value;
              newContent[sectionId] = content;
              
              console.log(`[ContentStore] 📥 Processing ${sectionId} from fetchAll:`, content);
              
              // FIXED: Extract the raw data correctly
              const rawData = (content as any)[sectionId] || content;
              const cleanedData = extractSectionData(rawData, sectionId);
              sectionUpdates[sectionId] = cleanedData;
              
              console.log(`[ContentStore] ✅ Processed ${sectionId}:`, cleanedData);
            }
          });
          
          set({ 
            content: newContent,
            ...sectionUpdates, // Set all cleaned individual sections
            loading: false 
          }, false, "fetchAllContent");
          
          console.log(`[ContentStore] ✅ Successfully fetched ${Object.keys(newContent).length} sections`);
          
        } catch (error) {
          console.error("[ContentStore] ❌ Error fetching all content:", error);
          set({ error: "Failed to fetch website content", loading: false });
        }
      },

      // FIXED: Real-time updates with proper data extraction
      subscribeToRealTimeUpdates: () => {
        const state = get();
        
        if (state.isSubscribed) {
          console.log("[ContentStore] Already subscribed to real-time updates");
          return () => {};
        }

        console.log("[ContentStore] 🔄 Setting up real-time subscriptions");
        const unsubscribers: Array<() => void> = [];

        sections.forEach(sectionId => {
          const unsubscribe = onSnapshot(
            doc(rdTechDb, collections.content, sectionId),
            (docSnap) => {
              if (docSnap.exists()) {
                const rawData = docSnap.data();
                console.log(`🔥 Real-time update for ${sectionId}:`, rawData);
                
                const currentState = get();
                
                // FIXED: Extract data from the raw Firestore document
                const cleanedData = extractSectionData(rawData, sectionId);
                
                set({
                  content: { ...currentState.content, [sectionId]: rawData },
                  [sectionId]: cleanedData, // Update cleaned individual section
                  error: null
                }, false, `realtime:${sectionId}`);

                console.log(`[ContentStore] ✅ Real-time update processed for ${sectionId}:`, cleanedData);
              } else {
                console.warn(`[ContentStore] ⚠️ Document ${sectionId} does not exist`);
              }
            },
            (error) => {
              console.error(`[ContentStore] ❌ Real-time error for ${sectionId}:`, error);
              set({ error: `Real-time sync failed for ${sectionId}` });
            }
          );
          
          unsubscribers.push(unsubscribe);
        });

        set({ subscriptions: unsubscribers, isSubscribed: true });

        return () => {
          console.log("[ContentStore] 🧹 Cleaning up real-time subscriptions");
          unsubscribers.forEach(unsubscribe => unsubscribe());
          set({ subscriptions: [], isSubscribed: false });
        };
      },

      setError: (error) => {
        set({ error }, false, "setError");
      },

      clearError: () => {
        set({ error: null }, false, "clearError");
      },

      // Getters
      getSectionContent: (sectionId: string) => {
        const { content } = get();
        return content[sectionId] || null;
      },

      isSectionVisible: (sectionId: string, sectionKey: string) => {
        const state = get();
        const sectionData = (state as any)[sectionId];
        return sectionData && !sectionData.hidden;
      },
      
      // Initialize function (if needed)
      initialize: () => {
        console.log("[ContentStore] Initializing content store");
        get().fetchAllContent();
      }
    }),
    {
      name: "public-content-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// FIXED: Helper hook with better data access
export const useSectionContent = (sectionId: string) => {
  const store = useContentStore();
  const sectionData = (store as any)[sectionId];
  
  console.log(`[useSectionContent] Hook called for ${sectionId}:`, sectionData);
  
  return {
    data: sectionData,
    loading: store.loading,
    error: store.error,
    visible: !sectionData?.hidden,
    refetch: () => store.fetchSectionContent(sectionId)
  };
};
