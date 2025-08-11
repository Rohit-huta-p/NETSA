
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserProfile } from "@/store/userStore";
import { ActivityFeed } from "./ActivityFeed";
import { PortfolioGallery } from "./PortfolioGallery";
import { ReviewsList } from "./ReviewsList";
import { EventsList } from "./EventsList";

interface ProfileBodyProps {
  artist: UserProfile;
}

export function ProfileBody({ artist }: ProfileBodyProps) {
  return (
    <Tabs defaultValue="activity" className="mt-8">
      <TabsList className="grid w-full grid-cols-4 bg-muted p-1 h-12 rounded-lg">
        <TabsTrigger value="activity" className="text-base">Activity</TabsTrigger>
        <TabsTrigger value="portfolio" className="text-base">Portfolio</TabsTrigger>
        <TabsTrigger value="events" className="text-base">Events</TabsTrigger>
        <TabsTrigger value="reviews" className="text-base">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="mt-6">
        <ActivityFeed />
      </TabsContent>
      <TabsContent value="portfolio" className="mt-6">
        <PortfolioGallery />
      </TabsContent>
      <TabsContent value="events" className="mt-6">
        <EventsList />
      </TabsContent>
      <TabsContent value="reviews" className="mt-6">
        <ReviewsList />
      </TabsContent>
    </Tabs>
  );
}
