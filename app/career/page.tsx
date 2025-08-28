import { Metadata } from "next";
export { default } from "@/components/pages/CareerPage";

export const metadata: Metadata = {
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
    url: "https://www.rdtechinnovations.com/career",
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
