
"use client";

import { useUser } from "@/hooks/useUser";

export function DiscoverSection() {
    const { user } = useUser();
    return (
        <div className="text-center bg-gradient-to-r from-secondary to-primary rounded-lg p-8 shadow-lg text-white">
            {user && (
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h2>
            )}
            <h1 className="text-4xl font-bold">Discover Your Next Opportunity</h1>
            <p className="text-primary-foreground/80 mt-2">Browse jobs, workshops, and connect with the community.</p>
        </div>
    )
}
