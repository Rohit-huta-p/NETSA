import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users } from "lucide-react";

export default function Home() {
  const artistBenefits = [
    "Apply for gigs that match your unique skills",
    "Showcase your work in a stunning portfolio",
    "Connect directly with top industry recruiters",
    "Access exclusive workshops to hone your craft",
  ];

  const recruiterBenefits = [
    "Post job opportunities and reach a vast talent pool",
    "Browse diverse artist profiles and portfolios",
    "Host events and workshops to engage with talent",
    "Build a powerful network of creative professionals",
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 selection:bg-primary/20">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] bg-clip-text text-transparent">
          welcome to Nets
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
          buttonClassName="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] hover:from-[#8B5CF6]/90 hover:via-[#EC4899]/90 hover:to-[#F59E0B]/90"
        />
        <OnboardingCard
          id="recruiter-card"
          icon={<Users className="w-10 h-10 text-[#FB7185]" />}
          iconContainerClassName="bg-[#FFEDD5]"
          title="For Recruiters"
          description="Discover exceptional talent and build your dream team."
          benefits={recruiterBenefits}
          buttonText="Register as a Recruiter"
          buttonClassName="bg-gradient-to-r from-[#FB7185] to-[#EA580C] hover:from-[#FB7185]/90 hover:to-[#EA580C]/90"
        />
      </div>

      <div className="mt-10 text-center">
        <p className="font-body text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="text-primary font-bold p-1">
            Sign In
          </Button>
        </p>
      </div>
    </main>
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
}

function OnboardingCard({ id, icon, iconContainerClassName, title, description, benefits, buttonText, buttonClassName }: OnboardingCardProps) {
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
        <ul className="space-y-2 font-body text-muted-foreground list-disc list-inside">
          {benefits.map((benefit) => (
            <li key={benefit}>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-8 pt-0 mt-auto">
        <Button size="lg" className={`w-full font-bold text-base py-6 ${buttonClassName}`}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
