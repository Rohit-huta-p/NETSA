

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Video } from "lucide-react";

export function PortfolioGallery() {
    const portfolioItems = [
        { src: "https://placehold.co/600x400.png", alt: "Performance photo 1", hint: "dance performance", type: "image" },
        { src: "https://placehold.co/600x400.png", alt: "Performance photo 2", hint: "theatre stage", type: "image" },
        { src: "https://placehold.co/600x400.png", alt: "Headshot", hint: "headshot portrait", type: "video" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolioItems.map((item, index) => (
                        <div key={index} className="relative group aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                            <Image src={item.src} alt={item.alt} width={600} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={item.hint} />
                            {item.type === 'video' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Video className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
