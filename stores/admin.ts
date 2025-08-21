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
  setSelectedSection: (section: string) => void;
  setContent: (content: Content | null) => void;
  setSubmissions: (submissions: Submission[]) => void;
  addAdmin: (email: string) => void;
  fetchContent: (section: string) => Promise<void>;
  fetchSubmissions: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedSection: null,
  content: null,
  submissions: [],
  admins: [],
  setSelectedSection: (section) => set({ selectedSection: section }),
  setContent: (content) => set({ content }),
  setSubmissions: (submissions) => set({ submissions }),
  addAdmin: (email) => set((state) => ({ admins: [...state.admins, email] })),
  fetchContent: async (section) => {
    if (!section) return;
    try {
      const docRef = doc(rdTechDb, collections.content, section);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ content: { id: section, ...docSnap.data() } as Content });
      } else {
        set({ content: { id: section } });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  },
  fetchSubmissions: async () => {
    try {
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
      console.log("Fetched submissions:", submissions);
      set({ submissions });
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  },
  fetchAdmins: async () => {
    try {
      const docRef = doc(rdTechDb, collections.admins, "admins");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ admins: docSnap.data().emails || [] });
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  },
}));
