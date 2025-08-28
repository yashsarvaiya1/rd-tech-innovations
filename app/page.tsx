import { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";

export const metadata: Metadata = {
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
    url: "https://www.rdtechinnovations.com",
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <HomePage />;
}
