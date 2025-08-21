
"use client";

import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";

export function DiscoverSection() {
    const { user } = useUser();
    const pathname = usePathname();

    const isGigsPage = pathname.includes('/gigs');
    const title = isGigsPage ? "Find Your Next Gig" : "Discover Events & Workshops";
    const tagline = isGigsPage 
        ? "Browse thousands of opportunities from top organizers and brands."
        : "Find your next dance adventure in the city.";

    return (
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {title.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{title.split(' ').slice(-1)}</span>
            </h1>
            <p className="mt-3 text-lg max-w-2xl mx-auto text-muted-foreground">
                {tagline}
            </p>
        </div>
    )
}
