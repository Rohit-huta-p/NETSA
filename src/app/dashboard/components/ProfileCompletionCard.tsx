
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users, X } from "lucide-react";


const profileCompletionSteps = [
    { text: "Basic information added", completed: true },
    { text: "Add profile photo", completed: false },
    { text: "Add portfolio items", completed: false },
    { text: "Complete all sections", completed: false },
  ];

export function ProfileCompletionCard() {
    return (
        <Card className="rounded-2xl shadow-lg p-6 bg-card border-l-4 border-l-purple-500 max-w-sm">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Complete Your Profile</h3>
                        <p className="text-sm text-muted-foreground">Boost your visibility to recruiters</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                    <X className="w-4 h-4" />
                </Button>
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Profile Completion</span>
                    <span className="text-sm font-bold text-primary">25%</span>
                </div>
                <Progress value={25} className="h-2" />
            </div>
            <div className="mt-4 space-y-3">
                {profileCompletionSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                        {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <div className="w-5 h-5 border-2 border-border rounded-full"></div>
                        )}
                        <span className={step.completed ? "text-foreground line-through" : "text-muted-foreground"}>{step.text}</span>
                    </div>
                ))}
            </div>
             <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold rounded-full">
                Complete Profile
            </Button>
        </Card>
    );
}
