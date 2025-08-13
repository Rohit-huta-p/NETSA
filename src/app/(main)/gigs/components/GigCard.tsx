
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Gig } from "@/lib/types";
import { format } from "date-fns";

// A simple mapping for tag colors based on gig type.
const tagColorMap: { [key: string]: string } = {
  performance: "bg-purple-200 text-purple-800",
  photoshoot: "bg-pink-200 text-pink-800",
  recording: "bg-blue-200 text-blue-800",
  event: "bg-green-200 text-green-800",
  audition: "bg-yellow-200 text-yellow-800",
  modeling: "bg-indigo-200 text-indigo-800",
  teaching: "bg-teal-200 text-teal-800",
  collaboration: "bg-gray-200 text-gray-800",
};


interface GigCardProps {
    gig: Gig;
    onClick?: () => void;
    isActive?: boolean;
}

export function GigCard({ gig, onClick, isActive }: GigCardProps) {
    
    return (
        <div 
            onClick={onClick}
            className={cn(
                "group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border-2",
                isActive ? "border-primary shadow-lg" : "border-border/50 group-hover:border-primary/50",
                "text-left w-full cursor-pointer"
            )}
        >
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/80 transition-all duration-300"></div>
                <Image 
                    src={"https://placehold.co/600x400.png"} 
                    alt={gig.title} 
                    width={600}
                    height={400}
                    data-ai-hint={"gig opportunity"}
                    className="w-full h-56 object-cover" 
                />
                <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${tagColorMap[gig.type] || 'bg-gray-200 text-gray-800'}`}>{gig.type}</span>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white rounded-full">
                    <Heart className="w-5 h-5"/>
                </Button>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{gig.title}</h3>
                </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
            <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">{gig.description}</p>
            <div className="space-y-3 text-sm text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{gig.startDate ? format(new Date(gig.startDate), "MMM dd, yyyy") : 'Date TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{gig.location ? `${gig.location.city}, ${gig.location.country}` : 'Location TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{gig.applications || 0} Applicants</span>
                </div>
            </div>
            </div>
            <div className="p-5 border-t mt-auto flex justify-between items-center bg-muted/30">
            <div>
                {gig.compensation?.amount !== null && gig.compensation?.amount! > 0 ? (
                <p className="text-xl font-bold text-foreground">${gig.compensation.amount}</p>
                ) : (
                    <p className="text-xl font-bold text-green-500">Paid</p>
                )}
            </div>
            <div className="font-bold text-primary group-hover:underline flex items-center">
                View Details
            </div>
            </div>
        </div>
    );
  }
