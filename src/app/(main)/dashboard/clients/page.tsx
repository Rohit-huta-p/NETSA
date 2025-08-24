
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, Heart } from "lucide-react";

const clients = [
    { name: "John Doe", joined: "2024-06-15", image: "https://placehold.co/100x100.png" },
    { name: "Jane Smith", joined: "2024-05-20", image: "https://placehold.co/100x100.png" },
    { name: "Alex Johnson", joined: "2024-04-01", image: "https://placehold.co/100x100.png" },
    { name: "Emily White", joined: "2024-03-10", image: "https://placehold.co/100x100.png" },
];

export default function ClientsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Clients Directory</h1>
                <p className="text-muted-foreground">Browse and manage your client connections.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter Clients</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <Input placeholder="Search by name..." className="flex-grow"/>
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ny">New York</SelectItem>
                            <SelectItem value="la">Los Angeles</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Interests" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dance">Dance</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>Apply</Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.map(client => (
                    <Card key={client.name} className="text-center">
                        <CardContent className="p-6">
                             <Avatar className="h-20 w-20 mx-auto mb-4">
                                <AvatarImage src={client.image} data-ai-hint="person portrait" />
                                <AvatarFallback>{client.name.slice(0,2)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg">{client.name}</h3>
                            <Badge variant="secondary" className="my-2">Client</Badge>
                            <p className="text-xs text-muted-foreground">Joined on {client.joined}</p>
                            <div className="mt-4 flex justify-center gap-2">
                                <Button size="sm" variant="outline">View</Button>
                                <Button size="sm"><MessageCircle className="h-4 w-4 mr-2"/> Message</Button>
                                <Button size="icon" variant="ghost"><Heart className="h-4 w-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}
