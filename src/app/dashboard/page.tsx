
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, CheckCircle, Heart, MapPin, Search, Users, Briefcase, X } from "lucide-react";
import Link from "next/link";

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
    image: "https://placehold.co/300x200.png",
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
    image: "https://placehold.co/300x200.png",
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
    image: "https://placehold.co/300x200.png",
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
    image: "https://placehold.co/300x200.png",
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
    image: "https://placehold.co/300x200.png",
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
    image: "https://placehold.co/300x200.png",
    imageHint: "salsa dancing"
  },
];


const profileCompletionSteps = [
    { text: "Basic information added", completed: true },
    { text: "Add profile photo", completed: false },
    { text: "Add portfolio items", completed: false },
    { text: "Complete all sections", completed: false },
  ];
  
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Header />
      <main className="p-8">
        <DiscoverSection />
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">6 Events Found</h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
            <div className="lg:col-start-3 lg:row-start-2">
               <ProfileCompletionCard />
            </div>
          </div>
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold">Load More Events</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-8 py-4 grid grid-cols-3 items-center">
          <div className="flex items-center gap-8 justify-start">
            <Link href="/dashboard" className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-lg font-bold text-xl">N</div>
                 <span className="text-2xl font-bold text-gray-800">Netsa</span>
            </Link>
            <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
              <Link href="#" className="hover:text-purple-600">Events</Link>
              <Link href="#" className="hover:text-purple-600">Community</Link>
              <Link href="#" className="hover:text-purple-600">Create Event</Link>
            </nav>
          </div>
          <div className="flex justify-center">
            <div className="relative hidden md:block w-full max-w-md">
              <Input type="search" placeholder="Search events, artists, workshops..." className="w-full pl-10 bg-gray-100 border-none rounded-full"/>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-6 h-6 text-gray-500" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    );
  }

function DiscoverSection() {
    return (
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Discover <span className="text-pink-500">Events</span> &<br/> <span className="text-purple-500">Workshops</span>
        </h1>
        <p className="mt-4 text-gray-500 text-lg">Find your next dance adventure in the city</p>
        <div className="mt-8 max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-6 items-center gap-4 border">
          <div className="relative md:col-span-3">
             <Input type="search" placeholder="Search events, styles, instructors..." className="w-full pl-10 pr-4 py-3 border focus:ring-0 text-base bg-transparent"/>
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <Select>
              <SelectTrigger className="w-full border font-medium text-gray-600 bg-white hover:bg-gray-100 rounded-full py-3 px-4 shadow-none">
                  <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="intensive">Intensive</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
          </Select>
          <Select>
              <SelectTrigger className="w-full border font-medium text-gray-600 bg-white hover:bg-gray-100 rounded-full py-3 px-4 shadow-none">
                  <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="nyc">New York, NY</SelectItem>
                  <SelectItem value="brooklyn">Brooklyn, NY</SelectItem>
                  <SelectItem value="manhattan">Manhattan, NY</SelectItem>
              </SelectContent>
          </Select>
           <Select>
              <SelectTrigger className="w-full border font-medium text-gray-600 bg-white hover:bg-gray-100 rounded-full py-3 px-4 shadow-none">
                  <SelectValue placeholder="Any Date" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-weekend">This Weekend</SelectItem>
              </SelectContent>
          </Select>
        </div>
      </div>
    );
}

function EventCard({ tag, tagColor, title, description, date, location, attendees, price, image, imageHint }) {
    return (
        <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
          <CardHeader className="p-0 relative">
            <div className={`absolute top-4 left-4 text-xs font-bold py-1 px-3 rounded-full ${tagColor}`}>
              {tag}
            </div>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full">
                <Heart className="w-5 h-5 text-white" />
            </Button>
            <div className="bg-purple-100 h-48 flex items-center justify-center">
                 <Briefcase className="w-16 h-16 text-purple-300" />
            </div>
            {price !== null ? (
                <div className="absolute bottom-4 right-4 bg-white text-purple-600 font-bold py-1 px-4 rounded-full shadow-md">
                    ${price}
                </div>
            ) : (
                <div className="absolute bottom-4 right-4 bg-white text-green-600 font-bold py-1 px-4 rounded-full shadow-md">
                    Free
                </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 h-20">{description}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{attendees} attending</span>
              </div>
            </div>
            <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold rounded-full">
              Join Event
            </Button>
          </CardContent>
        </Card>
      );
}

function ProfileCompletionCard() {
    return (
        <Card className="rounded-2xl shadow-lg p-6 bg-white">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Complete Your Profile</h3>
                        <p className="text-sm text-gray-500">Boost your visibility to recruiters</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                    <X className="w-4 h-4" />
                </Button>
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">Profile Completion</span>
                    <span className="text-sm font-bold text-purple-600">60%</span>
                </div>
                <Progress value={60} className="h-2" />
            </div>
            <div className="mt-4 space-y-3">
                {profileCompletionSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                        {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <span className={step.completed ? "text-gray-800" : "text-gray-500"}>{step.text}</span>
                    </div>
                ))}
            </div>
             <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold rounded-full">
                Complete Profile
            </Button>
        </Card>
    );
}

function Footer() {
    return (
      <footer className="bg-[#111827] text-white mt-16">
        <div className="container mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-lg font-bold text-xl">N</div>
                    <span className="text-2xl font-bold text-white">Netsa</span>
                </div>
              <p className="mt-4 text-gray-400 max-w-md">
                Connecting the performing arts community through events, networking, and creative collaboration.
              </p>
               <div className="flex gap-4 mt-6">
                    <Link href="#"><svg className="w-6 h-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"/></svg></Link>
                    <Link href="#"><svg className="w-6 h-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6.51c-0.65,0.29-1.35,0.48-2.08,0.57c0.75-0.45,1.32-1.16,1.59-2.01c-0.7,0.42-1.47,0.72-2.3,0.88 C18.99,5.2,17.97,4.73,16.84,4.73c-2.01,0-3.64,1.63-3.64,3.64c0,0.28,0.03,0.56,0.09,0.83c-3.02-0.15-5.7-1.6-7.5-3.8 C5.47,6.34,5.28,7.03,5.28,7.77c0,1.26,0.64,2.38,1.62,3.03c-0.6-0.02-1.16-0.18-1.65-0.45v0.05c0,1.76,1.26,3.23,2.92,3.57 c-0.3,0.08-0.63,0.13-0.96,0.13c-0.23,0-0.46-0.02-0.68-0.06c0.46,1.45,1.81,2.5,3.4,2.53c-1.25,0.98-2.82,1.56-4.53,1.56 c-0.3,0-0.58-0.02-0.87-0.05c1.62,1.04,3.54,1.64,5.6,1.64c6.72,0,10.4-5.57,10.4-10.4c0-0.16,0-0.32-0.01-0.47 C21.4,7.88,22.01,7.25,22.46,6.51z"/></svg></Link>
                    <Link href="#"><svg className="w-6 h-6 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-12h2v6h-2v-6zm0 8h2v2h-2v-2z"/></svg></Link>
                </div>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider">Platform</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Events</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Community</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Workshops</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Gigs</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Artists</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider">Support</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Help Center</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Contact Us</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Safety</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Guidelines</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">FAQ</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-bold text-white tracking-wider">Company</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">About Us</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Careers</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Press</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Partners</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Blog</Link>
              </nav>
            </div>
             <div>
              <h3 className="font-bold text-white tracking-wider">Legal</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Privacy Policy</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Terms of Service</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Cookie Policy</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Disclaimer</Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
             <div className="w-full md:w-1/2 lg:w-1/3">
                <h3 className="font-bold text-white tracking-wider">Stay in the Loop</h3>
                <p className="mt-2 text-gray-400">Get the latest events and community updates.</p>
                <div className="mt-4 flex">
                    <Input type="email" placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white flex-grow"/>
                    <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold ml-2">Subscribe</Button>
                </div>
            </div>
            <p className="mt-8 md:mt-0 text-gray-500 text-sm">© 2024 Netsa. All rights reserved.</p>
             <p className="mt-2 md:mt-0 text-gray-500 text-sm">Made with ❤️ for the performing arts community</p>
          </div>
        </div>
      </footer>
    );
}


    

    


