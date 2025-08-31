import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { collections, rdTechDb } from "@/firebase";
import type { Admins } from "@/models/admins";
import { FirebaseError } from "./base";

export class AdminService {
  // Fetch admin emails (one-time)
  static async fetchAdmins(): Promise<string[]> {
    try {

      const docRef = doc(rdTechDb, collections.admins, "admins");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Admins;
        return data.emails;
      }
      return [];
    } catch (error) {
      throw new FirebaseError("Failed to fetch admin list");
    }
  }

  // Realtime listener for admin emails
  static listenAdmins(callback: (emails: string[]) => void): Unsubscribe {

    const docRef = doc(rdTechDb, collections.admins, "admins");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Admins;
          callback(data.emails);
        } else {
          callback([]);
        }
      },
      (error) => {
        callback([]);
      }
    );

    return unsubscribe;
  }

  // Add new admin email
  static async addAdmin(email: string): Promise<void> {
    try {

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

    } catch (error) {
      if (error instanceof FirebaseError) throw error;
      throw new FirebaseError("Failed to add admin");
    }
  }

  // Remove admin email
  static async removeAdmin(email: string): Promise<void> {
    try {

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

    } catch (error) {
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
      return false;
    }
  }
}
