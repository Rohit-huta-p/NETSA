import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Link2 } from "lucide-react";

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
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">About {artist.firstName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{artist.bio || "No bio available."}</p>
                <Separator />
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="font-semibold text-foreground">Age</p>
                        <p className="text-sm">{age || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">Height</p>
                        <p className="text-sm">{height ? `${height} cm` : 'N/A'}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-foreground">Skin Tone</p>
                        <p className="text-sm">{skinTone || 'N/A'}</p>
                    </div>
                </div>
                 <Separator />
                <div className="p-4 flex items-center justify-between rounded-lg border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={artist.profileImageUrl || "https://placehold.co/40x40.png"} data-ai-hint="artist portrait" />
                                <AvatarFallback>{artist.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <p className="font-semibold">Instagram</p>
                            <Link href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                {
                                    !instagramHandle ? <p>No Instagram linked.</p>
                                    :(
                                        <>
                                        <Link2 className="w-4 h-4" />
                                        <span>instagram.com/{instagramHandle}</span>
                                        </>
                                    )  
                                
                                }
                            
                            </Link>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-muted-foreground">...</p>
                </div>

            </CardContent>
        </Card>
    )
}
