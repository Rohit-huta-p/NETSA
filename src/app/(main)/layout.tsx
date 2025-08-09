
"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useUser } from "@/hooks/useUser";
import { PageLoader } from "@/components/layout/PageLoader";
import { useEffect } from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useUser(); 

    useEffect(() => {
        if (user?.role === 'organizer') {
            document.documentElement.classList.add('organizer-theme');
        } else {
            document.documentElement.classList.remove('organizer-theme');
        }

        // Cleanup function to remove the class when the component unmounts
        // or the user changes.
        return () => {
             document.documentElement.classList.remove('organizer-theme');
        }
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <PageLoader />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
