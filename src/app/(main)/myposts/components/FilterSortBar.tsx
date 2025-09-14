
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import Link from "next/link";

interface FilterSortBarProps {
    onSortChange: (value: string) => void;
    onTypeChange: (value: string) => void;
}

export function FilterSortBar({ onSortChange, onTypeChange }: FilterSortBarProps) {
    return (
        <div className="bg-card p-4 rounded-xl shadow-sm border flex flex-col md:flex-row items-center gap-4">
            <div className="grid grid-cols-2 md:flex md:flex-row gap-4 w-full md:w-auto">
                <div>
                    <label className="text-xs font-medium text-muted-foreground">Sort by</label>
                    <Select defaultValue="newest" onValueChange={onSortChange}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 text-base border-0 bg-muted/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Latest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                     <label className="text-xs font-medium text-muted-foreground">Post Type</label>
                    <Select defaultValue="all" onValueChange={onTypeChange}>
                        <SelectTrigger className="w-full md:w-[180px] h-11 text-base border-0 bg-muted/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="gig">Gigs</SelectItem>
                            <SelectItem value="event">Events</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="md:ml-auto w-full md:w-auto">
                 <Button asChild size="lg" className="h-11 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity w-full">
                    <Link href="/create">
                        <Plus className="w-5 h-5 mr-2" />
                        New Post
                    </Link>
                </Button>
            </div>
        </div>
    );
}
