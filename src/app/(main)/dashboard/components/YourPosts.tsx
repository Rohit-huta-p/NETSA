
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit, Drama, Briefcase } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getEvents, getMyGigs } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event, Gig } from "@/lib/types";

type Post = (Event | Gig) & { postType: 'event' | 'gig' };

const fetchMyPosts = async (organizerId: string): Promise<Post[]> => {
    const [{ data: events, error: eventsError }, { data: gigs, error: gigsError }] = await Promise.all([
        getEvents(organizerId),
        getMyGigs(organizerId)
    ]);

    if (eventsError || gigsError) {
        throw new Error(eventsError || gigsError || 'Failed to fetch posts');
    }

    const typedEvents: Post[] = (events || []).map(event => ({ ...event, postType: 'event' }));
    const typedGigs: Post[] = (gigs || []).map(gig => ({ ...gig, postType: 'gig' }));

    const allPosts = [...typedEvents, ...typedGigs];

    // Sort by createdAt date, descending
    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allPosts;
}

export function YourPosts() {
    const { user } = useUser();

    const { data: posts, isLoading } = useQuery({
        queryKey: ['myPosts', user?.id],
        queryFn: () => fetchMyPosts(user!.id),
        enabled: !!user?.id,
    });

    const displayedPosts = posts?.slice(0, 3) || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Posts</h2>
                <Button variant="link" asChild className="text-primary">
                    <Link href="/myposts">View All &gt;</Link>
                </Button>
            </div>
            <div className="space-y-4">
                 {isLoading && Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex items-center gap-4">
                             <Skeleton className="w-20 h-20 rounded-lg" />
                             <div className="space-y-2 flex-grow">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                             </div>
                             <Skeleton className="h-10 w-24" />
                        </CardContent>
                    </Card>
                ))}

                {!isLoading && displayedPosts.map((post) => {
                    const isEvent = post.postType === 'event';
                    const date = isEvent ? (post as Event).schedule.startDate : (post as Gig).startDate;
                    const city = isEvent ? (post as Event).location.city : (post as Gig).location.city;
                    const amount = isEvent ? (post as Event).pricing.amount : (post as Gig).compensation.amount;
                    const applicants = isEvent ? (post as Event).currentRegistrations : (post as Gig).currentApplications;

                    return (
                        <Card key={post.id} className="overflow-hidden">
                            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-grow">
                                    <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg">
                                        {isEvent ? <Drama className="w-8 h-8 text-purple-600 dark:text-purple-400" /> : <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={post.status === 'active' ? "secondary" : "outline"} className={post.status === 'active' ? "bg-blue-100 text-blue-800" : ""}>{post.status}</Badge>
                                            <Badge variant="outline" className="capitalize">{post.postType}</Badge>
                                        </div>
                                        <h3 className="font-bold text-lg mt-1">{post.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/><span>{new Date(date).toLocaleDateString()}</span></div>
                                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/><span>{city}</span></div>
                                        </div>
                                        <p className="font-bold text-primary mt-2">
                                            {amount ? `$${amount}` : 'Free'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                    <Button variant="outline" size="sm">View Applicants ({applicants})</Button>
                                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-muted-foreground"/></Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                 {!isLoading && displayedPosts.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            You haven't posted any gigs or events yet.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
