import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Providers from "@/components/Providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalentMatch Onboarding",
  description: "Join our community of artists and recruiters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
            {children}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
