import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LevelUp",
  description: "A premium self-growth operating system for building a better version of yourself.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${grotesk.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
