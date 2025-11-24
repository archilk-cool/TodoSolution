import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const TaskItem = React.forwardRef(
   (
      { id, text, description, dueDate, completed, onToggle, onEdit, onDelete },
      ref
   ) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editText, setEditText] = useState(text);
      const [editDescription, setEditDescription] = useState(
         description || ""
      );
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
         setEditDueDate(
            dueDate
               ? format(new Date(dueDate), "yyyy-MM-dd'T'HH:mm")
               : ""
         );
      };

      const handleKeyDown = (e) => {
         if (e.key === "Escape") {
            handleCancelEdit();
         }
      };

      const isDueSoon =
         dueDate &&
         !completed &&
         new Date(dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);

      const isOverdue =
         dueDate && !completed && new Date(dueDate) < new Date();

      // Choose left-bar color based on status
      const barClass = cn(
         "w-1 rounded-full mt-1",
         completed
            ? "bg-muted-foreground/40"
            : isOverdue
               ? "bg-destructive"
               : isDueSoon
                  ? "bg-orange-500"
                  : "bg-primary"
      );

      return (
         <motion.div
            ref={ref} // required for framer-motion
            data-testid={`task-item-${id}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={cn(
               "group flex gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm transition hover:bg-muted/60 hover:shadow-md",
               completed && "opacity-60"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
         >
            {/* Left accent bar */}
            <div className={barClass} />

            <div className="flex flex-1 items-start gap-3">
               {/* Checkbox */}
               <Checkbox
                  data-testid={`checkbox-task-${id}`}
                  checked={completed}
                  onCheckedChange={() => onToggle(id)}
                  className="mt-1 h-5 w-5"
               />

               {/* Content */}
               {isEditing ? (
                  <div className="flex-1 space-y-3">
                     <Input
                        data-testid={`input-edit-task-${id}`}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="!text-lg"
                        placeholder="Task title"
                     />

                     <Textarea
                        data-testid={`input-edit-description-${id}`}
                        placeholder="Add a description (optional)"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="resize-none min-h-[80px] !text-lg"
                     />

                     <div className="space-y-3">
                        <Input
                           data-testid={`input-edit-due-date-${id}`}
                           type="datetime-local"
                           value={editDueDate}
                           onChange={(e) => setEditDueDate(e.target.value)}
                           onKeyDown={handleKeyDown}
                           className="!text-[18px]"
                        />

                        <div className="flex gap-3">
                           <Button
                              data-testid={`button-save-edit-${id}`}
                              size="lg"
                              onClick={handleSaveEdit}
                              className="text-lg font-medium h-10 px-5 rounded-lg"
                           >
                              <Check className="h-6 w-6 mr-1" strokeWidth={2.5} />
                              Save
                           </Button>

                           <Button
                              data-testid={`button-cancel-edit-${id}`}
                              size="lg"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="text-lg font-medium h-10 px-5 hover:bg-destructive/10"
                           >
                              <X className="h-6 w-6 mr-1" strokeWidth={2.5} />
                              Cancel
                           </Button>
                        </div>

                     </div>
                  </div>
               ) : (
                  <div className="flex-1 space-y-2">
                     {/* Title + hover actions */}
                     <div className="flex items-start justify-between gap-2">
                        {/* Left Side: Task Name */}
                        <span
                           data-testid={`text-task-${id}`}
                           className={cn(
                              "text-base font-medium",
                              completed && "line-through text-muted-foreground"
                           )}
                        >
                           {text}
                        </span>

                        {/* Right Side: Icons */}
                        <div className={cn(
                           // items-start aligns to top, but -mt-1 pulls it up slightly to match text baseline visually
                           "flex items-center gap-2 -mt-1 transition-opacity",
                           isHovered ? "opacity-100" : "opacity-0"
                        )}>
                           {/* EDIT BUTTON */}
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => setIsEditing(true)}
                              aria-label="Edit task"
                           >
                              <Pencil className="!h-5 !w-5" /> {/* Suggesting h-5 for better proportion inside h-8 */}
                           </Button>

                           {/* DELETE BUTTON */}
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => onDelete(id)}
                              aria-label="Delete task"
                           >
                              <Trash2 className="!h-5 !w-5" />
                           </Button>
                        </div>
                     </div>

                     {/* Description + meta */}
                     <div className="space-y-1.5 text-[16px] text-muted-foreground">
                        {description && (
                           <div className="flex items-start gap-2">
                              <FileText className="h-5 w-5 mt-0.5" />
                              <span>{description}</span>
                           </div>
                        )}

                        {dueDate && (
                           <div
                              className={cn(
                                 "flex items-center gap-2 text-[16px]",
                                 isOverdue && "text-destructive font-medium",
                                 isDueSoon &&
                                 !isOverdue &&
                                 "text-orange-600 dark:text-orange-400 font-medium",
                                 !isDueSoon &&
                                 !isOverdue &&
                                 "text-muted-foreground"
                              )}
                           >
                              <Calendar className="h-5 w-5" />
                              <span data-testid={`text-due-date-${id}`}>
                                 {format(
                                    new Date(dueDate),
                                    "MMM d, yyyy 'at' h:mm a"
                                 )}
                                 {isOverdue && " (Overdue)"}
                                 {isDueSoon && !isOverdue && " (Due soon)"}
                              </span>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </motion.div>
      );
   }
);

export default TaskItem;
