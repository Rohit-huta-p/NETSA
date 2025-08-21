import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Video, Image as ImageIcon } from "lucide-react";

export function PortfolioGallery() {
    const portfolioItems = [
        { src: "https://placehold.co/600x400.png", alt: "Performance photo 1", hint: "dance performance", type: "image" },
        { src: "https://placehold.co/600x400.png", alt: "Performance photo 2", hint: "theatre stage", type: "image" },
        { src: "https://placehold.co/600x400.png", alt: "Headshot", hint: "headshot portrait", type: "video" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolioItems.map((item, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                             <div className="absolute inset-0 bg-muted flex items-center justify-center z-0">
                                {item.type === 'video' ? (
                                     <Video className="w-8 h-8 text-muted-foreground" />
                                ) : (
                                     <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <Image 
                                src={item.src} 
                                alt={item.alt} 
                                width={600} 
                                height={600} 
                                className="relative z-10 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                                data-ai-hint={item.hint} 
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
