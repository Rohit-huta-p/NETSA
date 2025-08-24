
"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { LayoutDashboard, Users, FileText, MessageSquare, BarChart, Settings, LifeBuoy, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useUserStore } from "@/store/userStore";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";

export function DashboardSidebar() {
    const { user } = useUser();
    const { clearUser } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
      await signOut(auth);
      clearUser();
      router.push('/login');
    };

    const isActive = (path: string) => pathname.startsWith(`/dashboard${path}`) || (path === '' && pathname === '/dashboard');

    const navItems = [
        { href: "", label: "Dashboard", icon: LayoutDashboard, roles: ['organizer', 'client'] },
        { href: "/applications", label: "Applicants", icon: FileText, roles: ['organizer'] },
        { href: "/clients", label: "Clients Directory", icon: Users, roles: ['organizer', 'client'] },
        { href: "/messages", label: "Messages", icon: MessageSquare, roles: ['organizer', 'client'] },
        { href: "/analytics", label: "Analytics", icon: BarChart, roles: ['organizer'] },
    ];
    
    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
                    <span className="font-bold text-lg">Netsa</span>
                 </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                <SidebarMenu>
                    {navItems.map((item) => {
                        if (user?.role && item.roles.includes(user.role)) {
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                        href={`/dashboard${item.href}`} 
                                        isActive={isActive(item.href)}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        }
                        return null;
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="gap-0 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/dashboard/profile" isActive={isActive('/profile')}>
                            <Settings />
                            <span>Profile & Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#">
                            <LifeBuoy />
                            <span>Help Center</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="flex items-center justify-between p-2 mt-2 border-t">
                    <ThemeToggle />
                    <SidebarMenuButton onClick={handleLogout} className="w-auto h-auto p-2">
                        <LogOut />
                    </SidebarMenuButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
