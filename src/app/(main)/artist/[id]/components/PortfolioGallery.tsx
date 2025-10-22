
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Video, Image as ImageIcon, Edit, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import type { UserProfile } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// This would typically come from props/artist profile
const initialPortfolioItems = [
    { src: "https://placehold.co/600x400.png", alt: "Performance photo 1", hint: "dance performance", type: "image" },
    { src: "https://placehold.co/600x400.png", alt: "Performance photo 2", hint: "theatre stage", type: "image" },
    { src: "https://placehold.co/600x400.png", alt: "Headshot", hint: "headshot portrait", type: "video" },
];


export function PortfolioGallery({ artist }: { artist: UserProfile }) {
    const { user } = useUserStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [portfolioItems, setPortfolioItems] = useState(initialPortfolioItems);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isOwnProfile = user?.id === artist.id;

    const handleAddItem = () => {
        setPortfolioItems([...portfolioItems, { src: "https://placehold.co/600x400.png", alt: "New Item", hint: "new item", type: "image" }]);
    }
    
    const handleRemoveItem = (index: number) => {
        setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
    }
    
    const handleSave = async () => {
        setIsSubmitting(true);
        // In a real app, you would call a server action here to save the portfolioItems
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setIsSubmitting(false);
        setIsEditModalOpen(false);
    }

    return (
        <Card className="relative">
             {isOwnProfile && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-4 right-4"
                >
                    <Edit className="w-4 h-4 mr-2"/>
                    Edit
                </Button>
            )}
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

             <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                    <DialogTitle>Edit Gallery</DialogTitle>
                    <DialogDescription>Add, remove, or update your portfolio items.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        {portfolioItems.map((item, index) => (
                             <div key={index} className="flex items-center gap-4 p-2 border rounded-lg">
                                <Image src={item.src} alt={item.alt} width={60} height={60} className="rounded-md object-cover" />
                                <div className="flex-grow space-y-1">
                                    <Input defaultValue={item.alt} placeholder="Alternative text"/>
                                    <Input defaultValue={item.src} placeholder="Image URL"/>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                         <Button variant="outline" onClick={handleAddItem}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
