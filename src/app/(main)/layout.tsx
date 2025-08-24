
import { DynamicThemeProvider } from "@/components/DynamicThemeProvider";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/Header";
import { Suspense } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DynamicThemeProvider>
            <SidebarProvider>
                <div className="flex min-h-screen">
                    <DashboardSidebar />
                    <SidebarInset>
                         <Header />
                         <main className="flex-1 p-4 md:p-6 lg:p-8">
                             {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </DynamicThemeProvider>
    );
}
