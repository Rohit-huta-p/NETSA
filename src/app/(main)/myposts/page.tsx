

"use client";

import { useQuery } from '@tanstack/react-query';
import type { GetGigsQuery, Event, Gig } from "@/lib/types";
import { useCallback, useState } from 'react';
import { getEvents, getMyGigs } from '@/lib/firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MyPostsHeader } from './components/MyPostsHeader';
import { FilterSortBar } from './components/FilterSortBar';
import { PostCard } from './components/PostCard';

type Post = (Event | Gig) & { postType: 'event' | 'gig' };

const fetchMyPosts = async (userId: string): Promise<Post[]> => {
    const [{ data: events, error: eventsError }, { data: gigs, error: gigsError }] = await Promise.all([
        getEvents(userId),
        getMyGigs(userId)
    ]);
    if (eventsError || gigsError) {
        throw new Error(eventsError || gigsError || 'Failed to fetch posts');
    }

    const typedEvents: Post[] = (events || []).map(event => ({ ...event, postType: 'event' }));
    const typedGigs: Post[] = (gigs || []).map(gig => ({ ...gig, postType: 'gig' }));
    
    const allPosts = [...typedEvents, ...typedGigs];
    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allPosts;
}

export default function MyPostsPage() {
    const { user } = useUser();
    const [filters, setFilters] = useState<Partial<GetGigsQuery>>({});
    const [sort, setSort] = useState('newest');
    const [postType, setPostType] = useState('all');

     const { data: posts, isLoading, isError } = useQuery({
        queryKey: ['myPosts', user?.id],
        queryFn: () => fetchMyPosts(user!.id),
        enabled: !!user?.id
    });
    
    const handleFilterChange = useCallback((filterName: keyof GetGigsQuery, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);
    
    const filteredAndSortedPosts = posts?.filter(post => {
        if (postType !== 'all' && post.postType !== postType) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        if (sort === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="bg-muted/30 min-h-screen">
        <MyPostsHeader />
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 ">
            <FilterSortBar 
                onSortChange={setSort}
                onTypeChange={setPostType}
            />
            
            <div className="mt-6 space-y-4">
                {isLoading && Array.from({length: 3}).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
                
                {isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>There was a problem fetching your posts.</AlertDescription>
                    </Alert>
                )}

                {!isLoading && !isError && (!filteredAndSortedPosts || filteredAndSortedPosts.length === 0) && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Posts Found</AlertTitle>
                        <AlertDescription>You haven't created any posts that match the current filters.</AlertDescription>
                    </Alert>
                )}
                
                {filteredAndSortedPosts?.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    </div>
  );
}

const CardSkeleton = () => (
    <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-md" />
        <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-4 w-1/3 mt-2" />
        </div>
        <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
            </div>
        </div>
    </div>
)
