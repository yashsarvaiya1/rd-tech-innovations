import { doc, getDoc, setDoc } from "firebase/firestore";
import { collections, rdTechDb } from "@/firebase";
import type { Admins } from "@/models/admins";
import { FirebaseError } from "./base";

export class AdminService {
  // Fetch admin emails
  static async fetchAdmins(): Promise<string[]> {
    try {
      console.log("Fetching admin emails...");

      const docRef = doc(rdTechDb, collections.admins, "admins");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Admins;
        console.log(`Fetched ${data.emails.length} admin emails`);
        return data.emails;
      }

      console.log("No admin document found, returning empty array");
      return [];
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw new FirebaseError("Failed to fetch admin list");
    }
  }

  // Add new admin email
  static async addAdmin(email: string): Promise<void> {
    try {
      console.log(`Adding admin email: ${email}`);

      const currentAdmins = await AdminService.fetchAdmins();

      if (currentAdmins.includes(email)) {
        throw new FirebaseError("Email already exists in admin list");
      }

      const updatedAdmins = [...currentAdmins, email];

      await setDoc(doc(rdTechDb, collections.admins, "admins"), {
        id: "admins",
        emails: updatedAdmins,
        updatedAt: new Date().toISOString(),
      });

      console.log(`Admin email ${email} added successfully`);
    } catch (error) {
      console.error("Error adding admin:", error);
      if (error instanceof FirebaseError) throw error;
      throw new FirebaseError("Failed to add admin");
    }
  }

  // Remove admin email
  static async removeAdmin(email: string): Promise<void> {
    try {
      console.log(`Removing admin email: ${email}`);

      const currentAdmins = await AdminService.fetchAdmins();
      const updatedAdmins = currentAdmins.filter((admin) => admin !== email);

      if (updatedAdmins.length === currentAdmins.length) {
        throw new FirebaseError("Email not found in admin list");
      }

      await setDoc(doc(rdTechDb, collections.admins, "admins"), {
        id: "admins",
        emails: updatedAdmins,
        updatedAt: new Date().toISOString(),
      });

      console.log(`Admin email ${email} removed successfully`);
    } catch (error) {
      console.error("Error removing admin:", error);
      if (error instanceof FirebaseError) throw error;
      throw new FirebaseError("Failed to remove admin");
    }
  }

  // Check if email is admin
  static async isAdmin(email: string): Promise<boolean> {
    try {
      const admins = await AdminService.fetchAdmins();
      return admins.includes(email);
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}
