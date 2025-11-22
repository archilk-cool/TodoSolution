import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      setText("");
      setDescription("");
      setDueDate("");
      setShowDetails(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          data-testid="input-new-task"
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-base"
          autoFocus
        />
        <Button
          data-testid="button-toggle-details"
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          data-testid="button-add-task"
          type="submit"
          size="default"
          disabled={!text.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div
        className={cn(
          "space-y-3 overflow-hidden transition-all duration-200",
          showDetails ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <Textarea
          data-testid="input-description"
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none text-base min-h-[80px]"
        />
        <Input
          data-testid="input-due-date"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="text-base"
        />
      </div>
    </form>
  );
}
