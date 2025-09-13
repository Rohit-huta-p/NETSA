

"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OrganizerWelcome } from "./components/OrganizerWelcome";
import { YourEvents } from "./components/YourEvents";
import { DashboardSidebar } from "./components/DashboardSidebar";
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
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You do not have permission to view this page. Redirecting...
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (user.role !== 'organizer') {
        return (
            <div className="container mx-auto py-10">
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Welcome, {user.firstName}</AlertTitle>
                    <AlertDescription>
                        This is your dashboard. Content for your role will be available soon.
                    </AlertDescription>
                </Alert>
            </div>
        )
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
