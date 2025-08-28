import type { Metadata } from "next";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Login RD Tech Innovations",
  description: "Secure login and account access for RD Tech Innovations platform.",
  robots: {
    index: false, // don’t index auth page
    follow: false,
  },
};

export default function Auth() {
  return <AuthPage />;
}
