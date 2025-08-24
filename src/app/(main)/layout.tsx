
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { DynamicThemeProvider } from "@/components/DynamicThemeProvider";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DynamicThemeProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <Suspense fallback={<div>Loading...</div>}>
                        {children}
                    </Suspense>
                </main>
                <Footer />
            </div>
        </DynamicThemeProvider>
    );
}
