
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Bell, User as UserIcon, PlusCircle, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";

export function Header() {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const { clearUser } = useUserStore();

    const handleLogout = async () => {
        await signOut(auth);
        clearUser();
        router.push('/login');
    };
    
    return (
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
                 <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                    <span className="font-bold text-lg">Netsa</span>
                 </Link>

                {user?.role === 'organizer' ? (
                  <nav className="hidden md:flex items-center gap-2">
                      <Button variant={"ghost"} className="button-underline" data-active={pathname.startsWith("/dashboard")} asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <Button variant={"ghost"} className="button-underline" data-active={pathname.startsWith("/myposts")} asChild>
                        <Link href="/myposts">My Posts</Link>
                      </Button>
                      <Button variant={"ghost"} className="button-underline" data-active={pathname.startsWith("/create")} asChild>
                        <Link href="/create">Create Gig/Event</Link>
                      </Button>
                  </nav>
                ) : (
                  <nav className="hidden md:flex items-center gap-4">
                      <Button variant={"ghost"} className="button-underline" data-active={pathname.startsWith("/events")} asChild>
                          <Link href="/events">Events</Link>
                      </Button>
                      <Button variant={"ghost"} className="button-underline" data-active={pathname.startsWith("/gigs")} asChild>
                          <Link href="/gigs">Gigs</Link>
                      </Button>
                  </nav>
                )}
            </div>
           
            <div className="flex items-center gap-2">
               <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search events, artists, workshops..." className="pl-9 w-64" />
              </div>

              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <ThemeToggle />

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
                            <DropdownMenuLabel>{user.firstName} {user.lastName}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/create">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>Create</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/artist/${user.id}`}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>My Profile</span>
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
