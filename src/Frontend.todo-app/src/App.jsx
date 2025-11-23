import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./api/todoApi";
import EmptyState from "./components/EmptyState";
import FilterTabs from "./components/FilterTabs";
import TaskInput from "./components/TaskInput";
import TaskItem from "./components/TaskItem";

export default function App() {
   const [todos, setTodos] = useState([]);
   const [filter, setFilter] = useState("all");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const firstLoadRef = useRef(true);

   async function load() {
      setLoading(true);
      setError(null);
      try {
         const data = await getTodos();

         // Only delay on the very first load
         if (firstLoadRef.current) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            firstLoadRef.current = false;  // mark as done
         }

         // Backend returns: { id, title, description, isCompleted, dueDate }
         // UI expects: { id, text, description, dueDate, completed }
         const mapped = (data || []).map((t) => ({
            id: t.id,
            text: t.title,
            description: t.description || "",
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            completed: !!t.isCompleted,
         }));
         setTodos(mapped);
      }
      catch (err) {
         console.error(err);
         setError(err.message || "Failed to load tasks");
      }
      finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      load();
   }, []);

   async function handleAddTodo(data) {
      // data: { text, description, dueDate }
      if (!data?.text?.trim()) return;
      try {
         await createTodo({
            title: data.text,
            description: data.description || "",
            dueDate: data.dueDate
               ? new Date(data.dueDate).toISOString()
               : null,
         });
         await load();
      }
      catch (err) {
         console.error(err);
         setError(err.message || "Failed to create task");
      }
   }

   async function handleToggleTodo(id) {
      const existing = todos.find((t) => t.id === id);
      if (!existing) {
         return;
      }

      try {
         await updateTodo(id, {
            id,
            title: existing.text,
            description: existing.description || "",
            isCompleted: !existing.completed,
            dueDate: existing.dueDate || null,
         });
         await load();
      }
      catch (err) {
         console.error(err);
         setError(err.message || "Failed to update task");
      }
   }

   async function handleEditTodo(id, updates) {
      const existing = todos.find((t) => t.id === id);
      if (!existing) return;

      const merged = {
         ...existing,
         ...updates,
      };

      try {
         await updateTodo(id, {
            id,
            title: merged.text,
            description: merged.description || "",
            isCompleted: !!merged.completed,
            dueDate: merged.dueDate || null,
         });
         await load();
      } catch (err) {
         console.error(err);
         setError(err.message || "Failed to update task");
      }
   }

   async function handleDeleteTodo(id) {
      try {
         await deleteTodo(id);
         await load();
      } catch (err) {
         console.error(err);
         setError(err.message || "Failed to delete task");
      }
   }

   const filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
   });

   const counts = {
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-muted/80 flex items-center justify-center">
            <div className="rounded-xl bg-background border border-border px-4 py-3 shadow-sm text-[18px] text-muted-foreground">
               Loading tasks...
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-muted/80 text-foreground flex items-start justify-center px-4 py-10">
         {/* Centered "page" like Notion */}
         <div className="w-full max-w-3xl rounded-2xl bg-background border border-border shadow-lg px-6 py-7">
            <header className="mb-6 flex items-baseline justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
                  <p className="text-lg text-muted-foreground">
                     {counts.active} active • {counts.all} total
                  </p>
               </div>
            </header>

            {error && (
               <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-[18px] text-destructive">
                  {error}
               </div>
            )}

            <div className="space-y-6">
               {/* Input + collapsible details */}
               <TaskInput onAdd={handleAddTodo} />

               {/* Filters */}
               <div className="flex items-center justify-between gap-3">
                  <FilterTabs
                     activeFilter={filter}
                     onFilterChange={setFilter}
                     counts={counts}
                  />
               </div>

               {/* Task blocks */}
               <div className="space-y-2">
                  {filteredTodos.length === 0 ? (
                     <EmptyState filter={filter} />
                  ) : (
                     <AnimatePresence mode="popLayout">
                        {filteredTodos.map((todo) => (
                           <TaskItem
                              key={todo.id}
                              id={todo.id}
                              text={todo.text}
                              description={todo.description}
                              dueDate={todo.dueDate}
                              completed={todo.completed}
                              onToggle={handleToggleTodo}
                              onEdit={handleEditTodo}
                              onDelete={handleDeleteTodo}
                           />
                        ))}
                     </AnimatePresence>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
