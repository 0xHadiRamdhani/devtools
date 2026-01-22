import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevTools - Developer Utilities",
  description: "Essential developer tools in one place: JSON Formatter, Base64, JWT Decoder, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex`}
      >
        <Sidebar />
        <main className="flex-1 mt-16 lg:mt-0 lg:ml-64 min-h-screen p-4 lg:p-12">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
