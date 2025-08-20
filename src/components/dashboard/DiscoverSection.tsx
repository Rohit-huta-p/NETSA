
"use client";

import { useUser } from "@/hooks/useUser";

export function DiscoverSection() {
    const { user } = useUser();
    return (
        <div className="text-center bg-gradient-to-r from-[#0F0C29] to-[#302B63] rounded-lg p-8 shadow-lg">
            {user && (
                <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.firstName}!</h2>
            )}
            <h1 className="text-4xl font-bold text-white">Discover Your Next Opportunity</h1>
            <p className="text-purple-200/80 mt-2">Browse jobs, workshops, and connect with the community.</p>
        </div>
    )
}
