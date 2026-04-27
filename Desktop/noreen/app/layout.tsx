import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { RootLayout as Layout } from "@/components/layout/root-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MaaKiRasoi - Authentic Pakistani Home-Cooked Meals",
  description: "Delicious Daal Chawal, Kabab, and authentic Pakistani dishes delivered fresh to your door.",
  openGraph: {
    title: "MaaKiRasoi - Authentic Pakistani Home-Cooked Meals",
    description: "Delicious Daal Chawal, Kabab, and authentic Pakistani dishes delivered fresh to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Layout>{children}</Layout>
        </body>
      </html>
    </ClerkProvider>
  );
}
