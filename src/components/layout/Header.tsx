
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
      <header className="bg-card border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
                      Netsa
                    </Link>
                    <Link href="/gigs">Gigs</Link>
                    <Link href="/events">Events</Link>
                    <Link href="/community">Community</Link>
                    <Link href="/create">Create Event</Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/" className="hidden md:flex items-center gap-2 font-bold text-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
                Netsa
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground ml-4">
              <Link href="/gigs" className="hover:text-foreground">Gigs</Link>
                <Link href="/events" className="hover:text-foreground">Events</Link>
                <Link href="/community" className="hover:text-foreground">Community</Link>
                <Link href="/create" className="hover:text-foreground">Create Event</Link>
              </nav>
            </div>
            <div className="flex-1 flex justify-center px-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="search" placeholder="Search events, artists, workshops..." className="w-full pl-10 bg-transparent rounded-full border-border h-10" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-9 w-9">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">{user?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {user ? (
                        <>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/artist/${user.id}`}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/create">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>Create</span>
                                </Link>
                            </DropdownMenuItem>
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
        </div>
      </header>
    );
  }
