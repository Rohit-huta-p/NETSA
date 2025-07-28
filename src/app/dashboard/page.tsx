
"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DiscoverSection } from "./components/DiscoverSection";
import { EventCard } from "./components/EventCard";
import { ProfileCompletionCard } from "./components/ProfileCompletionCard";

const events = [
  {
    tag: "Workshop",
    tagColor: "bg-purple-200 text-purple-800",
    title: "Contemporary Dance Workshop",
    description: "Explore fluid movements and emotional expression in this intensive contemporary dance workshop led by renowned choreographer.",
    date: "Dec 15, 2024 - 7:00 PM",
    location: "Downtown Studio, NYC",
    attendees: 24,
    price: 45,
    image: "https://placehold.co/600x400.png",
    imageHint: "dance workshop"
  },
  {
    tag: "Competition",
    tagColor: "bg-orange-200 text-orange-800",
    title: "Hip-Hop Battle Championship",
    description: "Annual competition featuring the best street dancers from across the city. Prizes, networking, and pure talent.",
    date: "Dec 18, 2024 - 8:00 PM",
    location: "Urban Center, Brooklyn",
    attendees: 156,
    price: null,
    image: "https://placehold.co/600x400.png",
    imageHint: "hip-hop battle"
  },
  {
    tag: "Intensive",
    tagColor: "bg-pink-200 text-pink-800",
    title: "Ballet Intensive Weekend",
    description: "Two-day classical ballet intensive covering technique, variations, and performance skills for intermediate to advanced dancers.",
    date: "Dec 20-21, 2024",
    location: "Royal Academy, Manhattan",
    attendees: 32,
    price: 180,
    image: "https://placehold.co/600x400.png",
    imageHint: "ballet performance"
  },
  {
    tag: "Social",
    tagColor: "bg-blue-200 text-blue-800",
    title: "Jazz Dance Social",
    description: "Come dance, mingle, and enjoy live jazz music in this social dance event. All levels welcome!",
    date: "Dec 22, 2024 - 6:30 PM",
    location: "Swing Society, Queens",
    attendees: 89,
    price: 25,
    image: "https://placehold.co/600x400.png",
    imageHint: "jazz dance"
  },
  {
    tag: "Performance",
    tagColor: "bg-red-200 text-red-800",
    title: "Modern Dance Performance",
    description: "Experience cutting-edge contemporary choreography in this evening showcase featuring local and visiting artists.",
    date: "Dec 25, 2024 - 8:00 PM",
    location: "Arts Theater, Manhattan",
    attendees: 234,
    price: 35,
    image: "https://placehold.co/600x400.png",
    imageHint: "modern dance"
  },
  {
    tag: "Workshop",
    tagColor: "bg-purple-200 text-purple-800",
    title: "Salsa Beginners Workshop",
    description: "Learn the fundamentals of salsa dancing in this fun and energetic workshop. No partner required!",
    date: "Dec 28, 2024 - 5:00 PM",
    location: "Latin Dance Studio, Bronx",
    attendees: 45,
    price: 30,
    image: "https://placehold.co/600x400.png",
    imageHint: "salsa dancing"
  },
];
  
export default function DashboardPage() {
  return (
    <div className=" min-h-screen bg-background font-body ">
      <Header />

      <main className="p-8 relative">
        <DiscoverSection />
        <div className="mt-8 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">6 Events Found</h2>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => (
                  <EventCard key={index} {...event} />
                ))}
              </div>
            </div>
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold">Load More Events</Button>
          </div>
          <div className="absolute bottom-0  right-2 z-50 lg:block">
            <ProfileCompletionCard />
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
}
