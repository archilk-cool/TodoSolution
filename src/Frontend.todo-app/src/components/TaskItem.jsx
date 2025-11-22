import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TaskItem({
  id,
  text,
  description,
  dueDate,
  completed,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editDescription, setEditDescription] = useState(description || "");
  const [editDueDate, setEditDueDate] = useState(
    dueDate ? format(new Date(dueDate), "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(id, {
        text: editText.trim(),
        description: editDescription.trim() || null,
        dueDate: editDueDate ? new Date(editDueDate) : null,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(text);
    setEditDescription(description || "");
    setEditDueDate(dueDate ? format(new Date(dueDate), "yyyy-MM-dd'T'HH:mm") : "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const isDueSoon = dueDate && !completed && new Date(dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);
  const isOverdue = dueDate && !completed && new Date(dueDate) < new Date();

  return (
    <motion.div
      data-testid={`task-item-${id}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex flex-col gap-3 p-4 rounded-md border bg-card hover-elevate",
        completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          data-testid={`checkbox-task-${id}`}
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className="h-5 w-5 mt-0.5"
        />

        {isEditing ? (
          <div className="flex-1 space-y-3">
            <Input
              data-testid={`input-edit-task-${id}`}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              autoFocus
            />
            <Textarea
              data-testid={`input-edit-description-${id}`}
              placeholder="Add a description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[80px]"
            />
            <Input
              data-testid={`input-edit-due-date-${id}`}
              type="datetime-local"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex gap-2">
              <Button
                data-testid={`button-save-edit-${id}`}
                size="sm"
                onClick={handleSaveEdit}
              >
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                data-testid={`button-cancel-edit-${id}`}
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span
                  data-testid={`text-task-${id}`}
                  className={cn(
                    "text-base font-medium",
                    completed && "line-through text-muted-foreground"
                  )}
                >
                  {text}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 transition-opacity",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Button
                    data-testid={`button-edit-${id}`}
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    data-testid={`button-delete-${id}`}
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {description && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span 
                    data-testid={`text-description-${id}`} 
                    className={cn(
                      "text-muted-foreground",
                      completed && "line-through"
                    )}
                  >
                    {description}
                  </span>
                </div>
              )}

              {dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    isOverdue && "text-destructive font-medium",
                    isDueSoon && !isOverdue && "text-orange-600 dark:text-orange-400 font-medium",
                    !isDueSoon && !isOverdue && "text-muted-foreground"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span data-testid={`text-due-date-${id}`}>
                    {format(new Date(dueDate), "MMM d, yyyy 'at' h:mm a")}
                    {isOverdue && " (Overdue)"}
                    {isDueSoon && !isOverdue && " (Due soon)"}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
