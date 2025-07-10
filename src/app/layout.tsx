import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Famous Birthdates - Discover Famous People Who Share Your Birthdate",
  description:
    "Enter your birthdate and discover the top 3 famous people who share your special day. Learn about their achievements and contributions.",
  keywords:
    "famous people, birthdate, celebrities, historical figures, birthday",
  authors: [{ name: "Famous Birthdates" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
