
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Edit, Plus, Trash2, Loader2 } from "lucide-react";
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

const initialExperienceItems = [
    {
        title: "Gig Name",
        date: "Nov 15, 2024",
        status: "Attended"
    },
    {
        title: "Corporate Event",
        date: "Oct 28, 2024",
        status: "Attended"
    }
];

export function Experience({ artist }: { artist: UserProfile }) {
    const { user } = useUserStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [experienceItems, setExperienceItems] = useState(initialExperienceItems);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isOwnProfile = user?.id === artist.id;

    const handleAddItem = () => {
        setExperienceItems([...experienceItems, { title: "New Experience", date: new Date().toISOString().split('T')[0], status: "Completed" }]);
    }
    
    const handleRemoveItem = (index: number) => {
        setExperienceItems(experienceItems.filter((_, i) => i !== index));
    }
    
    const handleSave = async () => {
        setIsSubmitting(true);
        // In a real app, you would call a server action here to save the experienceItems
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setIsSubmitting(false);
        setIsEditModalOpen(false);
    }

  return (
    <div className="relative">
         {isOwnProfile && (
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -top-12 right-0"
            >
                <Edit className="w-4 h-4 mr-2"/>
                Edit
            </Button>
        )}
        <div className="space-y-4">
            {experienceItems.map((item, index) => (
                <Card key={index} className="p-0">
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted p-3 rounded-lg">
                                <Briefcase className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.date} • {item.status}</p>
                            </div>
                        </div>
                        <Badge variant="outline">Attended</Badge>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>Edit Experience</DialogTitle>
                <DialogDescription>Add, remove, or update your past work experiences.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    {experienceItems.map((item, index) => (
                         <div key={index} className="flex items-center gap-4 p-2 border rounded-lg">
                            <div className="flex-grow grid grid-cols-2 gap-4">
                                <Input defaultValue={item.title} placeholder="Experience Title"/>
                                <Input type="date" defaultValue={new Date(item.date).toISOString().split('T')[0]} placeholder="Date"/>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                     <Button variant="outline" onClick={handleAddItem}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
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
    </div>
  );
}
