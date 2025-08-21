import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins'
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-pt-sans'
});

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
      <body className={`${poppins.variable} ${ptSans.variable}`}>
        <Providers>
            {children}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
