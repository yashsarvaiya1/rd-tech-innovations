import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CareerSubmission, EnquirySubmission } from "@/models/submission";
import { SubmissionService } from "@/services/submissionService";

interface SubmissionState {
  // UI State
  loading: boolean;
  error: string | null;
  success: string | null;
  dailySubmissionCount: number;
  lastSubmissionDate: string | null;

  // Actions
  submitEnquiry: (
    data: Omit<EnquirySubmission, "type" | "status">,
  ) => Promise<boolean>;
  submitCareerApplication: (
    data: Omit<CareerSubmission, "type" | "status">,
  ) => Promise<boolean>;
  checkDailyLimit: () => boolean;
  incrementDailyCount: () => void;
  resetDailyCount: () => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
  resetSubmissionState: () => void;
}

const DAILY_SUBMISSION_LIMIT = 3;

export const useSubmissionStore = create<SubmissionState>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        // Initial State
        loading: false,
        error: null,
        success: null,
        dailySubmissionCount: 0,
        lastSubmissionDate: null,

        // Actions
        submitEnquiry: async (data) => {
          const { checkDailyLimit, incrementDailyCount, setError, setSuccess } =
            get();

          if (!checkDailyLimit()) {
            setError(
              "Daily submission limit reached. Please try again tomorrow.",
            );
            return false;
          }

          try {
            set({ loading: true, error: null, success: null });

            console.log("[SubmissionStore] Submitting enquiry:", data);

            await SubmissionService.createEnquirySubmission(data);

            incrementDailyCount();
            setSuccess(
              "Your enquiry has been submitted successfully! We'll get back to you soon.",
            );

            return true;
          } catch (error) {
            console.error("[SubmissionStore] Error submitting enquiry:", error);
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to submit enquiry. Please try again.";
            setError(errorMessage);
            return false;
          } finally {
            set({ loading: false });
          }
        },

        submitCareerApplication: async (data) => {
          const { checkDailyLimit, incrementDailyCount, setError, setSuccess } =
            get();

          if (!checkDailyLimit()) {
            setError(
              "Daily submission limit reached. Please try again tomorrow.",
            );
            return false;
          }

          try {
            set({ loading: true, error: null, success: null });

            console.log(
              "[SubmissionStore] Submitting career application:",
              data,
            );

            await SubmissionService.createCareerSubmission(data);

            incrementDailyCount();
            setSuccess(
              "Your application has been submitted successfully! We'll review it and contact you soon.",
            );

            return true;
          } catch (error) {
            console.error(
              "[SubmissionStore] Error submitting career application:",
              error,
            );
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to submit application. Please try again.";
            setError(errorMessage);
            return false;
          } finally {
            set({ loading: false });
          }
        },

        checkDailyLimit: () => {
          const { dailySubmissionCount, lastSubmissionDate } = get();
          const today = new Date().toDateString();

          // Reset count if it's a new day
          if (lastSubmissionDate !== today) {
            set({
              dailySubmissionCount: 0,
              lastSubmissionDate: today,
            });
            return true;
          }

          return dailySubmissionCount < DAILY_SUBMISSION_LIMIT;
        },

        incrementDailyCount: () => {
          const { dailySubmissionCount } = get();
          const today = new Date().toDateString();
          const newCount = dailySubmissionCount + 1;

          set({
            dailySubmissionCount: newCount,
            lastSubmissionDate: today,
          });
        },

        resetDailyCount: () => {
          set({
            dailySubmissionCount: 0,
            lastSubmissionDate: null,
          });
        },

        setError: (error) => {
          set({ error, success: null });
        },

        setSuccess: (success) => {
          set({ success, error: null });
        },

        clearMessages: () => {
          set({ error: null, success: null });
        },

        resetSubmissionState: () => {
          set({
            loading: false,
            error: null,
            success: null,
            dailySubmissionCount: 0,
            lastSubmissionDate: null,
          });
        },
      })),
      {
        name: "submission-store",
        partialize: (state) => ({
          dailySubmissionCount: state.dailySubmissionCount,
          lastSubmissionDate: state.lastSubmissionDate,
        }),
      },
    ),
    {
      name: "submission-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

// ✅ FIXED: Custom hooks with useShallow to prevent infinite loops
export const useSubmissionActions = () => {
  return useSubmissionStore(
    useShallow((state) => ({
      submitEnquiry: state.submitEnquiry,
      submitCareerApplication: state.submitCareerApplication,
      clearMessages: state.clearMessages,
      resetSubmissionState: state.resetSubmissionState,
    })),
  );
};

export const useSubmissionStatus = () => {
  return useSubmissionStore(
    useShallow((state) => ({
      loading: state.loading,
      error: state.error,
      success: state.success,
      canSubmit: state.checkDailyLimit(),
      remainingSubmissions: Math.max(
        0,
        DAILY_SUBMISSION_LIMIT - state.dailySubmissionCount,
      ),
    })),
  );
};

// Auto-clear messages after a timeout
useSubmissionStore.subscribe(
  (state) => state.success || state.error,
  (hasMessage) => {
    if (hasMessage) {
      setTimeout(() => {
        useSubmissionStore.getState().clearMessages();
      }, 5000);
    }
  },
);
