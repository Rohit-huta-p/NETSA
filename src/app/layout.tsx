
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'TalentMatch Onboarding',
  description: 'Join our community of artists and recruiters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <Providers>
            {children}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
