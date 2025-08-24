
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const applicationsData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 150 },
  { name: 'Mar', value: 170 },
  { name: 'Apr', value: 210 },
  { name: 'May', value: 250 },
  { name: 'Jun', value: 230 },
];

const registrationsData = [
  { name: 'Workshop A', value: 80 },
  { name: 'Workshop B', value: 65 },
  { name: 'Competition X', value: 120 },
  { name: 'Showcase Y', value: 95 },
];


export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Track the performance of your posts and engagement.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Applications Over Time</CardTitle>
                        <CardDescription>Total gig applications received per month.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={applicationsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" name="Applications" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Event Registrations</CardTitle>
                        <CardDescription>Total registrations for your top events.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={registrationsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Registrations" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Client Engagement</CardTitle>
                    <CardDescription>Placeholder for client engagement metrics.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>Client engagement charts coming soon.</p>
                </CardContent>
            </Card>

        </div>
    )
}
