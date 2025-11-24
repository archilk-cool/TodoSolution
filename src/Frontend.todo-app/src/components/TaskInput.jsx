import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";

export default function TaskInput({ onAdd }) {
   const [text, setText] = useState("");
   const [description, setDescription] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [showDetails, setShowDetails] = useState(false);
   const [errors, setErrors] = useState({});

   // -------------------------------------------------------
   // VALIDATION (matches backend DTO exactly)
   // -------------------------------------------------------
   function validate() {
      const e = {};

      // Title
      if (!text.trim()) {
         e.text = "Title is required.";
      }
      else if (text.trim().length < 3) {
         e.text = "Title must be at least 3 characters.";
      }
      else if (text.trim().length > 200) {
         e.text = "Title cannot exceed 200 characters.";
      }

      // Description
      if (description && description.length > 2000) {
         e.description = "Description cannot exceed 2000 characters.";
      }

      // Due date cannot be in the past
      if (dueDate) {
         const selected = new Date(dueDate);
         const now = new Date();
         if (selected < now) {
            e.dueDate = "Due date cannot be in the past.";
         }
      }

      setErrors(e);
      return Object.keys(e).length === 0;
   }

   // -------------------------------------------------------
   // SUBMIT HANDLER
   // -------------------------------------------------------
   const handleSubmit = (e) => {
      e.preventDefault();

      if (!validate()) return;

      onAdd({
         text: text.trim(),
         description: description.trim() || "",
         dueDate: dueDate || "",
      });

      // Reset
      setText("");
      setDescription("");
      setDueDate("");
      setErrors({});
      setShowDetails(false);
   };

   const hasDetails =
      (description && description.trim().length > 0) || !!dueDate;

   return (
      <form onSubmit={handleSubmit} className="space-y-2">

         {/* FIRST ROW — Input + dropdown + Add */}
         <div className="flex gap-2 items-start">
            <Input
               data-testid="input-new-task"
               placeholder="What needs to be done?"
               value={text}
               maxLength={2000}
               onChange={(e) => setText(e.target.value)}
               className={cn(
                  "flex-1 !text-lg rounded-[11px] border-border bg-background h-11",
                  errors.text && "border-red-500"
               )}
            />

            <button
               type="button"
               onClick={() => setShowDetails(!showDetails)}
               className={cn(
                  "h-11 w-10 flex items-center justify-center rounded-[11px] border border-border text-muted-foreground bg-muted/40 transition hover:bg-muted",
                  hasDetails && "border-primary text-primary"
               )}
            >
               {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
               ) : (
                  <ChevronDown className="h-4 w-4" />
               )}
            </button>

            <Button
               data-testid="button-add-task"
               type="submit"
               className="px-5 rounded-lg shadow-sm h-11 !text-lg"
            >
               <Plus strokeWidth={3} className="h-5 w-5 mr-2" />
               Add
            </Button>
         </div>

         {/* Title error message (below the row so layout stays intact) */}
         {errors.text && (
            <div className="text-red-500 text-sm ml-1 -mt-1">{errors.text}</div>
         )}

         {/* COLLAPSIBLE DETAILS */}
         <div
            className={cn(
               "overflow-hidden border border-border rounded-[11px] bg-background/80 transition-all duration-200",
               showDetails ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-0"
            )}
         >
            {showDetails && (
               <div className="p-4 grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(220px,0.9fr)]">

                  {/* Description */}
                  <div>
                     <div className="text-[0.8rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Description
                     </div>
                     <Textarea
                        data-testid="input-description"
                        placeholder="Add a description (optional)"
                        value={description}
                        maxLength={2000}
                        onChange={(e) => setDescription(e.target.value)}
                        className={cn(
                           "resize-none min-h-[90px] !text-lg",
                           errors.description && "border-red-500"
                        )}
                     />
                     {errors.description && (
                        <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                     )}
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                     <span>{errors.description && <span className="text-red-500">{errors.description}</span>}</span>
                     <span>{description.length}/2000</span>
                  </div>

                  {/* Due date */}
                  <div>
                     <div className="text-[0.8rem] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Due date
                     </div>
                     <Input
                        data-testid="input-due-date"
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={cn("!text-[16px]", errors.dueDate && "border-red-500")}
                     />
                     {errors.dueDate && (
                        <div className="text-red-500 text-sm mt-1">{errors.dueDate}</div>
                     )}
                  </div>
               </div>
            )}
         </div>

      </form>
   );
}
