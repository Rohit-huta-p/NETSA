import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Instagram } from "lucide-react";

interface AboutCardProps {
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

export function AboutCard({ artist }: AboutCardProps) {


    const age = getAge(artist.dob);
    const height = artist.height;
    const skinTone = artist.skinTone;
    const instagramHandle = artist.socialMedia?.instagram ;
    const skills = artist.skills || [];
    
    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="font-bold text-lg">About</h3>
                <p className="text-sm text-muted-foreground mt-2">{artist.bio || "No bio available."}</p>
                {
                    artist.role === 'artist' && (
                        <>
                                <div className="grid grid-cols-3 gap-4 text-sm mt-6">
                                    <div>
                                        <p className="text-muted-foreground">Age</p>
                                        <p className="font-semibold">{age || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Height</p>
                                        <p className="font-semibold">{height ? `${Math.floor(height/30.48)}'${Math.round((height/2.54)%12)} inches` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Skin tone</p>
                                        <p className="font-semibold">{skinTone || 'N/A'}</p>
                                    </div>
                                </div>
                                <Separator className="my-6" />

                                <h3 className="font-bold text-lg">Skills & Styles</h3>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {skills.length > 0 ? skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="bg-purple-100 text-purple-700">{skill}</Badge>
                                    )) : <p className="text-sm text-muted-foreground">No skills specified.</p>}
                                </div>
                        </>
                    )
                }

                
                <Separator className="my-6" />

                <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Instagram className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <p className="font-semibold">Instagram</p>
                            <Link href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                { !instagramHandle ? <span>No Instagram linked.</span> : <span>instagram.com/{instagramHandle}</span> }
                            </Link>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-muted-foreground">...</p>
                </div>

            </CardContent>
        </Card>
    )
}
