import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: 'Dr. Rehana Mushtaq - Associate Professor | Karachi',
  description: 'Dr. Rehana Mushtaq - Associate Professor at a leading hospital in Karachi, Pakistan. Specializing in healthcare. Book an appointment today.',
  keywords: 'Dr. Rehana Mushtaq, Associate Professor, Karachi, Pakistan, Hospital, Healthcare, Medical Specialist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
