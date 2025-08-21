import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SubmissionService } from "@/services/submissionService";
import { EnquirySubmission, CareerSubmission } from "@/models/submission";

interface SubmissionState {
  // UI State
  loading: boolean;
  error: string | null;
  success: string | null;
  dailySubmissionCount: number;
  
  // Actions
  submitEnquiry: (data: Omit<EnquirySubmission, "type" | "status">) => Promise<boolean>;
  submitCareerApplication: (data: Omit<CareerSubmission, "type" | "status">) => Promise<boolean>;
  checkDailyLimit: () => boolean;
  incrementDailyCount: () => void;
  resetDailyCount: () => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
}

const DAILY_SUBMISSION_LIMIT = 3;
const STORAGE_KEY = "dailySubmissions";

export const useSubmissionStore = create<SubmissionState>()(
  devtools(
    (set, get) => ({
      // Initial State
      loading: false,
      error: null,
      success: null,
      dailySubmissionCount: 0,

      // Actions
      submitEnquiry: async (data) => {
        const { checkDailyLimit, incrementDailyCount } = get();
        
        if (!checkDailyLimit()) {
          set({ error: "Daily submission limit reached. Please try again tomorrow." });
          return false;
        }
        
        try {
          set({ loading: true, error: null, success: null });
          
          console.log("[SubmissionStore] Submitting enquiry");
          await SubmissionService.createEnquirySubmission(data);
          
          incrementDailyCount();
          set({ 
            success: "Your enquiry has been submitted successfully!", 
            loading: false 
          });
          
          return true;
          
        } catch (error) {
          console.error("[SubmissionStore] Error submitting enquiry:", error);
          set({ 
            error: "Failed to submit enquiry. Please try again.", 
            loading: false 
          });
          return false;
        }
      },

      submitCareerApplication: async (data) => {
        const { checkDailyLimit, incrementDailyCount } = get();
        
        if (!checkDailyLimit()) {
          set({ error: "Daily submission limit reached. Please try again tomorrow." });
          return false;
        }
        
        try {
          set({ loading: true, error: null, success: null });
          
          console.log("[SubmissionStore] Submitting career application");
          await SubmissionService.createCareerSubmission(data);
          
          incrementDailyCount();
          set({ 
            success: "Your application has been submitted successfully!", 
            loading: false 
          });
          
          return true;
          
        } catch (error) {
          console.error("[SubmissionStore] Error submitting career application:", error);
          set({ 
            error: "Failed to submit application. Please try again.", 
            loading: false 
          });
          return false;
        }
      },

      checkDailyLimit: () => {
        const { dailySubmissionCount } = get();
        return dailySubmissionCount < DAILY_SUBMISSION_LIMIT;
      },

      incrementDailyCount: () => {
        const { dailySubmissionCount } = get();
        const newCount = dailySubmissionCount + 1;
        
        set({ dailySubmissionCount: newCount });
        
        // Store in localStorage with date
        const today = new Date().toDateString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          date: today,
          count: newCount
        }));
      },

      resetDailyCount: () => {
        set({ dailySubmissionCount: 0 });
        localStorage.removeItem(STORAGE_KEY);
      },

      setError: (error) => {
        set({ error });
      },

      setSuccess: (success) => {
        set({ success });
      },

      clearMessages: () => {
        set({ error: null, success: null });
      },
    }),
    {
      name: "submission-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Initialize daily count from localStorage
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const { date, count } = JSON.parse(stored);
      const today = new Date().toDateString();
      
      if (date === today) {
        useSubmissionStore.setState({ dailySubmissionCount: count });
      } else {
        // Reset if it's a new day
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Error parsing stored submission data:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
