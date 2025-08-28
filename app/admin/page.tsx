import { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard - RD Tech Innovations",
  description:
    "Administrative dashboard for managing RD Tech Innovations content, users, and settings.",
  robots: {
    index: false,
    follow: false, // Prevents crawling of admin pages
  },
};

export default function Admin() {
  return <AdminLayout />;
}
