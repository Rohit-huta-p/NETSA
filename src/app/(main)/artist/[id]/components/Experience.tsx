import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export function Experience() {

    const experienceItems = [
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
    ]

  return (
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
  );
}
