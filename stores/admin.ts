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
}

const initialState = {
  selectedSection: null,
  content: null,
  submissions: [],
  admins: [],
  loading: false,
  error: null,
  submissionStats: null,
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
        console.log("Clearing all admin data...");
        set({
          selectedSection: null,
          content: null,
          submissions: [],
          admins: [],
          loading: false,
          error: null,
          submissionStats: null,
        });
      },

      // Updated to use services
      fetchContent: async (section) => {
        if (!section) return;

        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);

          console.log(`[AdminStore] Fetching content for section: ${section}`);
          const content = await ContentService.fetchSectionContent(section);

          set({ content });
          console.log(`[AdminStore] Content fetched for ${section}`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch content";
          console.error("[AdminStore] Error fetching content:", error);
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

          console.log("[AdminStore] Fetching submissions...");
          const submissions = await SubmissionService.fetchAllSubmissions();

          set({ submissions });
          console.log(`[AdminStore] Fetched ${submissions.length} submissions`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch submissions";
          console.error("[AdminStore] Error fetching submissions:", error);
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

          console.log("[AdminStore] Fetching admins...");
          const admins = await AdminService.fetchAdmins();

          set({ admins });
          console.log(`[AdminStore] Fetched ${admins.length} admin emails`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch admins";
          console.error("[AdminStore] Error fetching admins:", error);
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      // New enhanced methods
      clearError: () => {
        set({ error: null });
      },

      updateContentField: async (sectionId, sectionKey, field, value) => {
        const { setError, content } = get();

        try {
          setError(null);

          console.log(
            `[AdminStore] Updating field ${field} in ${sectionKey} for section: ${sectionId}`,
          );
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

          console.log(`[AdminStore] Field ${field} updated successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to update field";
          console.error("[AdminStore] Error updating field:", error);
          setError(errorMessage);
        }
      },

      toggleSectionVisibility: async (sectionId, sectionKey) => {
        const { setError, content } = get();

        try {
          setError(null);

          console.log(
            `[AdminStore] Toggling visibility for ${sectionKey} in section: ${sectionId}`,
          );
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

          console.log(`[AdminStore] Section visibility toggled successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to toggle visibility";
          console.error("[AdminStore] Error toggling visibility:", error);
          setError(errorMessage);
        }
      },

      addArrayItem: async (sectionId, sectionKey, field, item) => {
        const { setError } = get();

        try {
          setError(null);

          console.log(`[AdminStore] Adding item to ${field} in ${sectionKey}`);
          await ContentService.addArrayItem(sectionId, sectionKey, field, item);

          // Refetch content to get updated state
          await get().fetchContent(sectionId);
          console.log(`[AdminStore] Item added to ${field} successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to add item";
          console.error("[AdminStore] Error adding array item:", error);
          setError(errorMessage);
        }
      },

      updateArrayItem: async (sectionId, sectionKey, field, index, item) => {
        const { setError } = get();

        try {
          setError(null);

          console.log(
            `[AdminStore] Updating item at index ${index} in ${field}`,
          );
          await ContentService.updateArrayItem(
            sectionId,
            sectionKey,
            field,
            index,
            item,
          );

          // Refetch content to get updated state
          await get().fetchContent(sectionId);
          console.log(`[AdminStore] Array item updated successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to update array item";
          console.error("[AdminStore] Error updating array item:", error);
          setError(errorMessage);
        }
      },

      removeArrayItem: async (sectionId, sectionKey, field, index) => {
        const { setError } = get();

        try {
          setError(null);

          console.log(
            `[AdminStore] Removing item at index ${index} from ${field}`,
          );
          await ContentService.removeArrayItem(
            sectionId,
            sectionKey,
            field,
            index,
          );

          // Refetch content to get updated state
          await get().fetchContent(sectionId);
          console.log(`[AdminStore] Array item removed successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to remove array item";
          console.error("[AdminStore] Error removing array item:", error);
          setError(errorMessage);
        }
      },

      fetchSubmissionsByType: async (type) => {
        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);

          console.log(`[AdminStore] Fetching ${type} submissions`);
          const submissions =
            await SubmissionService.fetchSubmissionsByType(type);

          set({ submissions });
          console.log(
            `[AdminStore] Fetched ${submissions.length} ${type} submissions`,
          );
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : `Failed to fetch ${type} submissions`;
          console.error(
            `[AdminStore] Error fetching ${type} submissions:`,
            error,
          );
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      updateSubmissionStatus: async (submissionId, status) => {
        const { setError, submissions } = get();

        try {
          setError(null);

          console.log(
            `[AdminStore] Updating submission ${submissionId} status to: ${status}`,
          );
          await SubmissionService.updateSubmissionStatus(submissionId, status);

          // Note: You'll need to add an id field when fetching submissions
          // For now, we'll refetch submissions after update
          await get().fetchSubmissions();
          console.log(`[AdminStore] Submission status updated successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to update submission status";
          console.error(
            "[AdminStore] Error updating submission status:",
            error,
          );
          setError(errorMessage);
        }
      },

      fetchSubmissionStats: async () => {
        const { setError } = get();

        try {
          setError(null);

          console.log("[AdminStore] Fetching submission statistics");
          const stats = await SubmissionService.getSubmissionStats();

          set({ submissionStats: stats });
          console.log(
            "[AdminStore] Submission stats fetched successfully:",
            stats,
          );
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to fetch submission stats";
          console.error("[AdminStore] Error fetching submission stats:", error);
          setError(errorMessage);
        }
      },

      addAdminEmail: async (email) => {
        const { setError, admins } = get();

        try {
          setError(null);

          console.log(`[AdminStore] Adding admin: ${email}`);
          await AdminService.addAdmin(email);

          // Update local state optimistically
          set({ admins: [...admins, email] });
          console.log(`[AdminStore] Admin ${email} added successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to add admin";
          console.error("[AdminStore] Error adding admin:", error);
          setError(errorMessage);
        }
      },

      removeAdmin: async (email) => {
        const { setError, admins } = get();

        try {
          setError(null);

          console.log(`[AdminStore] Removing admin: ${email}`);
          await AdminService.removeAdmin(email);

          // Update local state optimistically
          const updatedAdmins = admins.filter((admin) => admin !== email);
          set({ admins: updatedAdmins });
          console.log(`[AdminStore] Admin ${email} removed successfully`);
        } catch (error) {
          const errorMessage =
            error instanceof FirebaseError
              ? error.message
              : "Failed to remove admin";
          console.error("[AdminStore] Error removing admin:", error);
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
