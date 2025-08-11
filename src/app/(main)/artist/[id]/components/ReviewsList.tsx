
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function ReviewsList() {
    const reviews = [
        { name: "John Smith", role: "Organizer, 'The Grand Gala'", rating: 5, comment: "Jane is an absolute professional and a joy to work with. Her performance was breathtaking." },
        { name: "Emily White", role: "Choreographer", rating: 5, comment: "A truly gifted dancer with a unique style. Highly recommend." },
        { name: "Michael Brown", role: "Director, 'Starlight Productions'", rating: 4, comment: "Punctual, talented, and took direction well. A great addition to our cast." },
    ];

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
        ));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Reviews & Testimonials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {reviews.map((review, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${review.name.charAt(0)}`} />
                                    <AvatarFallback>{review.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{review.name}</p>
                                    <p className="text-sm text-muted-foreground">{review.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-4">"{review.comment}"</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
