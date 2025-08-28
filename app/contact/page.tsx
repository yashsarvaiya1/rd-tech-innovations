import { Metadata } from "next";
export { default } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
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
      "We’d love to hear from you. Reach out to RD Tech Innovations to discuss your project or partnership opportunities.",
    url: "https://www.rdtechinnovations.com/contact",
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
