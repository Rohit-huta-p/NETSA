
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Gig } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface GigCardProps {
    gig: Gig;
    onClick?: () => void;
    isActive?: boolean;
}

export function GigCard({ gig, onClick, isActive }: GigCardProps) {
    const href = `/gigs/${gig.id}`;
    
    return (
        <button 
            onClick={onClick}
            className={cn(
                "bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col  border-2 text-left w-full",
                isActive ? "border-primary shadow-lg" : "border-card hover:border-border",
            )}
        >
           <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="capitalize bg-purple-100 text-purple-700">{gig.type}</Badge>
                    <div className="text-xs text-muted-foreground">
                        Posted {gig.createdAt ? format(new Date(gig.createdAt), "MMM dd") : ''}
                    </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{gig.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{gig.description}</p>
           </div>
            
            <div className="px-4 pt-3 pb-4 space-y-2.5 text-sm text-muted-foreground border-t mt-auto">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                    <span>{gig.location?.isRemote ? 'Remote' : (gig.location ? `${gig.location.city}, ${gig.location.country}` : 'Location TBD')}</span>
                </div>
                 <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-primary/70" />
                    <span>
                        {gig.compensation?.amount ? `$${gig.compensation.amount}` : 'Paid Gig'}
                        {gig.compensation?.type && <span className="text-xs capitalize"> ({gig.compensation.type})</span>}
                    </span>
                </div>
                <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="capitalize">{gig.experienceLevel}</span>
                </div>
            </div>
        </button>
    );
  }
