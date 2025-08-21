
import { Button } from "@/components/ui/button";
import { ArrowRight, GitFork, Heart, Layers, PlayCircle, Star, Users, Zap, Link2, Calendar } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/app/(main)/events/components/EventCard";

export default function Home() {

  const stats = [
    { value: "5K+", label: "Artists", icon: <Users className="w-8 h-8" /> },
    { value: "200+", label: "Events", icon: <Calendar className="w-8 h-8" /> },
    { value: "50+", label: "Gigs", icon: <Star className="w-8 h-8" /> },
    { value: "1K+", label: "Workshops", icon: <Layers className="w-8 h-8" /> },
  ];

  const events = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
      id: "4",
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
  ];

  const communityFeatures = [
      {
          icon: <Link2 className="w-8 h-8 text-primary" />,
          title: "Connect & Network",
          description: "Build meaningful relationships with fellow dancers, choreographers, and industry professionals."
      },
      {
          icon: <GitFork className="w-8 h-8 text-primary" />,
          title: "Share & Collaborate",
          description: "Join discussions, share your work, and collaborate on creative projects with the community."
      },
      {
          icon: <Zap className="w-8 h-8 text-primary" />,
          title: "Showcase Talent",
          description: "Create your artist profile, showcase your skills, and get discovered by event organizers."
      },
      {
          icon: <Heart className="w-8 h-8 text-primary" />,
          title: "Find Gigs",
          description: "Discover gigs, auditions, and performance opportunities tailored to your style and experience."
      },
  ];

  const communityStats = [
      { value: "10K+", label: "Active Members" },
      { value: "500+", label: "Events Monthly" },
      { value: "98%", label: "Satisfaction Rate" },
  ]


  return (
    <div className="bg-background font-body text-foreground">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative text-center">
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight">Where Movement Meets Community</h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-purple-100">
                    Connect with dancers, discover workshops, book gigs, and host events. Netsa is your gateway to the performing arts community.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Button asChild size="lg" className="font-bold px-8 py-6 text-base bg-white text-purple-700 hover:bg-purple-50 shadow-lg">
                        <Link href="/register">Join the Community</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="font-bold px-8 py-6 text-base text-white border-white/50 hover:bg-white/10">
                        <PlayCircle className="mr-2"/>
                        Watch Demo
                    </Button>
                </div>
                 <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/20 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center">
                            <div className="text-4xl mb-2 text-white">{stat.icon}</div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-sm text-purple-200">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Discover Section */}
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-headline">Discover Amazing <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">Events & Workshops</span></h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        From beginner workshops to professional gigs, find opportunities that match your passion and skill level.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {events.map((event, index) => (
                        <EventCard key={index} {...event} />
                    ))}
                </div>
            </div>
        </section>

        {/* Creative Community Section */}
        <section className="py-20 bg-muted/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-headline">Join a Thriving <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">Creative Community</span></h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Netsa isn’t just about events—it’s about building lasting connections and growing together as artists.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {communityFeatures.map((feature, index) => (
                        <div key={index} className="text-center p-6">
                            <div className="flex justify-center items-center mb-4 w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-orange-400 text-white rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
                 <div className="bg-card rounded-xl p-12 shadow-md border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {communityStats.map((stat, index) => (
                            <div key={index}>
                                <p className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">{stat.value}</p>
                                <p className="mt-2 text-muted-foreground text-lg">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                 </div>
                 <div className="text-center mt-12">
                    <Button asChild size="lg" className="font-bold px-10 py-6 text-base text-white bg-gradient-to-r from-purple-500 to-orange-500 hover:opacity-90">
                        <Link href="/register">Start Your Journey <ArrowRight className="ml-2"/></Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
      <Footer/>
    </div>
  );
}
