
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import type { UserProfile } from "@/store/userStore";

interface ExperienceProps {
    artist: UserProfile;
}

export function Experience({ artist }: ExperienceProps) {

    if (artist.role !== 'artist') {
        return null;
    }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="bg-muted p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Experience</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {artist.experienceYears && (
             <div className="flex items-center">
                <p className="font-semibold w-32">Years of Experience:</p>
                <p>{artist.experienceYears} years</p>
            </div>
        )}
        {artist.bio ? (
            <div>
                <h4 className="font-semibold mb-2">Professional Summary</h4>
                <p className="text-muted-foreground whitespace-pre-line">{artist.bio}</p>
            </div>
        ) : (
             <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                <p>No bio provided.</p>
                <p className="text-sm">A professional summary can be added in the profile settings.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
