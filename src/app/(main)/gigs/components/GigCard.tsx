
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Gig } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";


// A simple mapping for tag colors based on gig type.
const tagColorMap: { [key: string]: string } = {
  performance: "bg-purple-100 text-purple-800",
  photoshoot: "bg-pink-100 text-pink-800",
  recording: "bg-blue-100 text-blue-800",
  event: "bg-green-100 text-green-800",
  audition: "bg-yellow-100 text-yellow-800",
  modeling: "bg-indigo-100 text-indigo-800",
  teaching: "bg-teal-100 text-teal-800",
  collaboration: "bg-gray-100 text-gray-800",
};


interface GigCardProps {
    gig: Gig;
    onClick?: () => void;
    isActive?: boolean;
}

export function GigCard({ gig, onClick, isActive }: GigCardProps) {
    const href = `/gigs/${gig.id}`;
    
    return (
        <div 
            onClick={onClick}
            className={cn(
                "group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border-2",
                isActive ? "border-primary shadow-md" : "border-border/50 hover:border-primary/50",
                "text-left w-full cursor-pointer p-5"
            )}
        >
           <div className="flex justify-between items-start mb-2">
                 <Badge className={cn("capitalize", tagColorMap[gig.type] || 'bg-gray-200 text-gray-800')}>{gig.type}</Badge>
                 <div className="text-sm text-muted-foreground">
                    {gig.createdAt ? format(new Date(gig.createdAt), "MMM dd") : ''}
                 </div>
           </div>
            <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{gig.title}</h3>
            
            <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-3 mt-auto">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{gig.location ? `${gig.location.city}, ${gig.location.country}` : 'Location TBD'}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>
                        {gig.compensation?.amount ? `$${gig.compensation.amount}` : 'Paid'}
                        {gig.compensation?.type && <span className="text-xs"> ({gig.compensation.type})</span>}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="capitalize">{gig.experienceLevel}</span>
                </div>
            </div>
        </div>
    );
  }
