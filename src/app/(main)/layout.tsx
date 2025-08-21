import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { DynamicThemeProvider } from "@/components/DynamicThemeProvider";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <DynamicThemeProvider>
                    {children}
                </DynamicThemeProvider>
            </main>
            <Footer />
        </div>
    );
}
