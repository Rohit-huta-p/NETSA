
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/store/userStore";
import { EventsList } from "./EventsList";
import { PortfolioGallery } from "./PortfolioGallery";
import { ReviewsList } from "./ReviewsList";
import { OverviewTab } from "./tabs/OverviewTab";

interface ProfileTabsProps {
  artist: UserProfile;
}

export function ProfileTabs({ artist }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="activity" className="mt-8">
      <TabsList className="grid w-full grid-cols-4 bg-slate-200 p-1 h-12">
        <TabsTrigger value="activity" className="text-base">Activity</TabsTrigger>
        <TabsTrigger value="events" className="text-base">Past Events</TabsTrigger>
        <TabsTrigger value="portfolio" className="text-base">Portfolio</TabsTrigger>
        <TabsTrigger value="reviews" className="text-base">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="mt-6 bg-white">
        <OverviewTab artist={artist} />
      </TabsContent>
      <TabsContent value="events" className="mt-6 bg-white">
        <EventsList />
      </TabsContent>
      <TabsContent value="portfolio" className="mt-6 bg-white">
        <PortfolioGallery />
      </TabsContent>
      <TabsContent value="reviews" className="mt-6 bg-white">
        <ReviewsList />
      </TabsContent>
    </Tabs>
  );
}
