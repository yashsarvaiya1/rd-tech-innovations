import { Metadata } from "next";
export { default } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About Us - RD Tech Innovations",
  description:
    "Learn more about RD Tech Innovations — our mission, vision, and the passionate team transforming ideas into digital reality with cutting-edge technology solutions.",
  keywords: [
    "about RD Tech",
    "tech company",
    "software development team",
    "digital solutions",
    "web development company",
    "mobile app company",
    "cloud solutions",
    "RD Tech Innovations",
  ],
  openGraph: {
    title: "About Us - RD Tech Innovations",
    description:
      "Discover the story, mission, and vision behind RD Tech Innovations. Meet the team driving digital innovation forward.",
    url: "https://www.rdtechinnovations.com/about",
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About RD Tech Innovations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About RD Tech Innovations",
    description:
      "We transform ideas into digital reality with expertise in web, mobile, and cloud solutions.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
