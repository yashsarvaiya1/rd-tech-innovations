import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RD Tech Innovations - Transforming Ideas into Digital Reality",
  description: "We craft cutting-edge solutions that drive innovation and growth. Expert in web development, mobile apps, cloud solutions, and technical consulting.",
  keywords: ["tech innovations", "web development", "mobile apps", "cloud solutions", "RD Tech"],
  openGraph: {
    title: "RD Tech Innovations",
    description: "Transforming Ideas into Digital Reality",
    url: "https://www.rdtechinnovations.com", // Update with actual domain later
    siteName: "RD Tech Innovations",
    images: [
      {
        url: "/og-image.jpg", // Add an OG image in public/ later
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
    description: "Transforming Ideas into Digital Reality",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
