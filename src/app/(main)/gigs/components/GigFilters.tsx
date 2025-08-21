
"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GetGigsQuery } from "@/lib/types";

interface GigFiltersProps {
  filters: Partial<GetGigsQuery>;
  onFilterChange: (filterName: keyof GetGigsQuery, value: string) => void;
}

export function GigFilters({ filters, onFilterChange }: GigFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          type="search"
          placeholder="Search by title, description..."
          className="w-full md:flex-grow"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        <Select
          value={filters.category || ''}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          <SelectTrigger className="w-full md:w-auto">
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
      </div>
    </div>
  );
}
