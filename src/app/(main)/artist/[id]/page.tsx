
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/firebase/firestore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { UserProfile } from "@/store/userStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      const { data, error } = await getUserProfile(params.id);
      if (error || !data) {
        setError(error || "Artist not found");
        console.error(error);
      } else {
        setArtist(data);
      }
      setLoading(false);
    };

    fetchArtist();
  }, [params.id]);

  if (loading) {
    return (
        <div className="container mx-auto py-10">
            {/* Skeleton for Header */}
            <div className="bg-card p-8 rounded-2xl shadow-lg relative border mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full flex-shrink-0" />
                    <div className="flex-grow mt-4 md:mt-0 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>
             {/* Skeleton for Tabs */}
            <Skeleton className="h-12 w-full" />
        </div>
    );
  }

  if (error || !artist) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <ProfileHeader artist={artist} />
      <ProfileTabs artist={artist} />
    </div>
  );
}
