import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Replaces 'export const metadata' and dynamically injects meta tags
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mama, in Your Absence",
    description: "An intergenerational conversation",
    openGraph: {
      title: "Mama, in Your Absence",
      description: "An interactive documentary by Munachiso Nzeribe exploring memory, matriarchy, and legacy.",
      url: "https://www.mamainyourabsence.com",
      siteName: "Mama, in Your Absence",
      images: [
        {
          url: "https://www.mamainyourabsence.com/preview.png",
          width: 1200,
          height: 630,
          alt: "Mama, in Your Absence preview image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Mama, in Your Absence",
      description: "An interactive documentary by Munachiso Nzeribe exploring memory, matriarchy, and legacy.",
      images: ["https://www.mamainyourabsence.com/preview.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
