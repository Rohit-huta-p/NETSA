
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Heart, MapPin, Users } from "lucide-react";
import Image from "next/image";

export function EventCard({ tag, tagColor, title, description, date, location, attendees, price, image, imageHint }: {
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
}) {
    return (
        <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group bg-card">
          <CardHeader className="p-0 relative bg-[linear-gradient(to_right,_#8B5CF633,_#FB718533)]">
            <div className={`absolute top-4 left-4 text-xs font-bold py-1 px-3 rounded-full ${tagColor}`}>
              {tag}
            </div>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full">
                <Heart className="w-5 h-5 text-white" />
            </Button>
            <Image src={image} alt={title} width={600} height={400} className="w-full h-48 object-cover block" data-ai-hint={imageHint} />

            {price !== null ? (
                <div className="absolute bottom-4 right-4 bg-background text-primary font-bold py-1 px-4 rounded-full shadow-md">
                    ${price}
                </div>
            ) : (
                <div className="absolute bottom-4 right-4 bg-background text-green-600 font-bold py-1 px-4 rounded-full shadow-md">
                    Free
                </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4 h-20">{description}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{attendees} attending</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold rounded-full">
              Join Event
            </Button>
          </CardContent>
        </Card>
      );
}
