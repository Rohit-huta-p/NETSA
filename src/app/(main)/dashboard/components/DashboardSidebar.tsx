
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, IndianRupee, Bell } from "lucide-react";

export function DashboardSidebar() {
    const quickInsights = [
        { title: "Total Events", value: "24", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-100" },
        { title: "Total Clients", value: "44", icon: Users, color: "text-pink-600", bgColor: "bg-pink-100" },
        { title: "Monthly Earnings", value: "₹.....", icon: IndianRupee, color: "text-orange-600", bgColor: "bg-orange-100" },
    ];

    const updates = [
        { text: "3 new applications for Contemporary Workshop", time: "2 min ago" },
        { text: "Hip-Hop Battle starts in 2 days", time: "1 hour ago" },
        { text: "Payment received for Bollywood Workshop", time: "3 hours ago" },
    ];

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {quickInsights.map(item => (
                        <div key={item.title} className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.bgColor}`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{item.title}</p>
                                <p className="font-bold text-xl">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Updates</CardTitle>
                    <Button variant="ghost" size="icon"><Bell className="w-5 h-5"/></Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {updates.map((update, index) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium">{update.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{update.time}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
