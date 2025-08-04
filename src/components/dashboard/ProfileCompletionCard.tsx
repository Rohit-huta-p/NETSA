
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function ProfileCompletionCard() {
  return (
    <div className="w-80 bg-card p-6 rounded-lg shadow-lg border border-border">
      <h3 className="font-bold text-foreground">Complete Your Profile</h3>
      <p className="text-sm text-muted-foreground mt-1">
        A complete profile increases your visibility and chances of getting hired.
      </p>
      <div className="flex items-center gap-4 mt-4">
        <p className="text-lg font-bold text-primary">75%</p>
        <Progress value={75} className="w-full" />
      </div>
      <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold">
        Update Profile
      </Button>
    </div>
  );
}
