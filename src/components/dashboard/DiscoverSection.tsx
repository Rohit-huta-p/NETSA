
"use client";

import { useUser } from "@/hooks/useUser";

export function DiscoverSection() {
    const { user } = useUser();
    return (
        <div className="text-center bg-card rounded-lg p-8 shadow-lg border">
            {user && (
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h2>
            )}
            <h1 className="text-4xl font-bold">Discover Your Next <span className="text-primary">Opportunity</span></h1>
            <p className="text-muted-foreground mt-2">Browse jobs, workshops, and connect with the community.</p>
        </div>
    )
}
