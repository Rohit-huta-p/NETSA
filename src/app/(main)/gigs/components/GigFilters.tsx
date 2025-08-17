
"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function GigFilters() {
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
              placeholder="Search gigs, roles, companies..."
              className="w-full pl-10 h-12 text-base"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select>
              <SelectTrigger className="h-12 w-full md:w-48 text-base">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="photoshoot">Photoshoot</SelectItem>
                <SelectItem value="recording">Recording</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="audition">Audition</SelectItem>
                <SelectItem value="modeling">Modeling</SelectItem>
                <SelectItem value="teaching">Teaching</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 w-full md:w-48 text-base">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="nyc">New York, USA</SelectItem>
                <SelectItem value="la">Los Angeles, USA</SelectItem>
                <SelectItem value="london">London, UK</SelectItem>
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
