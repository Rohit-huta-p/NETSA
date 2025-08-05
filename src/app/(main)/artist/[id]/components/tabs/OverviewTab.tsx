
import { ActivityFeed } from "../ActivityFeed";

export function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">Contemporary</div>
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">Lyrical</div>
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">Improvisation</div>
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">Ballet</div>
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">Jazz</div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Languages</h3>
           <div className="flex flex-wrap gap-2">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">English (Fluent)</div>
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">Spanish (Conversational)</div>
          </div>
        </div>
      </div>
      <div>
        <ActivityFeed />
      </div>
    </div>
  );
}
