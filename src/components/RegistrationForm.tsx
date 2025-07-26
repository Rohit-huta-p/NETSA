
'use client';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') || 'artist';

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">
          {userType === 'artist' ? 'Artist Registration' : 'Recruiter Registration'}
        </CardTitle>
        <CardDescription>
          {userType === 'artist'
            ? 'Join our community of talented artists.'
            : 'Find the best talent for your projects.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] hover:from-[#8B5CF6]/90 hover:via-[#EC4899]/90 hover:to-[#F59E0B]/90"
          >
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

