
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Gig } from "@/lib/types";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
                "bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border-2",
                isActive ? "border-primary" : "border-transparent",
                "text-left w-full cursor-pointer"
            )}
        >
           <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="capitalize">{gig.type}</Badge>
                    <div className="text-xs text-muted-foreground">
                        Posted {gig.createdAt ? format(new Date(gig.createdAt), "MMM dd") : ''}
                    </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{gig.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{gig.description}</p>
           </div>
            
            <div className="px-4 py-2 space-y-2 text-sm text-muted-foreground border-t mt-auto">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{gig.location ? `${gig.location.city}, ${gig.location.country}` : 'Location TBD'}</span>
                </div>
                 <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>
                        {gig.compensation?.amount ? `$${gig.compensation.amount}` : 'Paid Gig'}
                        {gig.compensation?.type && <span className="text-xs capitalize"> ({gig.compensation.type})</span>}
                    </span>
                </div>
                <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="capitalize">{gig.experienceLevel}</span>
                </div>
            </div>
             <div className="p-4">
                <Button asChild variant="outline" className="w-full">
                    <Link href={href}>View Details</Link>
                </Button>
            </div>
        </div>
    );
  }
