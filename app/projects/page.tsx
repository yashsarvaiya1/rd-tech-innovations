import type { Metadata } from "next";

export { default } from "@/components/pages/ProjectsPage";

export const metadata: Metadata = {
  title: "Our Projects - RD Tech Innovations",
  description:
    "Explore the projects delivered by RD Tech Innovations. From web development to mobile apps and cloud solutions, we build digital products that drive innovation and growth.",
  keywords: [
    "RD Tech projects",
    "web development portfolio",
    "mobile app projects",
    "cloud solutions case studies",
    "software development work",
    "tech company portfolio",
    "RD Tech Innovations projects",
  ],
  openGraph: {
    title: "Our Projects - RD Tech Innovations",
    description:
      "See how RD Tech Innovations transforms ideas into reality with impactful digital solutions across industries.",
    url: "https://www.rdtechinnovations.com/projects",
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RD Tech Innovations Projects",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects - RD Tech Innovations",
    description:
      "Browse our portfolio of web, mobile, and cloud projects that showcase innovation and impact.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
