
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Github, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand and Social */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white font-headline">Netsa</h3>
            <p className="mt-2 text-gray-400 max-w-xs">
              Connecting the performing arts community through events, networking, and creative collaboration.
            </p>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white"><Instagram /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Twitter /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Github /></Link>
            </div>
          </div>
          
          {/* Column 2: Platform Links */}
          <div>
            <h4 className="font-semibold text-white">Platform</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/events" className="text-gray-400 hover:text-white">Events</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Community</Link></li>
              <li><Link href="/workshops" className="text-gray-400 hover:text-white">Workshops</Link></li>
              <li><Link href="/gigs" className="text-gray-400 hover:text-white">Gigs</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Artists</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Support Links */}
          <div>
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Safety</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Guidelines</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-semibold text-white">Stay in the Loop</h4>
            <p className="mt-4 text-gray-400">
              Get the latest events and community updates.
            </p>
            <div className="mt-4 flex">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="rounded-r-none bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-primary focus:border-primary"
              />
              <Button type="submit" className="rounded-l-none bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Netsa. All rights reserved.</p>
          <p className="text-gray-500 mt-4 sm:mt-0">
            Made with <span className="text-red-500">&hearts;</span> for the performing arts community.
          </p>
        </div>
      </div>
    </footer>
  );
}
