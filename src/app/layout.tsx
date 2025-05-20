import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mama, In Your Absence",
  description: "An intergenerational conversation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mamainyourabsence.com/" />
        <meta property="og:title" content="Mama, In Your Absence" />
        <meta
          property="og:description"
          content="An interactive documentary by Munachiso Nzeribe exploring memory, matriarchy, and legacy."
        />
        <meta
          property="og:image"
          content="https://www.mamainyourabsence.com/preview.png"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mama, In Your Absence" />
        <meta
          name="twitter:description"
          content="An interactive documentary by Munachiso Nzeribe exploring memory, matriarchy, and legacy."
        />
        <meta
          name="twitter:image"
          content="https://www.mamainyourabsence.com/preview.png"
        />
      </Head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
