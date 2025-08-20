import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/store/userStore";

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
            </CardContent>
        </Card>
    )
}
