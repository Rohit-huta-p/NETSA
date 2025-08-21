
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Heart } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
    id: string;
    tag: string;
    title: string;
    description: string;
    date: string;
    location: string;
    attendees: number;
    price: number | null;
    image: string;
    imageHint: string;
  }

export function EventCard({ id, tag, title, description, date, location, attendees, price, image, imageHint }: EventCardProps) {
    const href = `/events/${id}`;
    
    return (
        <Link href={href} className="group">
            <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border">
                <div className="relative">
                    <Image 
                        src={image} 
                        alt={title} 
                        width={600}
                        height={400}
                        data-ai-hint={imageHint}
                        className="w-full h-48 object-cover" 
                    />
                    <span className="absolute top-2 left-2 bg-primary/20 text-primary-foreground px-2 py-1 text-xs font-semibold rounded">{tag}</span>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full">
                        <Heart className="w-5 h-5"/>
                    </Button>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{location}</span>
                        </div>
                         <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{attendees || 0} Attending</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t mt-auto flex justify-between items-center">
                    <div>
                        {price !== null && price > 0 ? (
                        <p className="text-lg font-bold">${price}</p>
                        ) : (
                            <p className="text-lg font-bold text-green-500">Free</p>
                        )}
                    </div>
                    <Button>Join Event</Button>
                </div>
            </div>
        </Link>
    );
  }
