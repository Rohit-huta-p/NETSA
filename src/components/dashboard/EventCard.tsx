
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EventCardProps {
    id?: string;
    tag: string;
    tagColor: string;
    title: string;
    description: string;
    date: string;
    location: string;
    attendees: number;
    price: number | null;
    image: string;
    imageHint: string;
    onClick?: () => void;
    isActive?: boolean;
  }

export function EventCard({ id, tag, tagColor, title, description, date, location, attendees, price, image, imageHint, onClick, isActive }: EventCardProps) {
    const CardWrapper = onClick ? 'button' : 'div';
    
    return (
      <CardWrapper 
        onClick={onClick}
        className={cn(
            "bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border-2",
            isActive ? "border-primary shadow-lg" : "border-border/50 hover:border-primary/50",
            onClick && "text-left w-full"
        )}
      >
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/80 transition-all duration-300"></div>
            <Image 
                src={image} 
                alt={title} 
                width={600}
                height={400}
                data-ai-hint={imageHint}
                className="w-full h-56 object-cover" 
            />
            <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${tagColor}`}>{tag}</span>
             <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white rounded-full">
                <Heart className="w-5 h-5"/>
            </Button>
             <div className="absolute bottom-0 left-0 p-4">
                 <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
             </div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
          <div className="space-y-3 text-sm text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{attendees || 0} Attending</span>
            </div>
          </div>
        </div>
        <div className="p-5 border-t mt-auto flex justify-between items-center bg-muted/30">
          <div>
            {price !== null && price > 0 ? (
              <p className="text-xl font-bold text-foreground">${price}</p>
            ) : (
                <p className="text-xl font-bold text-green-500">Free</p>
            )}
          </div>
          <Button asChild className="font-bold bg-gradient-to-r from-purple-500 to-orange-500 text-white">
            <Link href={`/gigs/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardWrapper>
    );
  }
