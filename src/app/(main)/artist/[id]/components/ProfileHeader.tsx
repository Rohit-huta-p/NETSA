
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Edit, Camera } from "lucide-react";
import { UserProfile } from "@/store/userStore";

interface ProfileHeaderProps {
  artist: UserProfile;
}

export function ProfileHeader({ artist }: ProfileHeaderProps) {

  const stats = [
    { value: artist.stats?.eventsAttended ?? "0", label: "Events Attended" },
    { value: artist.stats?.eventsHosted ?? "0", label: "Events Hosted" },
    { value: artist.stats?.connectionsCount ?? "0", label: "Connections" },
  ]

  const skills = artist.skills || ["Contemporary", "Hip-Hop", "Ballet", "Jazz", "Choreography"];

  return (
    <div className="bg-card p-8 rounded-2xl shadow-lg relative border">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full -m-1"></div>
            <Avatar className="w-full h-full border-4 border-card">
                <AvatarImage src={artist.profileImageUrl || "https://placehold.co/200x200.png"} data-ai-hint="woman portrait" />
                <AvatarFallback>{artist.firstName?.[0]}{artist.lastName?.[0]}</AvatarFallback>
            </Avatar>
             <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
                <Camera className="w-4 h-4"/>
            </Button>
        </div>
        <div className="flex-grow mt-4 md:mt-0">
          <div className="flex items-start justify-between">
            <div>
                <h1 className="text-4xl font-bold">{artist.firstName} {artist.lastName}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{artist.city || 'New York'}, {artist.country || 'NY'}</span>
                </div>
                 <p className="mt-4 max-w-prose text-muted-foreground">
                    {artist.bio || "Professional dancer and choreographer passionate about contemporary movement and community building."}
                </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-orange-400 text-white font-bold">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Skills & Styles</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">{skill}</Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(stat => (
                <div key={stat.label}>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
            ))}
             <div>
                <div className="flex items-center justify-center gap-1">
                    <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                    <p className="text-3xl font-bold text-primary">{artist.stats?.averageRating ?? '4.8'}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Rating</p>
            </div>
        </div>
      </div>
    </div>
  );
}
