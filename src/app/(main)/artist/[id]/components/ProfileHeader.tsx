
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Star,
  Edit,
  Camera,
  MapPin,
  Phone,
  Check,
  X as CloseIcon,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";

import { MultiSelectEditable } from "@/components/shared/MultiSelectEditable";
import { DANCE_SKILLS, DANCE_STYLES } from "@/lib/skills-data";
import { EditableField } from "./EditableField";

interface ProfileHeaderProps {
  artist: UserProfile;
}

export function ProfileHeader({ artist: initialArtist }: ProfileHeaderProps) {
  const { user, setUser } = useUserStore();
  const [showUploader, setShowUploader] = useState(false);
  const [artist, setArtist] = useState(initialArtist);
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const isOwnProfile = user?.id === initialArtist.id;
  const canEdit = isOwnProfile && isEditMode;

  useEffect(() => {
    setArtist(initialArtist);
  }, [initialArtist]);

  const handleProfileImageUpload = async (url: string) => {
    if (!user) return;
    setLoadingField("profileImageUrl");
    const updatedProfile = { ...user, profileImageUrl: url };

    const result = await updateUserProfile(user.id, { profileImageUrl: url });
    if (result.success) {
      setUser(updatedProfile);
      setArtist((prev) => ({ ...prev, profileImageUrl: url }));
      toast({ title: "Success", description: "Profile picture updated!" });
      setShowUploader(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setLoadingField(null);
  };

  const handleFieldSave = async (field: keyof UserProfile | string, value: any) => {
    if (!user || !isOwnProfile) return;

    setLoadingField(field);
    const updateData: { [key: string]: any } = {};

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      const currentParent = (user as any)[parent] || {};
      updateData[parent] = { ...currentParent, [child]: value };
    } else {
      updateData[field] = value;
    }

    const result = await updateUserProfile(user.id, updateData);

    if (result.success) {
      const updatedUser = { ...user, ...updateData };
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        (updatedUser as any)[parent] = { ...((user as any)[parent] || {}), [child]: value };
      }
      setUser(updatedUser);
      setArtist((prev) => ({ ...prev, ...updatedUser }));
      toast({ title: "Success", description: `${String(field)} updated!` });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setLoadingField(null);
  };

  const handleSaveEdits = () => {
    // Field-by-field saves already happened via onBlur
    setIsEditMode(false);
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
  };

  const handleCancelEdits = () => {
    setArtist(initialArtist); // Revert to original data
    setIsEditMode(false);
  };

  if (artist.role === "artist") {
    const skills = artist.skills || [];
    const styles = artist.styles || [];
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
            {isOwnProfile && (
              <button
                onClick={() => setShowUploader(true)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                disabled={loadingField !== null}
              >
                {loadingField === "profileImageUrl" ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>
            )}
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1">
              <EditableField
                canEdit={canEdit}
                value={`${artist.firstName ?? ""} ${artist.lastName ?? ""}`.trim()}
                onSave={(value) => {
                  const [firstName, ...lastName] = value.split(" ");
                  handleFieldSave("firstName", firstName);
                  handleFieldSave("lastName", lastName.join(" "));
                }}
                className="text-3xl font-bold"
                as="heading"
                isLoading={loadingField === "firstName" || loadingField === "lastName"}
              />
              <EditableField
                canEdit={canEdit}
                value={artist.artistType || "Artist"}
                onSave={(value) => handleFieldSave("artistType", value)}
                as="badge"
                isLoading={loadingField === "artistType"}
              />
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <EditableField
                canEdit={canEdit}
                value={artist.email}
                onSave={(value) => handleFieldSave("email", value)}
                as="span"
                isLoading={loadingField === "email"}
              />
            </div>

            <div className="mt-4">
              <MultiSelectEditable
                isOwnProfile={isOwnProfile}
                label="Skills"
                placeholder="Add a skill..."
                options={DANCE_SKILLS}
                value={skills}
                onChange={(newSkills) => handleFieldSave("skills", newSkills)}
              />
            </div>

            <div className="mt-4">
              <MultiSelectEditable
                isOwnProfile={isOwnProfile}
                label="Styles"
                placeholder="Add a style..."
                options={DANCE_STYLES}
                value={styles}
                onChange={(newStyles) => handleFieldSave("styles", newStyles)}
              />
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isOwnProfile && (
              isEditMode ? (
                <>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdits}>
                    <CloseIcon className="w-5 h-5 text-destructive" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSaveEdits}>
                    <Check className="w-5 h-5 text-green-500" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="icon" onClick={() => setIsEditMode(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              )
            )}
            {!isOwnProfile && <Button>Connect</Button>}
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
            {isOwnProfile && (
              <button
                onClick={() => setShowUploader(true)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex items-center justify-start gap-4">
              <h1 className="text-3xl font-bold">
                {artist.firstName} {artist.lastName}
              </h1>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 capitalize">{artist.role}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> <span>{artist.city}, {artist.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> <span>{artist.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> <span>{artist.phoneNumber || "Not provided"}</span>
              </div>
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

            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-1">Organization/Company Name</h3>
              <p className="text-muted-foreground text-sm">{(artist as any).organizationName || "N/A"}</p>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isOwnProfile ? (
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
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
              <p className="text-2xl font-bold">
                {artist.stats?.averageRating != null ? artist.stats.averageRating.toFixed(1) : "N/A"}
              </p>
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

  return null;
}
