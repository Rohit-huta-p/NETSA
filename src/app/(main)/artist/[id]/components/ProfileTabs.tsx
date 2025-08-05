
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./tabs/OverviewTab";
import { EventsList } from "./EventsList";
import { PortfolioGallery } from "./PortfolioGallery";
import { ReviewsList } from "./ReviewsList";

export function ProfileTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
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
