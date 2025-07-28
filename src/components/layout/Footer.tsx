
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
    return (
      <footer className="bg-card text-foreground mt-16 border-t border-border">
        <div className="container mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-lg font-bold text-xl">N</div>
                    <span className="text-2xl font-bold text-foreground">Netsa</span>
                </div>
              <p className="mt-4 text-muted-foreground max-w-md">
                Connecting the performing arts community through events, networking, and creative collaboration.
              </p>
               <div className="flex gap-4 mt-6">
                    <Link href="#"><svg className="w-6 h-6 text-muted-foreground hover:text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"/></svg></Link>
                    <Link href="#"><svg className="w-6 h-6 text-muted-foreground hover:text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6.51c-0.65,0.29-1.35,0.48-2.08,0.57c0.75-0.45,1.32-1.16,1.59-2.01c-0.7,0.42-1.47,0.72-2.3,0.88 C18.99,5.2,17.97,4.73,16.84,4.73c-2.01,0-3.64,1.63-3.64,3.64c0,0.28,0.03,0.56,0.09,0.83c-3.02-0.15-5.7-1.6-7.5-3.8 C5.47,6.34,5.28,7.03,5.28,7.77c0,1.26,0.64,2.38,1.62,3.03c-0.6-0.02-1.16-0.18-1.65-0.45v0.05c0,1.76,1.26,3.23,2.92,3.57 c-0.3,0.08-0.63,0.13-0.96,0.13c-0.23,0-0.46-0.02-0.68-0.06c0.46,1.45,1.81,2.5,3.4,2.53c-1.25,0.98-2.82,1.56-4.53,1.56 c-0.3,0-0.58-0.02-0.87-0.05c1.62,1.04,3.54,1.64,5.6,1.64c6.72,0,10.4-5.57,10.4-10.4c0-0.16,0-0.32-0.01-0.47 C21.4,7.88,22.01,7.25,22.46,6.51z"/></svg></Link>
                    <Link href="#"><svg className="w-6 h-6 text-muted-foreground hover:text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-12h2v6h-2v-6zm0 8h2v2h-2v-2z"/></svg></Link>
                </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground tracking-wider">Platform</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Events</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Community</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Workshops</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Gigs</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Artists</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-bold text-foreground tracking-wider">Support</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Help Center</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Contact Us</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Safety</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Guidelines</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">FAQ</Link>
              </nav>
            </div>
            <div>
              <h3 className="font-bold text-foreground tracking-wider">Company</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">About Us</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Careers</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Press</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Partners</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Blog</Link>
              </nav>
            </div>
             <div>
              <h3 className="font-bold text-foreground tracking-wider">Legal</h3>
              <nav className="mt-4 space-y-2">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Terms of Service</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Cookie Policy</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Disclaimer</Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
             <div className="w-full md:w-1/2 lg:w-1/3">
                <h3 className="font-bold text-foreground tracking-wider">Stay in the Loop</h3>
                <p className="mt-2 text-muted-foreground">Get the latest events and community updates.</p>
                <div className="mt-4 flex">
                    <Input type="email" placeholder="Enter your email" className="bg-muted border-border text-foreground flex-grow"/>
                    <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold ml-2">Subscribe</Button>
                </div>
            </div>
            <p className="mt-8 md:mt-0 text-muted-foreground text-sm">© 2024 Netsa. All rights reserved.</p>
             <p className="mt-2 md:mt-0 text-muted-foreground text-sm">Made with ❤️ for the performing arts community</p>
          </div>
        </div>
      </footer>
    );
}
