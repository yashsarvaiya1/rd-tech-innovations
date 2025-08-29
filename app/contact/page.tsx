import type { Metadata } from "next";

export { default } from "@/components/pages/ContactPage";

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
  title: "Contact RD Tech Innovations",
  description:
    "Get in touch with RD Tech Innovations for web development, mobile apps, and cloud solutions. Contact us today to discuss your project and bring your ideas to life.",
  keywords: [
    "contact RD Tech",
    "get in touch",
    "software development contact",
    "web development company contact",
    "mobile app company contact",
    "cloud solutions contact",
    "RD Tech Innovations contact",
  ],
  openGraph: {
    title: "Contact RD Tech Innovations",
    description:
      "We'd love to hear from you. Reach out to RD Tech Innovations to discuss your project or partnership opportunities.",
    url: "/contact", // Relative to metadataBase - resolves to baseURL + /contact
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg", // Relative path - resolves to baseURL + /og-image.jpg
        width: 1200,
        height: 630,
        alt: "Contact RD Tech Innovations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact RD Tech Innovations",
    description:
      "Partner with RD Tech Innovations. Contact us for web, mobile, and cloud solutions.",
    images: ["/og-image.jpg"], // Relative path
  },
  robots: {
    index: true,
    follow: true,
  },
};
