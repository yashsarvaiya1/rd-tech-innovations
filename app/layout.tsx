import type { Metadata } from "next";
import { Manrope, Work_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ContentProvider from "@/providers/ContentProviders";

const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope" 
});
const workSans = Work_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-work" 
});


// Helper function to get the base URL
const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://www.rdtechinnovations.com";
  }
  return 'http://localhost:3000';
};

const baseURL = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseURL), // 🎯 This fixes the warning!
  title: "RD Tech Innovations - Transforming Ideas into Digital Reality",
  description:
    "We craft cutting-edge solutions that drive innovation and growth. Expert in web development, mobile apps, cloud solutions, and technical consulting.",
  keywords: [
    "tech innovations",
    "web development",
    "mobile apps",
    "cloud solutions",
    "RD Tech",
  ],
  openGraph: {
    title: "RD Tech Innovations",
    description: "Transforming Ideas into Digital Reality",
    url: "/", // Relative to metadataBase
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
    description: "Transforming Ideas into Digital Reality",
    images: ["/og-image.jpg"], // Relative path
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.variable} ${manrope.variable} antialiased`}>
        <ContentProvider>
          <Navbar />
          {children}
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
