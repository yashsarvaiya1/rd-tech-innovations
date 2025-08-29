import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { collections, rdTechDb } from "@/firebase";
import type {
  CareerSubmission,
  EnquirySubmission,
  Submission,
} from "@/models/submission";
import { FirebaseError } from "./base";

export class SubmissionService {
  // ✅ FIXED: Fetch all submissions with document IDs
  static async fetchAllSubmissions(): Promise<Submission[]> {
    try {
      console.log("Fetching all submissions...");

      const querySnapshot = await getDocs(
        collection(rdTechDb, collections.submissions),
      );
      const submissions: Submission[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let submission: Submission;

        if (data.type === "career") {
          submission = {
            id: doc.id, // ✅ ADD DOCUMENT ID
            type: "career",
            name: data.name || "N/A",
            email: data.email || "N/A",
            number: data.number || "N/A",
            location: data.location || "N/A",
            portfolioOrLink: data.portfolioOrLink || "N/A",
            ctc: data.ctc || "N/A",
            about: data.about || "N/A",
            resumeUrl: data.resumeUrl,
            positions: data.positions || [],
            status: data.status || "pending",
            createdAt: data.createdAt, // ✅ ADD CREATED AT
          } as CareerSubmission & { id: string; createdAt: any };
        } else {
          submission = {
            id: doc.id, // ✅ ADD DOCUMENT ID
            type: "enquiry",
            name: data.name || "N/A",
            email: data.email || "N/A",
            number: data.number || "N/A",
            requirement: data.requirement || "N/A",
            status: data.status || "pending",
            createdAt: data.createdAt, // ✅ ADD CREATED AT
          } as EnquirySubmission & { id: string; createdAt: any };
        }

        submissions.push(submission);
      });

      console.log(`Fetched ${submissions.length} submissions with IDs`);
      return submissions;
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw new FirebaseError("Failed to fetch submissions");
    }
  }

  // ✅ FIXED: Fetch submissions by type with document IDs
  static async fetchSubmissionsByType(
    type: "enquiry" | "career",
  ): Promise<Submission[]> {
    try {
      console.log(`Fetching ${type} submissions...`);

      const q = query(
        collection(rdTechDb, collections.submissions),
        where("type", "==", type),
      );

      const querySnapshot = await getDocs(q);
      const submissions: Submission[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let submission: Submission;

        if (type === "career") {
          submission = {
            id: doc.id, // ✅ ADD DOCUMENT ID
            type: "career",
            name: data.name || "N/A",
            email: data.email || "N/A",
            number: data.number || "N/A",
            location: data.location || "N/A",
            portfolioOrLink: data.portfolioOrLink || "N/A",
            ctc: data.ctc || "N/A",
            about: data.about || "N/A",
            resumeUrl: data.resumeUrl,
            positions: data.positions || [],
            status: data.status || "pending",
            createdAt: data.createdAt, // ✅ ADD CREATED AT
          } as CareerSubmission & { id: string; createdAt: any };
        } else {
          submission = {
            id: doc.id, // ✅ ADD DOCUMENT ID
            type: "enquiry",
            name: data.name || "N/A",
            email: data.email || "N/A",
            number: data.number || "N/A",
            requirement: data.requirement || "N/A",
            status: data.status || "pending",
            createdAt: data.createdAt, // ✅ ADD CREATED AT
          } as EnquirySubmission & { id: string; createdAt: any };
        }

        submissions.push(submission);
      });

      console.log(`Fetched ${submissions.length} ${type} submissions with IDs`);
      return submissions;
    } catch (error) {
      console.error(`Error fetching ${type} submissions:`, error);
      throw new FirebaseError(`Failed to fetch ${type} submissions`);
    }
  }

  // Update submission status using document ID
  static async updateSubmissionStatus(
    submissionId: string,
    status: string,
  ): Promise<void> {
    try {
      console.log(`Updating submission ${submissionId} status to: ${status}`);

      const docRef = doc(rdTechDb, collections.submissions, submissionId);

      await updateDoc(docRef, {
        status: status,
        updatedAt: new Date().toISOString(),
      });

      console.log(`Submission status updated successfully`);
    } catch (error) {
      console.error(`Error updating submission status:`, error);
      throw new FirebaseError("Failed to update submission status");
    }
  }

  // Rest of your methods remain the same...

  // Create new enquiry submission
  static async createEnquirySubmission(
    data: Omit<EnquirySubmission, "type" | "status">,
  ): Promise<string> {
    try {
      console.log("Creating enquiry submission:", data);

      const docRef = doc(collection(rdTechDb, collections.submissions));
      const submission = {
        type: "enquiry" as const,
        name: data.name,
        email: data.email,
        number: data.number,
        requirement: data.requirement,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await setDoc(docRef, submission);

      console.log(`Enquiry submission created with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error creating enquiry submission:", error);
      throw new FirebaseError("Failed to create enquiry submission");
    }
  }

  // Create new career submission
  static async createCareerSubmission(
    data: Omit<CareerSubmission, "type" | "status">,
  ): Promise<string> {
    try {
      console.log("Creating career submission:", data);

      const docRef = doc(collection(rdTechDb, collections.submissions));
      const submission = {
        type: "career" as const,
        name: data.name,
        email: data.email,
        number: data.number,
        location: data.location,
        portfolioOrLink: data.portfolioOrLink,
        ctc: data.ctc,
        about: data.about,
        resumeUrl: data.resumeUrl,
        positions: data.positions,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await setDoc(docRef, submission);

      console.log(`Career submission created with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error creating career submission:", error);
      throw new FirebaseError("Failed to create career submission");
    }
  }

  // Get submissions count by status
  static async getSubmissionStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    lost: number;
  }> {
    try {
      const submissions = await SubmissionService.fetchAllSubmissions();

      return {
        total: submissions.length,
        pending: submissions.filter((s) => s.status === "pending").length,
        completed: submissions.filter((s) => s.status === "completed").length,
        lost: submissions.filter((s) => s.status === "lost").length,
      };
    } catch (error) {
      console.error("Error getting submission stats:", error);
      throw new FirebaseError("Failed to get submission statistics");
    }
  }
}
