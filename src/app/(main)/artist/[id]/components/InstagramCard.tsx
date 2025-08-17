
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { UserProfile } from "@/store/userStore";

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
                    <Avatar>
                        <AvatarImage src={artist.profileImageUrl || "https://placehold.co/40x40.png"} data-ai-hint="artist portrait" />
                        <AvatarFallback>{artist.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Instagram</p>
                        <Link href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Find me on Instagram: instagram.com/{instagramHandle}
                        </Link>
                    </div>
                </div>
                <p className="text-2xl font-bold">...</p>
            </CardContent>
        </Card>
    );
}
