
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
    const reviews = [
        { name: "Sarah Johnson", rating: 5, comment: "Alex is an incredible instructor with amazing energy. The workshop was both challenging and fun!" },
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
                        <div className="flex items-center gap-2 mb-2">
                             <p className="font-bold">{review.name}</p>
                             <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                       
                        <p className="text-muted-foreground">"{review.comment}"</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
