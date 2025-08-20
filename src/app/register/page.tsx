
import { ArrowRight, Palette, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegistrationTypeSelectionPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 selection:bg-primary/20 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Join Our Community</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose your path and let's get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/register/artist" className="group">
          <Card className="h-full hover:border-[#3A1C71] transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-[#3A1C71]/10 rounded-full inline-block mb-4">
                <Palette className="w-10 h-10 text-[#3A1C71]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#3A1C71]">Register as an Artist</CardTitle>
              <CardDescription>
                Create your portfolio, find gigs, and connect with the industry.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-[#3A1C71] font-bold flex items-center justify-center group-hover:underline">
                    Choose Artist <ArrowRight className="w-4 h-4 ml-2" />
                </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/register/organizer" className="group">
          <Card className="h-full hover:border-[#D76D77] transition-colors duration-300 hover:shadow-lg">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-[#D76D77]/10 rounded-full inline-block mb-4">
                <Users className="w-10 h-10 text-[#D76D77]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#D76D77]">Register as an Organizer</CardTitle>
              <CardDescription>
                Post opportunities, discover talent, and manage your events.
              </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-[#D76D77] font-bold flex items-center justify-center group-hover:underline">
                    Choose Organizer <ArrowRight className="w-4 h-4 ml-2" />
                </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="mt-8 text-center">
          <p className="font-body text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                  Sign In
              </Link>
          </p>
      </div>
    </main>
  );
}
