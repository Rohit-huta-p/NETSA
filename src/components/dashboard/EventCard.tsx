
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";

interface EventCardProps {
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
  }

export function EventCard({ tag, tagColor, title, description, date, location, attendees, price, image, imageHint }: EventCardProps) {
    return (
      <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="relative">
            <Image 
                src={image} 
                alt={title} 
                width={600}
                height={400}
                data-ai-hint={imageHint}
                className="w-full h-48 object-cover" 
            />
            <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full ${tagColor}`}>{tag}</span>
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{attendees} Attendees</span>
            </div>
          </div>
        </div>
        <div className="p-6 border-t mt-auto flex justify-between items-center">
          <div>
            {price !== null ? (
              <p className="text-lg font-bold text-foreground">${price}</p>
            ) : (
                <p className="text-lg font-bold text-green-500">Free</p>
            )}
          </div>
          <Button variant="outline" className="font-bold">View Details</Button>
        </div>
      </div>
    );
  }
  