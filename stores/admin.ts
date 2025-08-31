import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Content } from "@/models/content";
import type { Submission } from "@/models/submission";
import { AdminService } from "@/services/adminService";
import { FirebaseError } from "@/services/base";
import { ContentService } from "@/services/contentService";
import { SubmissionService } from "@/services/submissionService";

interface AdminState {
  // Existing state (keep as-is for compatibility)
  selectedSection: string | null;
  content: Content | null;
  submissions: Submission[];
  admins: string[];
  loading: boolean;
  error: string | null;

  // New state for enhanced functionality
  submissionStats: {
    total: number;
    pending: number;
    completed: number;
    lost: number;
  } | null;

  // Existing methods (keep interface the same)
  setSelectedSection: (section: string) => void;
  setContent: (content: Content | null) => void;
  setSubmissions: (submissions: Submission[]) => void;
  addAdmin: (email: string) => void;
  fetchContent: (section: string) => Promise<void>;
  fetchSubmissions: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
  clearAdminData: () => void; // KEEP THIS - used by logout
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // New enhanced methods
  clearError: () => void;
  updateContentField: (
    sectionId: string,
    sectionKey: string,
    field: string,
    value: any,
  ) => Promise<void>;
  toggleSectionVisibility: (
    sectionId: string,
    sectionKey: string,
  ) => Promise<void>;
  addArrayItem: (
    sectionId: string,
    sectionKey: string,
    field: string,
    item: any,
  ) => Promise<void>;
  updateArrayItem: (
    sectionId: string,
    sectionKey: string,
    field: string,
    index: number,
    item: any,
  ) => Promise<void>;
  removeArrayItem: (
    sectionId: string,
    sectionKey: string,
    field: string,
    index: number,
  ) => Promise<void>;
  fetchSubmissionsByType: (type: "enquiry" | "career") => Promise<void>;
  updateSubmissionStatus: (
    submissionId: string,
    status: string,
  ) => Promise<void>;
  fetchSubmissionStats: () => Promise<void>;
  addAdminEmail: (email: string) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;

  // New: unsubscribe cleanup
  unsubscribeAdminsListener: (() => void) | null;
  startAdminsListener: () => void;
}

const initialState = {
  selectedSection: null,
  content: null,
  submissions: [],
  admins: [],
  loading: false,
  error: null,
  submissionStats: null,
  unsubscribeAdminsListener: null,
};

export const useAdminStore = create<AdminState>()(
  devtools(
    (set, get) => ({
      // Initial State
      ...initialState,

      // Existing methods (updated to use services but keep same interface)
      setSelectedSection: (section) => {
        set({ selectedSection: section });
      },

      setContent: (content) => {
        set({ content });
      },

      setSubmissions: (submissions) => {
        set({ submissions });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      addAdmin: (email) => {
        set((state) => ({
          admins: [...state.admins, email],
        }));
      },

      // KEEP THIS METHOD - used by logout in AdminLayout
      clearAdminData: () => {
        // stop listening to Firestore
        const unsubscribe = get().unsubscribeAdminsListener;
        if (unsubscribe) {
          unsubscribe();
        }
        set({
          ...initialState,
        });
      },

      // Updated to use services
      fetchContent: async (section) => {
        if (!section) return;

        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);

          const content = await ContentService.fetchSectionContent(section);

          set({ content });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch content";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      fetchSubmissions: async () => {
        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);
          const submissions = await SubmissionService.fetchAllSubmissions();

          set({ submissions });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch submissions";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      fetchAdmins: async () => {
        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);
          const admins = await AdminService.fetchAdmins();

          set({ admins });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch admins";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      // 🔥 Real-time listener for admins (better approach than polling)
      startAdminsListener: () => {
        const existingUnsub = get().unsubscribeAdminsListener;
        if (existingUnsub) {
          return;
        }
        const unsubscribe = AdminService.listenAdmins((emails) => {
          set({ admins: emails });
        });

        set({ unsubscribeAdminsListener: unsubscribe });
      },

      // New enhanced methods
      clearError: () => {
        set({ error: null });
      },

      updateContentField: async (sectionId, sectionKey, field, value) => {
        const { setError, content } = get();

        try {
          setError(null);
          await ContentService.updateSectionField(
            sectionId,
            sectionKey,
            field,
            value,
          );

          // Update local state optimistically
          if (content && content.id === sectionId) {
            const updatedContent = {
              ...content,
              [sectionKey]: {
                ...((content[sectionKey as keyof Content] as any) || {}),
                [field]: value,
              },
            };
            set({ content: updatedContent });
          }

        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to update field";
          setError(errorMessage);
        }
      },

      toggleSectionVisibility: async (sectionId, sectionKey) => {
        const { setError, content } = get();

        try {
          setError(null);
          const newHiddenState = await ContentService.toggleSectionVisibility(
            sectionId,
            sectionKey,
          );

          // Update local state
          if (content && content.id === sectionId) {
            const updatedContent = {
              ...content,
              [sectionKey]: {
                ...((content[sectionKey as keyof Content] as any) || {}),
                hidden: newHiddenState,
              },
            };
            set({ content: updatedContent });
          }

        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to toggle visibility";
          setError(errorMessage);
        }
      },

      addArrayItem: async (sectionId, sectionKey, field, item) => {
        const { setError } = get();

        try {
          setError(null);

          await ContentService.addArrayItem(sectionId, sectionKey, field, item);

          // Refetch content to get updated state
          await get().fetchContent(sectionId);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to add item";
          setError(errorMessage);
        }
      },

      updateArrayItem: async (sectionId, sectionKey, field, index, item) => {
        const { setError } = get();

        try {
          setError(null);
          await ContentService.updateArrayItem(
            sectionId,
            sectionKey,
            field,
            index,
            item,
          );

          // Refetch content to get updated state
          await get().fetchContent(sectionId);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to update array item";
          setError(errorMessage);
        }
      },

      removeArrayItem: async (sectionId, sectionKey, field, index) => {
        const { setError } = get();

        try {
          setError(null);
          await ContentService.removeArrayItem(
            sectionId,
            sectionKey,
            field,
            index,
          );

          // Refetch content to get updated state
          await get().fetchContent(sectionId);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to remove array item";
          setError(errorMessage);
        }
      },

      fetchSubmissionsByType: async (type) => {
        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);

          const submissions =
            await SubmissionService.fetchSubmissionsByType(type);

          set({ submissions });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : `Failed to fetch ${type} submissions`;
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      updateSubmissionStatus: async (submissionId, status) => {
        const { setError } = get();

        try {
          setError(null);
          await SubmissionService.updateSubmissionStatus(submissionId, status);

          // Refetch submissions after update
          await get().fetchSubmissions();
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to update submission status";
          setError(errorMessage);
        }
      },

      fetchSubmissionStats: async () => {
        const { setError } = get();

        try {
          setError(null);

          const stats = await SubmissionService.getSubmissionStats();

          set({ submissionStats: stats });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch submission stats";
          setError(errorMessage);
        }
      },

      addAdminEmail: async (email) => {
        const { setError, admins } = get();

        try {
          setError(null);

          await AdminService.addAdmin(email);

          // Optimistic update
          set({ admins: [...admins, email] });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to add admin";
          setError(errorMessage);
        }
      },

      removeAdmin: async (email) => {
        const { setError, admins } = get();

        try {
          setError(null);
          await AdminService.removeAdmin(email);

          // Optimistic update
          const updatedAdmins = admins.filter((admin) => admin !== email);
          set({ admins: updatedAdmins });
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to remove admin";
          setError(errorMessage);
        }
      },
    }),
    {
      name: "admin-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
