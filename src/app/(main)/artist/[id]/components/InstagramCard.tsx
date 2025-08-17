
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { UserProfile } from "@/store/userStore";
import { Link2 } from "lucide-react";

interface InstagramCardProps {
    artist: UserProfile;
}

export function InstagramCard({ artist }: InstagramCardProps) {
    const instagramHandle = artist.role === 'artist' ? artist.socialMedia?.instagram : null;

    if (!instagramHandle) {
        return null;
    }

    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
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
                           <Link2 className="w-4 h-4" />
                            <span>Find me on Instagram: instagram.com/{instagramHandle}</span>
                        </Link>
                    </div>
                </div>
                <p className="text-2xl font-bold text-muted-foreground">...</p>
            </CardContent>
        </Card>
    );
}
