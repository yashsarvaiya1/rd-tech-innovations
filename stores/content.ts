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

// **NEW: Helper function to extract nested data properly**
function extractSectionData(rawData: any, sectionId: string): any {
  console.log(`🔍 Extracting data for ${sectionId}:`, rawData);
  
  // Check if data is nested under section name (like landingPage.landingPage)
  if (rawData[sectionId]) {
    console.log(`✅ Found nested data under ${sectionId}:`, rawData[sectionId]);
    return rawData[sectionId];
  }
  
  // Check for dot notation fields (navbar.title, navbar.logoUrl, etc.)
  const dotNotationData: any = {};
  const directData: any = {};
  
  Object.keys(rawData).forEach(key => {
    if (key.startsWith(`${sectionId}.`)) {
      // Handle "sectionId.field" format
      const fieldName = key.replace(`${sectionId}.`, '');
      dotNotationData[fieldName] = rawData[key];
    } else if (!['id', 'updatedAt'].includes(key)) {
      // Handle direct fields
      directData[key] = rawData[key];
    }
  });
  
  // Merge dot notation and direct data, prioritizing dot notation
  const result = { ...directData, ...dotNotationData };
  
  console.log(`📝 Final extracted data for ${sectionId}:`, result);
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
            
            // **UPDATED: Use helper function to extract data properly**
            const cleanedData = extractSectionData(sectionContent, sectionId);

            set({
              content: { ...content, [sectionId]: sectionContent },
              [sectionId]: cleanedData, // Set cleaned individual section
              loading: false
            }, false, "fetchSectionContent");

            console.log(`[ContentStore] ✅ Successfully processed ${sectionId}`);
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
              
              // **UPDATED: Use helper function to extract data properly**
              const cleanedData = extractSectionData(content, sectionId);
              sectionUpdates[sectionId] = cleanedData;
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

      // **UPDATED: Real-time updates with proper data extraction**
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
                
                // **UPDATED: Use helper function to extract data properly**
                const cleanedData = extractSectionData(rawData, sectionId);
                
                set({
                  content: { ...currentState.content, [sectionId]: rawData },
                  [sectionId]: cleanedData, // Update cleaned individual section
                  error: null
                }, false, `realtime:${sectionId}`);

                console.log(`[ContentStore] ✅ Real-time update processed for ${sectionId}`);
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
      getSectionContent: (sectionId) => {
        const { content } = get();
        return content[sectionId] || null;
      },

      isSectionVisible: (sectionId, sectionKey) => {
        const state = get();
        const sectionData = (state as any)[sectionId];
        return sectionData && !sectionData.hidden;
      },
    }),
    {
      name: "public-content-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// **UPDATED: Helper hook with better data access**
export const useSectionContent = (sectionId: string) => {
  const store = useContentStore();
  const sectionData = (store as any)[sectionId];
  
  return {
    data: sectionData,
    loading: store.loading,
    error: store.error,
    visible: !sectionData?.hidden
  };
};
