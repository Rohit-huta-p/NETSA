
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                <span className="font-bold text-xl text-white">Netsa</span>
            </div>
            <p className="text-gray-400 text-sm">
             Connecting the performing arts community through events, networking, and creative collaboration.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="text-gray-400 hover:text-white"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-white"><Youtube className="w-5 h-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/events" className="text-gray-400 hover:text-white">Events</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Community</Link></li>
              <li><Link href="/workshops" className="text-gray-400 hover:text-white">Workshops</Link></li>
              <li><Link href="/gigs" className="text-gray-400 hover:text-white">Gigs</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Artists</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Safety</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Guidelines</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

           <div>
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Press</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Partners</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
           <div>
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
            <h4 className="font-semibold text-white">Stay in the Loop</h4>
            <p className="text-gray-400 text-sm mt-1">Get the latest events and community updates.</p>
            <form className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
                <Input type="email" placeholder="Enter your email" className="bg-gray-800 border-gray-700 text-white flex-grow" />
                <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">Subscribe</Button>
            </form>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Netsa. All rights reserved.</p>
          <p className="text-gray-500 flex items-center gap-1.5">Made with <span className="text-red-500">❤️</span> for the performing arts community.</p>
        </div>
      </div>
    </footer>
  );
}

