import { ClipboardList } from "lucide-react";

export default function EmptyState({ filter }) {
  const messages = {
    all: {
      title: "No tasks yet",
      description: "Add one to get started!",
    },
    active: {
      title: "All done!",
      description: "Time to relax",
    },
    completed: {
      title: "No completed tasks",
      description: "Complete a task to see it here",
    },
  };

  const { title, description } = messages[filter];

  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-base text-muted-foreground">{description}</p>
    </div>
  );
}
