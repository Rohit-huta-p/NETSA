
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function PortfolioGallery() {
    const portfolioItems = [
        { src: "https://placehold.co/600x400.png", alt: "Performance photo 1", hint: "dance performance" },
        { src: "https://placehold.co/600x400.png", alt: "Performance photo 2", hint: "theatre stage" },
        { src: "https://placehold.co/600x400.png", alt: "Headshot", hint: "headshot portrait" },
        { src: "https://placehold.co/600x400.png", alt: "Performance video", hint: "modern dance" },
        { src: "https://placehold.co/600x400.png", alt: "Behind the scenes", hint: "backstage theatre" },
        { src: "https://placehold.co/600x400.png", alt: "Concert photo", hint: "live concert" },
    ]
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                        <Image src={item.src} alt={item.alt} width={600} height={400} className="w-full h-full object-cover" data-ai-hint={item.hint} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
