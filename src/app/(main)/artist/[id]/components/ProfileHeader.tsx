
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Star, Edit, Camera, MapPin, Phone } from "lucide-react";
import type { UserProfile } from "@/store/userStore";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { updateUserProfile } from "@/lib/server/actions";
import { useToast } from "@/hooks/use-toast";
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
  
  if (artist.role === 'artist') {
    const skills = artist.skills || [];
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm relative border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
                  <Avatar className="w-full h-full border-4 border-card">
                      <AvatarImage src={artist.profileImageUrl || "https://placehold.co/200x200.png"} data-ai-hint="woman portrait" />
                      <AvatarFallback>{artist.firstName?.[0]}{artist.lastName?.[0]}</AvatarFallback>
                  </Avatar>
              </div>
               {user?.id === artist.id && (
                <button 
                  onClick={() => setShowUploader(true)} 
                  className="absolute bottom-1 right-1 bg-muted p-2 rounded-full hover:bg-muted-foreground/20 border border-border"
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
          </div>
          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <h1 className="text-3xl font-bold">{artist.firstName} {artist.lastName}</h1>
              <Badge className="bg-purple-600 text-white hover:bg-purple-700">{artist.artistType || 'Artist'}</Badge>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{artist.email}</span>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Skills & Styles</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {skills.length > 0 ? skills.slice(0, 5).map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-700">{skill}</Badge>
                )) : <p className="text-sm text-muted-foreground">No skills specified.</p>}
              </div>
            </div>
          </div>
           <div className="absolute top-4 right-4">
              {user?.id === artist.id ? (
                   <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                      <Link href="/settings/profile">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                      </Link>
                  </Button>
              ) : (
                  <Button>Connect</Button>
              )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
              <p className="text-2xl font-bold">{artist.stats?.eventsAttended ?? "0"}</p>
              <p className="text-sm text-muted-foreground">Events Attended</p>
          </div>
          <div>
              <p className="text-2xl font-bold">{artist.stats?.connectionsCount ?? "0"}</p>
              <p className="text-sm text-muted-foreground">Connections</p>
          </div>
          <div className="col-span-2 md:col-span-1">
               <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <p className="text-2xl font-bold">{artist.stats?.averageRating?.toFixed(1) ?? 'N/A'}</p>
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
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
      </div>
    );
  }

  if (artist.role === 'organizer') {
    const specialization = artist.specialization || [];
    return (
       <div className="bg-card p-6 rounded-lg shadow-sm relative border">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
                  <Avatar className="w-full h-full border-4 border-card">
                      <AvatarImage src={artist.profileImageUrl || "https://placehold.co/200x200.png"} data-ai-hint="person portrait" />
                      <AvatarFallback>{artist.firstName?.[0]}{artist.lastName?.[0]}</AvatarFallback>
                  </Avatar>
              </div>
               {user?.id === artist.id && (
                <button 
                  onClick={() => setShowUploader(true)} 
                  className="absolute bottom-1 right-1 bg-muted p-2 rounded-full hover:bg-muted-foreground/20 border border-border"
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-start gap-4">
              <h1 className="text-3xl font-bold">{artist.firstName} {artist.lastName}</h1>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 capitalize">{artist.role}</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"> <MapPin className="w-4 h-4" /> <span>{artist.city}, {artist.country}</span></div>
                <div className="flex items-center gap-2"> <Mail className="w-4 h-4" /> <span>{artist.email}</span></div>
                <div className="flex items-center gap-2"> <Phone className="w-4 h-4" /> <span>{artist.phoneNumber || 'Not provided'}</span></div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Types of Events Organized</h3>
              <div className="flex flex-wrap gap-2">
                {specialization.length > 0 ? specialization.map(spec => (
                    <Badge key={spec} variant="secondary" className="bg-purple-100 text-purple-700">{spec}</Badge>
                )) : <p className="text-sm text-muted-foreground">No specializations listed.</p>}
              </div>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold text-sm mb-1">Organization/Company Name</h3>
                <p className="text-muted-foreground text-sm">{artist.organizationName || 'N/A'}</p>
            </div>

          </div>
           <div className="absolute top-4 right-4">
              {user?.id === artist.id ? (
                   <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                      <Link href="/settings/profile">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                      </Link>
                  </Button>
              ) : (
                  <Button>Connect</Button>
              )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
              <p className="text-2xl font-bold">{artist.stats?.eventsHosted ?? "0"}</p>
              <p className="text-sm text-muted-foreground">Events Hosted</p>
          </div>
          <div>
              <p className="text-2xl font-bold">{artist.stats?.connectionsCount ?? "0"}</p>
              <p className="text-sm text-muted-foreground">Connections</p>
          </div>
          <div className="col-span-2 md:col-span-1">
               <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <p className="text-2xl font-bold">{artist.stats?.averageRating?.toFixed(1) ?? 'N/A'}</p>
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
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
      </div>
    )
  }

  return null;
}
