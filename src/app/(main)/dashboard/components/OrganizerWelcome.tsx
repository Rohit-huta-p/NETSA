
"use client";

import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";

interface OrganizerWelcomeProps {
    name: string;
}

export function OrganizerWelcome({ name }: OrganizerWelcomeProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl font-bold">Hi, {name} 👋 Ready to host your next Event?</h1>
                <p className="text-muted-foreground mt-1">Manage your events, review applications, and grow your community</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
                <Button asChild className="btn-gradient-flip text-white">
                    <Link href="/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Post a Gig / Event
                    </Link>
                </Button>
                <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Events
                </Button>
            </div>
        </div>
    );
}
