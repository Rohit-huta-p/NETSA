
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User as UserIcon, PlusCircle } from "lucide-react";
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
import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
    const { user } = useUser();
    
    return (
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="search" placeholder="Search applicants, clients..." className="w-full pl-10 bg-muted/50 rounded-full border-border h-10" />
                </div>
            </div>
           
            <div className="flex items-center gap-4">
              {user?.role === 'organizer' && (
                <>
                    <Button asChild>
                        <Link href="/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Gig
                        </Link>
                    </Button>
                     <Button asChild variant="secondary">
                        <Link href="/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Event
                        </Link>
                    </Button>
                </>
              )}
               {(user?.role === 'organizer' || user?.role === 'client') && (
                 <Button asChild variant="outline">
                    <Link href="/dashboard/clients">Browse Talent</Link>
                </Button>
               )}

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
                                <Link href="/dashboard/profile">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
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
