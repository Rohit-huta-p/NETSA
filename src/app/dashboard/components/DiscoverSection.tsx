
"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function DiscoverSection() {
    return (
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-foreground leading-tight">
          Discover <span className="text-pink-500">Events</span> &<br/> <span className="text-purple-500">Workshops</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">Find your next dance adventure in the city</p>
        <div className="mt-8 max-w-5xl mx-auto bg-card p-4 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-6 items-center gap-4 border">
          <div className="relative md:col-span-3">
             <Input type="search" placeholder="Search events, styles, instructors..." className="w-full pl-10 pr-4 py-3 border focus:ring-0 text-base bg-transparent border-input rounded-full"/>
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          <Select>
              <SelectTrigger className="w-full border font-medium text-muted-foreground bg-card hover:bg-muted rounded-full py-3 px-4 shadow-none border-input">
                  <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="intensive">Intensive</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
          </Select>
          <Select>
              <SelectTrigger className="w-full border font-medium text-muted-foreground bg-card hover:bg-muted rounded-full py-3 px-4 shadow-none border-input">
                  <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="nyc">New York, NY</SelectItem>
                  <SelectItem value="brooklyn">Brooklyn, NY</SelectItem>
                  <SelectItem value="manhattan">Manhattan, NY</SelectItem>
              </SelectContent>
          </Select>
           <Select>
              <SelectTrigger className="w-full border font-medium text-muted-foreground bg-card hover:bg-muted rounded-full py-3 px-4 shadow-none border-input">
                  <SelectValue placeholder="Any Date" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-weekend">This Weekend</SelectItem>
              </SelectContent>
          </Select>
        </div>
      </div>
    );
}
