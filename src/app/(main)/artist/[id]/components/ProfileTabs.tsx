import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./tabs/OverviewTab";
import { EventsList } from "./EventsList";
import { PortfolioGallery } from "./PortfolioGallery";
import { ReviewsList } from "./ReviewsList";

export function ProfileTabs() {
  return (
    <Tabs defaultValue="activity" className="mt-8">
      <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 h-12">
        <TabsTrigger value="activity" className="text-base">Activity</TabsTrigger>
        <TabsTrigger value="events" className="text-base">Events</TabsTrigger>
        <TabsTrigger value="portfolio" className="text-base">Portfolio</TabsTrigger>
        <TabsTrigger value="reviews" className="text-base">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="mt-6">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="events" className="mt-6">
        <EventsList />
      </TabsContent>
      <TabsContent value="portfolio" className="mt-6">
        <PortfolioGallery />
      </TabsContent>
      <TabsContent value="reviews" className="mt-6">
        <ReviewsList />
      </TabsContent>
    </Tabs>
  );
}
