import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
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
            description: description.trim() || "",
            dueDate: dueDate || "",
         });
         setText("");
         setDescription("");
         setDueDate("");
         setShowDetails(false);
      }
   };

   const hasDetails =
      (description && description.trim().length > 0) || !!dueDate;

   return (
      <form onSubmit={handleSubmit} className="space-y-2">

         {/* FIRST ROW — Input + inline dropdown + Add */}
         <div className="flex gap-2">
            <Input
               data-testid="input-new-task"
               placeholder="What needs to be done?"
               value={text}
               onChange={(e) => setText(e.target.value)}
               className="flex-1 !text-lg rounded-[11px] border-border bg-background h-11"
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
               disabled={!text.trim()}
               className="px-5 rounded-full shadow-sm h-11 !text-lg"
            >
               <Plus strokeWidth={3} className="h-5 w-5 mr-2" />

               Add
            </Button>
         </div>

         {/* COLLAPSIBLE DETAILS SECTION */}
         <div
            className={cn(
               "overflow-hidden border border-border rounded-[11px] bg-background/80 transition-all duration-200",
               showDetails ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-0"
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
                        onChange={(e) => setDescription(e.target.value)}
                        className="resize-none min-h-[90px] !text-lg"
                     />
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
                        className="!text-[16px]"
                     />
                  </div>
               </div>
            )}
         </div>

      </form>
   );
}
