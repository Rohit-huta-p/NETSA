
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
    const socialLinks = [
        { name: "Facebook", href: "#", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"/></svg> },
        { name: "Twitter", href: "#", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6.51c-0.65,0.29-1.35,0.48-2.08,0.57c0.75-0.45,1.32-1.16,1.59-2.01c-0.7,0.42-1.47,0.72-2.3,0.88 C18.99,5.2,17.97,4.73,16.84,4.73c-2.01,0-3.64,1.63-3.64,3.64c0,0.28,0.03,0.56,0.09,0.83c-3.02-0.15-5.7-1.6-7.5-3.8 C5.47,6.34,5.28,7.03,5.28,7.77c0,1.26,0.64,2.38,1.62,3.03c-0.6-0.02-1.16-0.18-1.65-0.45v0.05c0,1.76,1.26,3.23,2.92,3.57 c-0.3,0.08-0.63,0.13-0.96,0.13c-0.23,0-0.46-0.02-0.68-0.06c0.46,1.45,1.81,2.5,3.4,2.53c-1.25,0.98-2.82,1.56-4.53,1.56 c-0.3,0-0.58-0.02-0.87-0.05c1.62,1.04,3.54,1.64,5.6,1.64c6.72,0,10.4-5.57,10.4-10.4c0-0.16,0-0.32-0.01-0.47 C21.4,7.88,22.01,7.25,22.46,6.51z"/></svg> },
        { name: "Instagram", href: "#", icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-12h2v6h-2v-6zm0 8h2v2h-2v-2z"/></svg> },
    ];

    const footerLinks = [
        {
            title: "Platform",
            links: ["Events", "Community", "Workshops", "Gigs", "Artists"]
        },
        {
            title: "Support",
            links: ["Help Center", "Contact Us", "Safety", "Guidelines", "FAQ"]
        },
        {
            title: "Company",
            links: ["About Us", "Careers", "Press", "Partners", "Blog"]
        },
        {
            title: "Legal",
            links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"]
        }
    ];

    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            <div className="lg:col-span-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 text-white flex items-center justify-center rounded-lg font-bold text-2xl">N</div>
                    <span className="text-3xl font-bold text-white">Netsa</span>
                </div>
              <p className="mt-4 text-gray-400 max-w-md">
                Connecting the performing arts community through events, networking, and creative collaboration.
              </p>
               <div className="flex gap-5 mt-6">
                    {socialLinks.map(social => (
                        <Link key={social.name} href={social.href} className="text-gray-400 hover:text-white">
                           {social.icon}
                        </Link>
                    ))}
                </div>
            </div>
            {footerLinks.map(section => (
                <div key={section.title}>
                    <h3 className="font-bold text-white tracking-wider uppercase">{section.title}</h3>
                    <nav className="mt-4 space-y-3">
                        {section.links.map(link => (
                             <Link key={link} href="#" className="block text-gray-400 hover:text-white">{link}</Link>
                        ))}
                    </nav>
                </div>
            ))}
          </div>
          <div className="mt-16 pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="w-full md:w-auto">
                <h3 className="font-bold text-white tracking-wider">Stay in the Loop</h3>
                <p className="mt-2 text-gray-400">Get the latest events and community updates.</p>
                <div className="mt-4 flex gap-2">
                    <Input type="email" placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white flex-grow"/>
                    <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold">Subscribe</Button>
                </div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Netsa. All rights reserved.</p>
                <p className="mt-1 text-gray-500 text-sm">Made with ❤️ for the performing arts community</p>
            </div>
          </div>
        </div>
      </footer>
    );
}

    