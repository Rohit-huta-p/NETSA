
"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Star,
  Camera,
  Loader2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/store/userStore";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useUserStore } from "@/store/userStore";
import { updateUserProfile } from "@/lib/server/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MultiSelectEditable } from "@/components/shared/MultiSelectEditable";
import { DANCE_SKILLS, DANCE_STYLES } from "@/lib/skills-data";
import { EditableField } from "./EditableField";

interface ProfileHeaderProps {
  artist: UserProfile;
}

export function ProfileHeader({ artist: initialArtist }: ProfileHeaderProps) {
  const { user, setUser } = useUserStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [artist, setArtist] = useState(initialArtist);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for the edit modal
  const [editData, setEditData] = useState({
      firstName: initialArtist.firstName || '',
      lastName: initialArtist.lastName || '',
      artistType: initialArtist.artistType || '',
      email: initialArtist.email || '',
      skills: initialArtist.skills || [],
      styles: initialArtist.styles || [],
      profileImageUrl: initialArtist.profileImageUrl || ''
  });

  const isOwnProfile = user?.id === initialArtist.id;

  useEffect(() => {
    setArtist(initialArtist);
    setEditData({
      firstName: initialArtist.firstName || '',
      lastName: initialArtist.lastName || '',
      artistType: initialArtist.artistType || '',
      email: initialArtist.email || '',
      skills: initialArtist.skills || [],
      styles: initialArtist.styles || [],
      profileImageUrl: initialArtist.profileImageUrl || ''
    });
  }, [initialArtist]);

  const handleProfileImageUpload = async (url: string) => {
      setEditData(prev => ({ ...prev, profileImageUrl: url }));
  };

  const handleModalSave = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const result = await updateUserProfile(user.id, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        artistType: editData.artistType,
        email: editData.email,
        skills: editData.skills,
        styles: editData.styles,
        profileImageUrl: editData.profileImageUrl
    });

    if (result.success) {
      const updatedUser = { 
          ...user, 
          ...editData 
      };
      setUser(updatedUser);
      setArtist(prev => ({ ...prev, ...updatedUser }));
      toast({ title: "Success", description: `Profile updated successfully!` });
      setIsEditModalOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setIsSubmitting(false);
  };
  
  const handleInputChange = (field: keyof typeof editData, value: any) => {
      setEditData(prev => ({...prev, [field]: value}))
  }

  if (artist.role === "artist") {
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm relative border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
              <Avatar className="w-full h-full border-4 border-card">
                <AvatarImage
                  src={artist.profileImageUrl || "https://placehold.co/200x200.png"}
                  data-ai-hint="woman portrait"
                />
                <AvatarFallback>
                  {artist.firstName?.[0]}
                  {artist.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-bold">{`${artist.firstName ?? ""} ${artist.lastName ?? ""}`.trim()}</h1>
              <EditableField value={artist.artistType || "Artist"} as="badge" />
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <EditableField value={artist.email} />
            </div>

            <div className="mt-4">
              <MultiSelectEditable
                isOwnProfile={false} // Display only
                label="Skills"
                placeholder=""
                options={DANCE_SKILLS}
                value={artist.skills || []}
                onChange={() => {}}
              />
            </div>

            <div className="mt-4">
              <MultiSelectEditable
                isOwnProfile={false} // Display only
                label="Styles"
                placeholder=""
                options={DANCE_STYLES}
                value={artist.styles || []}
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isOwnProfile ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2"/>
                Edit Profile
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
              <p className="text-2xl font-bold">
                {artist.stats?.averageRating != null ? artist.stats.averageRating.toFixed(1) : "N/A"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Edit Profile Header</DialogTitle>
              <DialogDescription>Make changes to your main profile information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                 <ImageUpload
                    onUpload={handleProfileImageUpload}
                    storagePath={`profile-images/${user?.id}`}
                    currentImageUrl={editData.profileImageUrl}
                    label="Profile Picture"
                 />
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={editData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={editData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="artistType">Artist Type</Label>
                <Input id="artistType" value={editData.artistType} onChange={e => handleInputChange('artistType', e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={editData.email} onChange={e => handleInputChange('email', e.target.value)} />
              </div>
               <div className="space-y-2">
                    <MultiSelectEditable
                        isOwnProfile={true}
                        label="Skills"
                        placeholder="Add a skill..."
                        options={DANCE_SKILLS}
                        value={editData.skills}
                        onChange={(newSkills) => handleInputChange('skills', newSkills)}
                    />
              </div>
               <div className="space-y-2">
                   <MultiSelectEditable
                        isOwnProfile={true}
                        label="Styles"
                        placeholder="Add a style..."
                        options={DANCE_STYLES}
                        value={editData.styles}
                        onChange={(newStyles) => handleInputChange('styles', newStyles)}
                    />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleModalSave} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ... (organizer role remains unchanged)
   if (artist.role === "organizer") {
    const specialization = (artist as any).specialization || [];
    return (
      <div className="bg-card p-6 rounded-lg shadow-sm relative border">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
              <Avatar className="w-full h-full border-4 border-card">
                <AvatarImage
                  src={artist.profileImageUrl || "https://placehold.co/200x200.png"}
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>
                  {artist.firstName?.[0]}
                  {artist.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-bold">
              {artist.firstName} {artist.lastName}
            </h1>
            
            <p className="text-muted-foreground mt-1 text-sm">
                {(artist as any).jobTitle || 'Organizer'} at <span className="font-semibold">{(artist as any).organizationName || "Self-employed"}</span>
            </p>

             <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{artist.email}</span>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Types of Events Organized</h3>
              <div className="flex flex-wrap gap-2">
                {specialization.length > 0 ? (
                  specialization.map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="bg-purple-100 text-purple-700">
                      {spec}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specializations listed.</p>
                )}
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isOwnProfile && <Button>Connect</Button>}
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
              <p className="text-2xl font-bold">
                {artist.stats?.averageRating != null ? artist.stats.averageRating.toFixed(1) : "N/A"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

    