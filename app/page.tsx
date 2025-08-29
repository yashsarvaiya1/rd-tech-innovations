import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";

// Helper function to get base URL
const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://www.rdtechinnovations.com";
  }
  return 'http://localhost:3000';
};

const baseURL = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseURL), // 🎯 This fixes the warning!
  title: "RD Tech Innovations - Transform Your Digital Dreams",
  description:
    "Leading software development company specializing in cutting-edge web applications, mobile apps, and digital solutions that drive business growth.",
  keywords: [
    "RD Tech",
    "software development",
    "web applications",
    "mobile apps",
    "digital solutions",
    "cloud solutions",
    "tech innovations",
  ],
  openGraph: {
    title: "RD Tech Innovations - Transform Your Digital Dreams",
    description:
      "Leading software development company specializing in web, mobile, and digital solutions.",
    url: "/", // Relative to metadataBase - resolves to your full domain
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg", // Relative path - resolves to baseURL + /og-image.jpg
        width: 1200,
        height: 630,
        alt: "RD Tech Innovations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RD Tech Innovations",
    description:
      "Transforming digital dreams into reality with innovative software solutions.",
    images: ["/og-image.jpg"], // Relative path
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <HomePage />;
}
