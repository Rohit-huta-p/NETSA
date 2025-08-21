"use client";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import React from "react";

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();

    return (
        <div className={cn(user?.role === 'organizer' && 'organizer-theme')}>
            {children}
        </div>
    );
}
