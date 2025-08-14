
"use client";

import { Progress } from "@/components/ui/progress";
import type { UserProfile } from "@/store/userStore";
import { useMemo } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const getProfileCompletion = (user: UserProfile | null): { percentage: number, missing: string[] } => {
    if (!user || user.role !== 'artist') return { percentage: 100, missing: [] };

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
    const missingFields: string[] = [];
    
    Object.entries(checklist).forEach(([key, value]) => {
        if (value) {
            completedFields++;
        } else {
            missingFields.push(key);
        }
    });

    const totalFields = Object.keys(checklist).length;
    if (totalFields === 0) return { percentage: 100, missing: [] };
    
    const percentage = Math.round((completedFields / totalFields) * 100);
    return {
        percentage: percentage > 100 ? 100 : percentage,
        missing: missingFields,
    };
};

interface ProfileCompletionProps {
    user: UserProfile;
}

export function ProfileCompletion({ user }: ProfileCompletionProps) {
  const { percentage, missing } = useMemo(() => getProfileCompletion(user), [user]);
  
  if (user.role !== 'artist') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Organizer Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Manage your organizer settings and information.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardDescription>
            A complete profile helps you get noticed by recruiters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
            <p className="text-xl font-bold text-primary">{percentage}%</p>
            <Progress value={percentage} className="w-full" />
        </div>
        <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-sm">To-Do List</h4>
            {missing.length > 0 ? (
                missing.slice(0, 4).map(item => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Circle className="w-4 h-4" />
                        <span>Add {item}</span>
                    </div>
                ))
            ) : (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                   <CheckCircle className="w-4 h-4"/>
                   <span>All set! Your profile is complete.</span>
                </div>
            )}
            {missing.length > 4 && (
                 <p className="text-xs text-muted-foreground pt-2">+ {missing.length - 4} more items</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
