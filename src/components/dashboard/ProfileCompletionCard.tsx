
"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { UserProfile } from "@/store/userStore";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle, Circle, X } from "lucide-react";

const getProfileCompletion = (user: UserProfile | null): { percentage: number, missing: string[], checklist: Record<string, boolean> } => {
    if (!user) return { percentage: 0, missing: [], checklist: {} };
    if (user.role !== 'artist') return { percentage: 100, missing: [], checklist: {} };

    const checklistData = {
        'Basic information added': !!(user.firstName && user.lastName && user.city && user.country),
        'Add profile photo': !!user.profileImageUrl,
        'Add portfolio items': !!(user.portfolioLinks || (user.skills && user.skills.length > 0)),
        'Complete all sections': !!(user.bio && user.experienceYears && user.socialMedia?.instagram),
    };

    let completedFields = 0;
    const missingFields: string[] = [];
    
    Object.entries(checklistData).forEach(([key, value]) => {
        if (value) {
            completedFields++;
        } else {
            missingFields.push(key);
        }
    });

    const totalFields = Object.keys(checklistData).length;
    if (totalFields === 0) return { percentage: 100, missing: [], checklist: checklistData };
    
    const percentage = Math.round((completedFields / totalFields) * 100);
    return {
        percentage: percentage > 100 ? 100 : percentage,
        missing: missingFields,
        checklist: checklistData,
    };
};

export function ProfileCompletionCard() {
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const { percentage, checklist } = useMemo(() => getProfileCompletion(user), [user]);
  
  if (!user || user.role !== 'artist' || percentage >= 100 || !isVisible) {
    return null;
  }

  return (
    <div className="w-80 bg-card p-6 rounded-2xl shadow-lg border border-border">
        <div className="flex justify-between items-start">
            <div>
                 <h3 className="font-bold text-lg text-foreground">Complete Your Profile</h3>
                 <p className="text-sm text-muted-foreground mt-1">
                    Boost your visibility to recruiters
                </p>
            </div>
            <Button onClick={() => setIsVisible(false)} variant="ghost" size="icon" className="h-7 w-7 -mt-2 -mr-2"><X className="w-4 h-4"/></Button>
        </div>
      
      <div className="flex items-center gap-4 mt-4">
        <p className="text-xl font-bold text-primary">{percentage}%</p>
        <Progress value={percentage} className="w-full h-2 bg-muted" />
      </div>

       <div className="mt-6 space-y-3">
            {Object.entries(checklist).map(([item, isCompleted]) => (
                <div key={item} className={`flex items-center gap-3 text-sm ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-border" />}
                    <span>{item}</span>
                </div>
            ))}
        </div>

      <Button asChild size="lg" className="w-full mt-6 font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
        <Link href={`/settings/profile`}>
            Complete Profile
        </Link>
      </Button>
    </div>
  );
}
