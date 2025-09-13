
"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!user) {
            router.push('/login'); 
        } else if (user.role === 'organizer') {
            router.push('/dashboard');
        } else {
            router.push('/events');
        }
    }, [user, loading, router]);

    // Display a loading skeleton or a blank page while redirecting
    return (
         <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
}
