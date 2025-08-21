
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GigForm } from './components/GigForm';
import { EventForm } from './components/EventForm';

export default function CreatePage() {

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create a new Post</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Reach thousands of talented artists by posting your opportunity on TalentMatch.
        </p>
      </div>

      <Tabs defaultValue="gig" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gig">Post a Gig</TabsTrigger>
          <TabsTrigger value="event">Post an Event</TabsTrigger>
        </TabsList>
        <TabsContent value="gig">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Gig</CardTitle>
                    <CardDescription>Fill out the details below to find the perfect talent for your paid opportunity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GigForm />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="event">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Event</CardTitle>
                    <CardDescription>Promote your workshop, competition, or performance to our community.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EventForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
