
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Star, Instagram, Edit } from "lucide-react";
import type { UserProfile } from "@/store/userStore";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { updateUserProfile } from "@/lib/server/actions";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProfileHeaderProps {
  artist: UserProfile;
}

const getAge = (dob: Date | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export function ProfileHeader({ artist }: ProfileHeaderProps) {
  const { user, setUser } = useUserStore();
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  const handleProfileImageUpload = async (url: string) => {
    if (user) {
      const updatedProfile = { ...user, profileImageUrl: url };
      
      const result = await updateUserProfile(user.id, { profileImageUrl: url });
      if (result.success) {
        setUser(updatedProfile);
        toast({ title: "Success", description: "Profile picture updated!" });
        setShowUploader(false);
      } else {
        toast({ variant: 'destructive', title: "Error", description: result.error });
      }
    }
  };

  const stats = [
    { value: artist.stats?.eventsAttended ?? "0", label: "Events Attended" },
    { value: artist.stats?.eventsHosted ?? "0", label: "Events Hosted" },
    { value: artist.stats?.connectionsCount ?? "0", label: "Connections" },
  ]

  const skills = artist.role === 'artist' ? artist.skills || [] : [];
  const age = artist.role === 'artist' ? getAge(artist.dob) : null;
  const height = artist.role === 'artist' ? artist.height : null;
  const skinTone = artist.role === 'artist' ? artist.skinTone : null;
  const instagramHandle = artist.role === 'artist' ? artist.socialMedia?.instagram : null;


  return (
    <div className="bg-card p-8 rounded-2xl shadow-lg relative border">
        <div className="absolute top-6 right-6 flex items-center gap-2">
            {user?.id === artist.id && (
                 <Button asChild variant="outline">
                    <Link href="/settings/profile">
                      <span>
                        <Edit className="w-4 h-4 mr-2 inline-block" />
                        Edit Profile
                      </span>
                    </Link>
                </Button>
            )}
            <Button className="bg-gradient-to-r from-purple-500 to-orange-400 text-white font-bold">
                Get Hired
            </Button>
        </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-28 h-28 flex-shrink-0">
            <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full -m-1"
                onClick={() => user?.id === artist.id && setShowUploader(true)}
            ></div>
            <Avatar className="w-full h-full border-4 border-card">
                <AvatarImage src={artist.profileImageUrl || "https://placehold.co/200x200.png"} data-ai-hint="woman portrait" />
                <AvatarFallback>{artist.firstName?.[0]}{artist.lastName?.[0]}</AvatarFallback>
            </Avatar>
             {user?.id === artist.id && (
              <button 
                onClick={() => setShowUploader(true)} 
                className="absolute bottom-0 -right-1 bg-muted p-2 rounded-full hover:bg-muted-foreground/20 transition-colors"
              >
                <Edit className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
        </div>
        <div className="flex-grow mt-4 md:mt-0">
            <h1 className="text-4xl font-bold">{artist.firstName} {artist.lastName}</h1>
            <div className="flex items-center gap-6 mt-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{artist.city || 'Not specified'}, {artist.country || ''}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{artist.email}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{artist.phoneNumber || 'Not specified'}</span>
                </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {age && <div><p className="font-semibold text-foreground">Age</p><p>{age}</p></div>}
                {height && <div><p className="font-semibold text-foreground">Height</p><p>{height} cm</p></div>}
                {skinTone && <div><p className="font-semibold text-foreground">Skin Tone</p><p>{skinTone}</p></div>}
                {instagramHandle && (
                    <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        <Link href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {instagramHandle}
                        </Link>
                    </div>
                )}
            </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Skills & Styles</h3>
            <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer font-medium">{skill}</Badge>
                )) : <p className="text-sm text-muted-foreground">No skills specified.</p>}
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showUploader} onOpenChange={setShowUploader}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                   <DialogDescription>Upload a new image to use as your profile avatar.</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ImageUpload
                    onUpload={handleProfileImageUpload}
                    storagePath={`profile-images/${user?.id}`}
                    currentImageUrl={user?.profileImageUrl}
                    label=""
                />
                </div>
          </DialogContent>
      </Dialog>


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
                    <p className="text-3xl font-bold text-primary">{artist.stats?.averageRating ?? '0'}</p>
                     <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Rating</p>
            </div>
        </div>
      </div>
    </div>
  );
}
