
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  // Benefits listed for artists
  const artistBenefits = [
    "Apply for gigs that match your unique skills",
    "Showcase your work in a stunning portfolio",
    "Connect directly with top industry recruiters",
    "Access exclusive workshops to hone your craft",
  ];

  // Benefits listed for recruiters
  const recruiterBenefits = [
    "Post job opportunities",
    "Browse diverse artist profiles",
    "Host events and workshops",
    "Build a powerful network",
  ];

  return (
    <div className="bg-background font-body">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4 sm:p-6 md:p-8 selection:bg-primary/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-[#FB7185] to-[#EA580C] bg-clip-text text-transparent">
            Welcome to Netsa
          </h1>
          <p className="text-muted-foreground mt-2 font-body text-lg max-w-prose">
            Choose your path and join our creative community.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <OnboardingCard
            id="artist-card"
            icon={<Palette className="w-10 h-10 text-primary" />}
            iconContainerClassName="bg-primary/10"
            title="For Artists"
            description="Unleash your creativity and find your next opportunity."
            benefits={artistBenefits}
            buttonText="Register as an Artist"
            buttonClassName="text-white bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] hover:from-[#8B5CF6]/90 hover:via-[#EC4899]/90 hover:to-[#F59E0B]/90"
            bulletColor="#8B5CF6"
            href="/register?type=artist"
          />
          <OnboardingCard
            id="organizer-card"
            icon={<Users className="w-10 h-10 text-[#FB7185]" />}
            iconContainerClassName="bg-[#FFEDD5]"
            title="For Organizers"
            description="Discover exceptional talent and build your dream team."
            benefits={recruiterBenefits}
            buttonText="Register as an Organizer"
            buttonClassName="text-white bg-gradient-to-r from-[#FB7185] to-[#EA580C] hover:from-[#FB7185]/90 hover:to-[#EA580C]/90"
            bulletColor="#FB7185"
            href="/register?type=organizer"
          />
        </div>

        <div className="mt-10 text-center">
          <p className="font-body text-muted-foreground">
            Already have an account?{" "}
            <Button asChild variant="link" className="text-primary font-bold p-1">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

interface OnboardingCardProps {
  id: string;
  icon: React.ReactNode;
  iconContainerClassName?: string;
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  buttonClassName?: string;
  bulletColor: string;
  href: string;
}

function OnboardingCard({ id, icon, iconContainerClassName, title, description, benefits, buttonText, buttonClassName, href, bulletColor }: OnboardingCardProps) {
  return (
    <Card id={id} className="flex flex-col rounded-xl border shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
      <CardHeader className="items-center text-center p-8">
        <div className={`p-4 rounded-full mb-4 ${iconContainerClassName}`}>
          {icon}
        </div>
        <CardTitle className="text-3xl font-headline">{title}</CardTitle>
        <CardDescription className="font-body mt-2 text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-8 pb-8">
        <div className="space-y-2 font-body text-muted-foreground">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center">
              <div style={{ backgroundColor: bulletColor }} className="w-2 h-2 rounded-full mr-3 shrink-0"></div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-8 pt-0 mt-auto">
        <Link href={href} className="w-full">
          <Button size="lg" className={`w-full font-bold text-base py-6 ${buttonClassName}`}>
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
