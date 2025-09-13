
"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrganizerWelcome } from "./(main)/dashboard/components/OrganizerWelcome";
import { YourEvents } from "./(main)/dashboard/components/YourEvents";
import { DashboardSidebar } from "./(main)/dashboard/components/DashboardSidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


export default function DashboardPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login'); 
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
         return <div>Loading...</div>;
    }

    if (user.role !== 'organizer') {
        useEffect(() => {
            router.push('/events');
        }, [router]);
        return <div>Redirecting...</div>;
    }
    
    return (
        <div className="bg-muted/30">
            <div className="container mx-auto py-8">
                <OrganizerWelcome name={user.firstName} />
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <YourEvents />
                    </div>
                    <div className="lg:col-span-1">
                        <DashboardSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
