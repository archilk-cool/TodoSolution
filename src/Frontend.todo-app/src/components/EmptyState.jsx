import { ClipboardList } from "lucide-react";

export default function EmptyState({ filter }) {
   const messages = {
      all: {
         title: "No tasks yet",
         description: "Add one to get started.",
      },
      active: {
         title: "All done",
         description: "Nothing active right now.",
      },
      completed: {
         title: "No completed tasks",
         description: "Complete a task to see it here.",
      },
   };

   const { title, description } = messages[filter];

   return (
      <div
         data-testid="empty-state"
         className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border/70 bg-muted/40"
      >
         <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
         <h3 className="text-lg font-semibold mb-1">{title}</h3>
         <p className="text-[16px] text-muted-foreground max-w-sm">{description}</p>
      </div>
   );
}
