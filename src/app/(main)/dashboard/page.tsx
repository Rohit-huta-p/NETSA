
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { BarChart, FileText, Users, Eye } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend } from 'recharts';

const data = [
  { name: 'Jan', applications: 30, registrations: 20 },
  { name: 'Feb', applications: 45, registrations: 35 },
  { name: 'Mar', applications: 60, registrations: 50 },
  { name: 'Apr', applications: 50, registrations: 40 },
  { name: 'May', applications: 70, registrations: 60 },
  { name: 'Jun', applications: 85, registrations: 75 },
];


export default function DashboardPage() {
    const { user } = useUser();

    const summaryCards = [
        { title: "Total Posts", value: "12", icon: FileText, roles: ['organizer'] },
        { title: "Pending Applications", value: "8", icon: Users, roles: ['organizer'] },
        { title: "Total Clients", value: "4", icon: Users, roles: ['organizer', 'client'] }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
                </div>
                <div className="flex gap-2">
                    {user?.role === 'organizer' && <Button asChild><Link href="/create">View My Posts</Link></Button>}
                    {(user?.role === 'organizer' || user?.role === 'client') && <Button asChild variant="outline"><Link href="/dashboard/clients">Browse Talent</Link></Button>}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {summaryCards.map((card) => (
                    user?.role && card.roles.includes(user.role) && (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                <card.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                                <p className="text-xs text-muted-foreground">+2 from last month</p>
                            </CardContent>
                        </Card>
                    )
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of recent applications and registrations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Users className="h-5 w-5 mr-3" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">New application for 'Lead Dancer' from Jane Doe.</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>
                         <div className="flex items-center">
                            <Users className="h-5 w-5 mr-3" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">John Smith registered for 'Hip-Hop Workshop'.</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {user?.role === 'organizer' && (
            <Card>
                <CardHeader>
                    <CardTitle>Engagement Overview</CardTitle>
                    <CardDescription>Applications and registrations over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="registrations" stroke="hsl(var(--secondary))" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            )}

        </div>
    );
}
