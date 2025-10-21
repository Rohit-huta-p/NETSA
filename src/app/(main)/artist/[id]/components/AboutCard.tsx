
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/store/userStore";
import Link from "next/link";
import { Instagram, Edit, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/server/actions";
import { EditableField } from "./EditableField";
import { DANCE_SKILLS } from "@/lib/skills-data";
import { MultiSelectEditable } from "@/components/shared/MultiSelectEditable";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

interface AboutCardProps {
    artist: UserProfile;
}

const getAge = (dob: Date | undefined | string) => {
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

export function AboutCard({ artist: initialArtist }: AboutCardProps) {
    const { user, setUser } = useUserStore();
    const { toast } = useToast();
    
    const [artist, setArtist] = useState(initialArtist);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editData, setEditData] = useState({
        bio: initialArtist.bio || "",
        dob: initialArtist.dob ? new Date(initialArtist.dob).toISOString().split('T')[0] : "",
        height: initialArtist.height || 0,
        skinTone: initialArtist.skinTone || "",
        skills: initialArtist.skills || [],
        instagram: initialArtist.socialMedia?.instagram || ""
    });

    const isOwnProfile = user?.id === artist.id;

    useEffect(() => {
        setArtist(initialArtist);
        setEditData({
            bio: initialArtist.bio || "",
            dob: initialArtist.dob ? new Date(initialArtist.dob).toISOString().split('T')[0] : "",
            height: initialArtist.height || 0,
            skinTone: initialArtist.skinTone || "",
            skills: initialArtist.skills || [],
            instagram: initialArtist.socialMedia?.instagram || ""
        });
    }, [initialArtist]);

    const handleModalSave = async () => {
        if (!user) return;
        setIsSubmitting(true);

        const updateData: Partial<UserProfile> & { socialMedia?: { instagram?: string } } = {
            bio: editData.bio,
            dob: editData.dob ? new Date(editData.dob) : undefined,
            height: Number(editData.height),
            skinTone: editData.skinTone,
            skills: editData.skills,
            socialMedia: { instagram: editData.instagram }
        };

        const result = await updateUserProfile(user.id, updateData);

        if (result.success) {
            const updatedUser = { ...user, ...updateData };
            setUser(updatedUser);
            setArtist(prev => ({...prev, ...updatedUser}));
            toast({ title: "Success", description: "About section updated!" });
            setIsEditModalOpen(false);
        } else {
             toast({ variant: 'destructive', title: "Error", description: result.error });
        }
        setIsSubmitting(false);
    };

    const handleInputChange = (field: keyof typeof editData, value: any) => {
      setEditData(prev => ({...prev, [field]: value}))
    }

    const age = getAge(artist.dob);
    const height = artist.height;
    const skinTone = artist.skinTone;
    const instagramHandle = artist.socialMedia?.instagram;
    const skills = artist.skills || [];
    
    return (
        <Card className="relative">
             {isOwnProfile && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-4 right-4"
                >
                    <Edit className="w-4 h-4 mr-2"/>
                    Edit
                </Button>
            )}
            <CardHeader>
                 <h3 className="font-bold text-lg">About</h3>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{artist.bio || "No bio available."}</p>
                
                {artist.role === 'artist' && (
                    <>
                        <div className="grid grid-cols-3 gap-4 text-sm mt-6">
                            <div>
                                <p className="text-muted-foreground">Age</p>
                                <p className="font-semibold">{age || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Height</p>
                                <p className="font-semibold">{height ? `${Math.floor(height/30.48)}'${Math.round((height/2.54)%12)}"` : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Skin tone</p>
                                 <p className="font-semibold">{skinTone || 'N/A'}</p>
                            </div>
                        </div>
                        <Separator className="my-6" />

                        <MultiSelectEditable
                          isOwnProfile={false} // Display only
                          label="Skills & Styles"
                          placeholder=""
                          options={DANCE_SKILLS}
                          value={skills}
                          onChange={() => {}}
                      />
                    </>
                )}

                <Separator className="my-6" />

                <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Instagram className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <p className="font-semibold">Instagram</p>
                            {instagramHandle ? (
                                <Link href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{instagramHandle}</Link>
                            ) : (
                                <p className="text-sm text-muted-foreground">No Instagram linked.</p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

             <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                    <DialogTitle>Edit About Section</DialogTitle>
                    <DialogDescription>Update your personal and professional details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" value={editData.bio} onChange={e => handleInputChange('bio', e.target.value)} rows={4} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" value={editData.dob} onChange={e => handleInputChange('dob', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input id="height" type="number" value={editData.height} onChange={e => handleInputChange('height', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="skinTone">Skin Tone</Label>
                                <Input id="skinTone" value={editData.skinTone} onChange={e => handleInputChange('skinTone', e.target.value)} />
                            </div>
                        </div>
                         <div className="space-y-2">
                             <MultiSelectEditable
                                isOwnProfile={true}
                                label="Skills & Styles"
                                placeholder="Add a skill..."
                                options={DANCE_SKILLS}
                                value={editData.skills}
                                onChange={(newSkills) => handleInputChange('skills', newSkills)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram Handle</Label>
                            <Input id="instagram" value={editData.instagram} onChange={e => handleInputChange('instagram', e.target.value)} />
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
        </Card>
    );
}

    