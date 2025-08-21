
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold">TalentMatch</h3>
            <p className="mt-2 text-muted-foreground">
              Connecting talent with opportunity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">For Artists</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Find Gigs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">For Organizers</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Post a Gig
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Search Artists
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Newsletter</h4>
            <p className="mt-2 text-muted-foreground">
              Stay up to date with the latest news.
            </p>
            <div className="mt-4 flex">
              <Input type="email" placeholder="Your email" className="rounded-r-none" />
              <Button type="submit" className="rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TalentMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
