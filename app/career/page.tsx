import type { Metadata } from "next";

export { default } from "@/components/pages/CareerPage";

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
  title: "Careers at RD Tech Innovations",
  description:
    "Join RD Tech Innovations and shape the future of digital solutions. Explore exciting career opportunities in web development, mobile apps, and cloud technologies.",
  keywords: [
    "careers",
    "jobs",
    "hiring",
    "tech jobs",
    "web development careers",
    "mobile app jobs",
    "cloud solutions careers",
    "RD Tech careers",
  ],
  openGraph: {
    title: "Careers at RD Tech Innovations",
    description:
      "Grow your career with RD Tech Innovations. Discover opportunities in cutting-edge software development.",
    url: "/career", // Relative to metadataBase - resolves to baseURL + /career
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg", // Relative path - resolves to baseURL + /og-image.jpg
        width: 1200,
        height: 630,
        alt: "RD Tech Innovations Careers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at RD Tech Innovations",
    description:
      "Join our team and shape the future of digital transformation.",
    images: ["/og-image.jpg"], // Relative path
  },
  robots: {
    index: true,
    follow: true,
  },
};
