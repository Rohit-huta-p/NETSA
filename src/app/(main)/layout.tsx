
"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useUser } from "@/hooks/useUser";
import { PageLoader } from "@/components/layout/PageLoader";
import { Suspense } from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useUser(); // Initialize the user hook for all main layouts
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <PageLoader />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
