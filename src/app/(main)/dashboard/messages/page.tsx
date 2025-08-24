
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function MessagesPage() {
    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col">
             <div className="mb-8">
                <h1 className="text-3xl font-bold">Messages</h1>
                <p className="text-muted-foreground">Chat with applicants and clients.</p>
            </div>
            <Card className="flex-grow flex">
                {/* Conversations List */}
                <div className="w-1/3 border-r">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 space-y-2">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman portrait" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Jane Doe</p>
                                <p className="text-xs text-muted-foreground truncate">Great, I'll send over my portfolio...</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                            <Avatar>
                                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="man portrait" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">John Smith</p>
                                <p className="text-xs text-muted-foreground truncate">Thanks for the opportunity!</p>
                            </div>
                        </div>
                    </CardContent>
                </div>
                {/* Chat Window */}
                <div className="w-2/3 flex flex-col">
                    <div className="border-b p-4 flex items-center gap-3">
                         <Avatar>
                            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="woman portrait" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">Jane Doe</h3>
                    </div>
                    <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                        {/* Messages */}
                        <div className="flex justify-end">
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                                <p>Hi Jane, thanks for applying! Your profile looks great. Could you send over a recent dance reel?</p>
                            </div>
                        </div>
                         <div className="flex justify-start">
                            <div className="bg-muted p-3 rounded-lg max-w-xs">
                                <p>Of course! Great, I'll send over my portfolio link now.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t flex items-center gap-2">
                        <Input placeholder="Type your message..." className="flex-grow"/>
                        <Button size="icon"><Send className="h-4 w-4"/></Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
