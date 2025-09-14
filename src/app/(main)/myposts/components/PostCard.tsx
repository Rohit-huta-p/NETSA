
import type { Event, Gig } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drama, Briefcase, Calendar, Trash2, Share2, Edit, BarChart2, Heart, MessageCircle, Send, Eye } from "lucide-react";
import Image from "next/image";

type Post = (Event | Gig) & { postType: 'event' | 'gig' };

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const isEvent = post.postType === 'event';
    const date = isEvent ? (post as Event).schedule.startDate : (post as Gig).startDate;

    const stats = [
        { icon: Heart, value: (post as any).likes || 0 },
        { icon: MessageCircle, value: (post as any).comments || 0 },
        { icon: Send, value: (post as any).shares || 0 },
        { icon: Eye, value: post.views || 0 },
    ];
    
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
                <div className="relative w-full sm:w-28 h-24 sm:h-24 flex-shrink-0">
                   <Image 
                        src={post.thumbnailUrl || (isEvent ? "https://placehold.co/600x400/E9D5FF/6B21A8?text=Event" : "https://placehold.co/600x400/FBCFE8/86198F?text=Gig")}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                   />
                </div>

                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        {post.status === 'draft' && <Badge variant="outline">Draft</Badge>}
                        <Badge variant="secondary" className="capitalize bg-purple-100 text-purple-700">{post.postType}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <stat.icon className="w-3.5 h-3.5" />
                                <span>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <p className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><BarChart2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
