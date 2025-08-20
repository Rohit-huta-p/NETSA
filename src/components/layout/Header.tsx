
"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, User as UserIcon, LogOut, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";


export function Header() {
    const { user } = useUser();
    const { clearUser } = useUserStore();
    const router = useRouter();

    const handleLogout = async () => {
      await signOut(auth);
      clearUser();
      router.push('/login');
    };
    
    return (
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium rounded-xl mt-8">
                  <Link href="/events" className="flex items-center gap-2 text-lg font-semibold">
                     <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg font-bold text-xl">N</div>
                     <span className="text-2xl font-bold text-foreground">Netsa</span>
                  </Link>
                  <Link href="/events" className="hover:text-primary">Events</Link>
                  <Link href="/gigs" className="hover:text-primary">Gigs</Link>
                  <Link href="#" className="hover:text-primary">Community</Link>
                  {user?.role === 'organizer' && (
                     <Link href="/create" className="hover:text-primary">Create Event</Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/events" className="hidden md:flex items-center gap-2">
                 <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg font-bold text-xl">N</div>
                 <span className="text-2xl font-bold text-foreground">Netsa</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-muted-foreground font-medium ml-8">
              <Link href="/events" className="hover:text-primary">Events</Link>
              <Link href="/gigs" className="hover:text-primary">Gigs</Link>
              <Link href="#" className="hover:text-primary">Community</Link>
              {user?.role === 'organizer' && (
                     <Link href="/create" className="hover:text-primary font-semibold text-primary">Create Event</Link>
              )}
            </nav>
          </div>
          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-lg">
              <Input type="search" placeholder="Search events, artists, workshops..." className="w-full pl-10 bg-muted border-none rounded-full h-10"/>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full bg-red-500" />
            </Button>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Avatar className="cursor-pointer h-9 w-9">
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {user ? (
                        <>
                            <DropdownMenuLabel>
                              <p className="font-bold">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/artist/${user.id}`}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            {user.role === 'organizer' && (
                                <DropdownMenuItem asChild>
                                  <Link href="/create">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>Create</span>
                                  </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </>
                    ) : (
                         <DropdownMenuItem asChild>
                            <Link href="/login">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }
