
"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import type { GetGigsQuery } from "@/lib/types";

interface FilterBarProps {
  onFilterChange: (filterName: keyof GetGigsQuery, value: string) => void;
  searchPlaceholder?: string;
}

export function FilterBar({ onFilterChange, searchPlaceholder = "Search..." }: FilterBarProps) {
  return (
    <div className="bg-card p-4 rounded-xl shadow-md border flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder={searchPlaceholder}
            className="w-full pl-10 h-12 text-base"
            onChange={(e) => onFilterChange('search', e.target.value)}
            />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <Select onValueChange={(value) => onFilterChange('category', value)}>
                <SelectTrigger className="w-full md:w-[180px] h-12 text-base">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Music Video">Music Video</SelectItem>
                    <SelectItem value="Live Performance">Live Performance</SelectItem>
                    <SelectItem value="Photoshoot">Photoshoot</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => onFilterChange('location', value)}>
                <SelectTrigger className="w-full md:w-[180px] h-12 text-base">
                    <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button className="h-12 px-8 text-base font-bold bg-primary hover:bg-primary/90 w-full md:w-auto">
            Find
        </Button>
    </div>
  );
}
