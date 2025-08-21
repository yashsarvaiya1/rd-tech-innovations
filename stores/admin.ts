import { create } from "zustand";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { rdTechDb, collections } from "@/firebase";
import { Content } from "@/models/content";
import { Submission } from "@/models/submission";

interface AdminState {
  selectedSection: string | null;
  content: Content | null;
  submissions: Submission[];
  admins: string[];
  loading: boolean;
  error: string | null;
  setSelectedSection: (section: string) => void;
  setContent: (content: Content | null) => void;
  setSubmissions: (submissions: Submission[]) => void;
  addAdmin: (email: string) => void;
  fetchContent: (section: string) => Promise<void>;
  fetchSubmissions: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
  clearAdminData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  selectedSection: null,
  content: null,
  submissions: [],
  admins: [],
  loading: false,
  error: null,

  setSelectedSection: (section) => set({ selectedSection: section }),
  setContent: (content) => set({ content }),
  setSubmissions: (submissions) => set({ submissions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addAdmin: (email) => set((state) => ({ 
    admins: [...state.admins, email] 
  })),

  // Clear all admin data (useful for logout)
  clearAdminData: () => {
    console.log("Clearing all admin data...");
    set({
      selectedSection: null,
      content: null,
      submissions: [],
      admins: [],
      loading: false,
      error: null,
    });
  },

  fetchContent: async (section) => {
    if (!section) return;
    
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching content for section: ${section}`);
      const docRef = doc(rdTechDb, collections.content, section);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const contentData = { id: section, ...docSnap.data() } as Content;
        console.log(`Content fetched for ${section}:`, contentData);
        set({ content: contentData });
      } else {
        console.log(`No content found for ${section}, creating empty content`);
        set({ content: { id: section } });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  },

  fetchSubmissions: async () => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching submissions...");
      const querySnapshot = await getDocs(collection(rdTechDb, collections.submissions));
      const submissions: Submission[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "career") {
          submissions.push({
            type: "career",
            name: data.name || "N/A",
            email: data.email || "N/A",
            number: data.number || "N/A",
            location: data.location || "N/A",
            portfolioOrLink: data.portfolioOrLink || "N/A",
            ctc: data.ctc || "N/A",
            about: data.about || "N/A",
            resumeUrl: data.resumeUrl || undefined,
            positions: data.positions || [],
            status: data.status || "Pending",
          });
        } else {
          submissions.push({
            type: "enquiry",
            name: data.name || "N/A",
            email: data.email || "N/A",
            number: data.number || "N/A",
            requirement: data.requirement || "N/A",
            status: data.status || "Pending",
          });
        }
      });
      
      console.log("Fetched submissions:", submissions.length);
      set({ submissions });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  },

  fetchAdmins: async () => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching admins...");
      const docRef = doc(rdTechDb, collections.admins, "admins");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const adminEmails = docSnap.data().emails || [];
        console.log("Fetched admin emails:", adminEmails);
        set({ admins: adminEmails });
      } else {
        console.log("No admin document found");
        set({ admins: [] });
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  },
}));
