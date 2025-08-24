
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Github, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand and Social */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold text-white font-headline">Netsa</h3>
            <p className="mt-2 text-gray-400 max-w-xs">
             The ultimate platform connecting talented artists with exciting opportunities.
            </p>
          </div>
          
          {/* Column 2: Platform Links */}
          <div>
            <h4 className="font-semibold text-white">Platform</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
              <li><Link href="/dashboard/clients" className="text-gray-400 hover:text-white">Clients</Link></li>
              <li><Link href="/create" className="text-gray-400 hover:text-white">Create</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Support Links */}
          <div>
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Guidelines</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Netsa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
