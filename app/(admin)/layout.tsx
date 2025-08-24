import type { Metadata } from "next";
import "../globals.css";
import ContentProvider from "@/providers/ContentProviers"; // ✅ Fixed typo

export const metadata: Metadata = {
  title: "Admin Dashboard - RD Tech Innovations",
  description: "Admin panel for managing content and users",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContentProvider>
      {/* NO NAVBAR - Clean admin/auth layout */}
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ContentProvider>
  );
}
