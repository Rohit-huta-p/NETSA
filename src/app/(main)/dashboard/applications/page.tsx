
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";

const gigApplications = [
  { name: "Jane Doe", post: "Lead Dancer for Music Video", date: "2024-07-20", status: "Pending" },
  { name: "John Smith", post: "Commercial Photoshoot Model", date: "2024-07-19", status: "Viewed" },
  { name: "Emily White", post: "Lead Dancer for Music Video", date: "2024-07-18", status: "Contacted" },
];

const eventRegistrations = [
  { name: "Michael Brown", post: "Advanced Hip-Hop Workshop", date: "2024-07-15", status: "Confirmed" },
  { name: "Sarah Green", post: "Beginner Ballet Intensive", date: "2024-07-14", status: "Waitlisted" },
];

export default function ApplicationsPage() {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold">Applicants & Registrations</h1>
                <p className="text-muted-foreground">Manage all incoming applications and event sign-ups.</p>
            </div>
            <Tabs defaultValue="gigs">
                <TabsList>
                    <TabsTrigger value="gigs">Gig Applications</TabsTrigger>
                    <TabsTrigger value="events">Event Registrations</TabsTrigger>
                </TabsList>
                <TabsContent value="gigs">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gig Applications</CardTitle>
                            <CardDescription>Review and manage applications for your gig postings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant Name</TableHead>
                                        <TableHead>Post Title</TableHead>
                                        <TableHead>Applied On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gigApplications.map(app => (
                                        <TableRow key={app.name}>
                                            <TableCell className="font-medium">{app.name}</TableCell>
                                            <TableCell>{app.post}</TableCell>
                                            <TableCell>{app.date}</TableCell>
                                            <TableCell><Badge variant="outline">{app.status}</Badge></TableCell>
                                            <TableCell className="space-x-2">
                                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><MessageCircle className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="events">
                     <Card>
                        <CardHeader>
                            <CardTitle>Event Registrations</CardTitle>
                            <CardDescription>Manage registrations for your events and workshops.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Participant Name</TableHead>
                                        <TableHead>Event Title</TableHead>
                                        <TableHead>Registered On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {eventRegistrations.map(reg => (
                                        <TableRow key={reg.name}>
                                            <TableCell className="font-medium">{reg.name}</TableCell>
                                            <TableCell>{reg.post}</TableCell>
                                            <TableCell>{reg.date}</TableCell>
                                            <TableCell><Badge>{reg.status}</Badge></TableCell>
                                             <TableCell className="space-x-2">
                                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><MessageCircle className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
