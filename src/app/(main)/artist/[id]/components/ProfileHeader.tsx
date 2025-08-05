
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, CheckCircle, Star } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="bg-card p-8 rounded-lg shadow-md mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary">
          <AvatarImage src="https://placehold.co/200x200.png" data-ai-hint="woman portrait" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold">Jane Doe</h1>
            <Badge variant="secondary" className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Verified</Badge>
          </div>
          <p className="text-xl text-muted-foreground mt-1">Contemporary Dancer</p>
          <div className="flex items-center gap-4 mt-4 text-muted-foreground">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>New York, NY</span></div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /><span>4.9 (82 reviews)</span></div>
          </div>
          <p className="mt-4 max-w-prose">
            Passionate and expressive dancer with 10+ years of experience in contemporary and lyrical styles. Trained at The Juilliard School. Seeking opportunities to collaborate on innovative performances.
          </p>
          <div className="mt-6 flex gap-2">
            <Button>Connect</Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
