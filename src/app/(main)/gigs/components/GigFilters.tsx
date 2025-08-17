
"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GetGigsQuery } from "@/lib/types";
import { Search } from "lucide-react";

interface GigFiltersProps {
  filters: Partial<GetGigsQuery>;
  onFilterChange: (filterName: keyof GetGigsQuery, value: string) => void;
}

export function GigFilters({ filters, onFilterChange }: GigFiltersProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          Discover
        </h1>
        <h2 className="text-4xl font-bold font-headline tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Gigs & Opportunities
        </h2>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find your next creative role in the community.
        </p>
      </div>

      <div className="bg-card p-4 rounded-xl shadow-md border max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, description..."
              className="w-full pl-10 h-12 text-base"
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select
              value={filters.category || ''}
              onValueChange={(value) => onFilterChange('category', value)}
            >
              <SelectTrigger className="h-12 w-full md:w-48 text-base">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Music Video">Music Video</SelectItem>
                <SelectItem value="Live Performance">Live Performance</SelectItem>
                <SelectItem value="Photoshoot">Photoshoot</SelectItem>
                <SelectItem value="Theater">Theater</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Audition">Audition</SelectItem>
                <SelectItem value="Teaching">Teaching</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 w-full md:w-48 text-base">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="New York">New York, USA</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles, USA</SelectItem>
                <SelectItem value="London">London, UK</SelectItem>
              </SelectContent>
            </Select>

             <Select>
              <SelectTrigger className="h-12 w-full md:w-48 text-base">
                <SelectValue placeholder="Any Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
