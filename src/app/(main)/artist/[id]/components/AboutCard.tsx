
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Instagram, Edit, Check, X as CloseIcon } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/lib/server/actions";
import { EditableField } from "./EditableField";
import { DANCE_SKILLS } from "@/lib/skills-data";
import { MultiSelectEditable } from "@/components/shared/MultiSelectEditable";

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [loadingField, setLoadingField] = useState<string | null>(null);

    const isOwnProfile = user?.id === artist.id;
    const canEdit = isOwnProfile && isEditMode;

    const handleFieldSave = async (field: keyof UserProfile | string, value: any) => {
        if (!user || !isOwnProfile) return;
        setLoadingField(field);

        const updateData: { [key: string]: any } = {};
        
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            const currentParent = (user as any)[parent] || {};
            updateData[parent] = { ...currentParent, [child]: value };
        } else {
            updateData[field] = value;
        }

        const result = await updateUserProfile(user.id, updateData);

        if (result.success) {
            const updatedUser = { ...user, ...updateData };
             if (field.includes('.')) {
                const [parent, child] = field.split('.');
                updatedUser[parent] = { ...((user as any)[parent] || {}), [child]: value };
            }
            setUser(updatedUser);
            setArtist(prev => ({...prev, ...updatedUser}));
            toast({ title: "Success", description: `${String(field)} updated!` });
        } else {
             toast({ variant: 'destructive', title: "Error", description: result.error });
        }
        setLoadingField(null);
    };

    const handleSaveEdits = () => {
        setIsEditMode(false);
        // Field-by-field saves already happened, so we just give a summary toast.
        toast({ title: "Profile Updated", description: "Your changes have been saved." });
    };

    const handleCancelEdits = () => {
        setArtist(initialArtist); // Revert any non-saved changes if needed.
        setIsEditMode(false);
    };

    const age = getAge(artist.dob);
    const height = artist.height;
    const skinTone = artist.skinTone;
    const instagramHandle = artist.socialMedia?.instagram;
    const skills = artist.skills || [];
    
    return (
        <Card className="relative">
            {isOwnProfile && (
                 <div className="absolute top-4 right-4 flex items-center gap-2">
                    {isEditMode ? (
                        <>
                            <Button variant="ghost" size="icon" onClick={handleCancelEdits}><CloseIcon className="w-5 h-5 text-destructive" /></Button>
                            <Button variant="ghost" size="icon" onClick={handleSaveEdits}><Check className="w-5 h-5 text-green-500" /></Button>
                        </>
                    ) : (
                        <Button variant="outline" size="icon" onClick={() => setIsEditMode(true)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                    )}
                 </div>
            )}
            <CardContent className="p-6">
                <h3 className="font-bold text-lg">About</h3>
                <EditableField
                    as="textarea"
                    canEdit={canEdit}
                    value={artist.bio || ""}
                    onSave={(value) => handleFieldSave('bio', value)}
                    className="text-sm text-muted-foreground mt-2 bg-muted/50"
                    placeholder="No bio available."
                    isLoading={loadingField === 'bio'}
                />
                
                {artist.role === 'artist' && (
                    <>
                        <div className="grid grid-cols-3 gap-4 text-sm mt-6">
                            <div>
                                <p className="text-muted-foreground">Age</p>
                                 <EditableField
                                    canEdit={canEdit}
                                    value={age?.toString() || 'N/A'}
                                    onSave={(value) => {
                                        const newDob = new Date();
                                        newDob.setFullYear(newDob.getFullYear() - parseInt(value));
                                        handleFieldSave('dob', newDob.toISOString());
                                    }}
                                    className="font-semibold bg-muted/50"
                                    placeholder="N/A"
                                    isLoading={loadingField === 'dob'}
                                />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Height</p>
                                <EditableField
                                    canEdit={canEdit}
                                    value={height ? `${Math.floor(height/30.48)}'${Math.round((height/2.54)%12)}"` : 'N/A'}
                                    onSave={(value) => {
                                        const parts = value.replace('"', '').split("'");
                                        const feet = parseInt(parts[0] || '0');
                                        const inches = parseInt(parts[1] || '0');
                                        const cm = (feet * 30.48) + (inches * 2.54);
                                        handleFieldSave('height', cm);
                                    }}
                                    className="font-semibold bg-muted/50"
                                    placeholder="N/A"
                                    isLoading={loadingField === 'height'}
                                />
                            </div>
                            <div>
                                <p className="text-muted-foreground">Skin tone</p>
                                 <EditableField
                                    canEdit={canEdit}
                                    value={skinTone || 'N/A'}
                                    onSave={(value) => handleFieldSave('skinTone', value)}
                                    className="font-semibold bg-muted/50"
                                    placeholder="N/A"
                                    isLoading={loadingField === 'skinTone'}
                                />
                            </div>
                        </div>
                        <Separator className="my-6" />

                        <MultiSelectEditable
                          isOwnProfile={isOwnProfile}
                          label="Skills & Styles"
                          placeholder="Add a skill..."
                          options={DANCE_SKILLS}
                          value={skills}
                          onChange={(newSkills) => handleFieldSave('skills', newSkills)}
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
                             <EditableField
                                canEdit={canEdit}
                                value={instagramHandle || "No Instagram linked."}
                                onSave={(value) => handleFieldSave('socialMedia.instagram', value)}
                                className="text-sm text-primary bg-muted/50"
                                placeholder="instagram.com/handle"
                                isLink={true}
                                linkPrefix="https://instagram.com/"
                                isLoading={loadingField === 'socialMedia.instagram'}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

    