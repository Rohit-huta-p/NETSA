
"use client";

import { useUser } from "@/hooks/useUser";
import { EditProfileForm } from "./components/EditProfileForm";
import { ProfileCompletion } from "./components/ProfileCompletion";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

export default function ProfilePage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-3">
                         <Skeleton className="h-24 w-full mb-8" />
                         <Skeleton className="h-96 w-full" />
                    </div>
                    <div className="md:col-span-1">
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        notFound();
    }

  return (
    <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
            <div className="md:col-span-3">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Profile</h1>
                    <p className="text-muted-foreground">Manage your personal and professional information.</p>
                </div>
                <EditProfileForm user={user} />
            </div>
            <div className="md:col-span-1">
                <ProfileCompletion user={user} />
            </div>
        </div>
    </div>
  );
}
