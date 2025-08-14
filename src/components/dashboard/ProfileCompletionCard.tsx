
"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { UserProfile } from "@/store/userStore";
import Link from "next/link";
import { useMemo } from "react";

const getProfileCompletion = (user: UserProfile | null): number => {
    if (!user) return 0;
    if (user.role !== 'artist') return 100;

    const checklist = {
        'Profile Picture': user.profileImageUrl,
        'Phone Number': user.phoneNumber,
        'Date of Birth': user.dob,
        'City & Country': user.city && user.country,
        'Bio': user.bio,
        'Height & Skin Tone': user.height && user.skinTone,
        'Experience': (user.experienceYears ?? 0) > 0,
        'Skills': user.skills && user.skills.length > 0,
        'Styles': user.styles && user.styles.length > 0,
        'Instagram Handle': user.socialMedia?.instagram,
    };

    let completedFields = 0;
    const totalFields = Object.keys(checklist).length;
    
    Object.values(checklist).forEach(value => {
        if (Array.isArray(value) && value.length > 0) {
            completedFields++;
        } else if (typeof value === 'string' && value.trim() !== '') {
            completedFields++;
        } else if (typeof value === 'number' && value > 0) {
            completedFields++;
        } else if (value) { // For booleans or dates
            completedFields++;
        }
    });

    if (totalFields === 0) return 100;
    
    const percentage = Math.round((completedFields / totalFields) * 100);
    return percentage > 100 ? 100 : percentage;
};


export function ProfileCompletionCard() {
  const { user } = useUser();

  const completionPercentage = useMemo(() => getProfileCompletion(user), [user]);
  
  if (!user || completionPercentage >= 100) {
    return null; // Don't show the card if not logged in or profile is complete
  }

  return (
    <div className="w-80 bg-card p-6 rounded-lg shadow-lg border border-border">
      <h3 className="font-bold text-foreground">Complete Your Profile</h3>
      <p className="text-sm text-muted-foreground mt-1">
        A complete profile increases your visibility and chances of getting hired.
      </p>
      <div className="flex items-center gap-4 mt-4">
        <p className="text-lg font-bold text-primary">{completionPercentage}%</p>
        <Progress value={completionPercentage} className="w-full" />
      </div>
      <Button asChild className="w-full mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold">
        <Link href={`/settings/profile`}>
            Update Profile
        </Link>
      </Button>
    </div>
  );
}
