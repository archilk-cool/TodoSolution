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

   // -------------------------------------------------
   // Load tasks (initial load only)
   // -------------------------------------------------
   async function load() {
      setLoading(true);
      setError(null);

      try {
         const data = await getTodos();

         // Only delay UI on very first page load
         if (firstLoadRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            firstLoadRef.current = false;
         }

         const mapped = (data || []).map((t) => ({
            id: t.id,
            text: t.title,
            description: t.description || "",
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            completed: !!t.isCompleted,
         }));

         setTodos(mapped);
      } catch (err) {
         console.error(err);
         setError("Failed to load tasks.");
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      load();
   }, []);

   // -------------------------------------------------
   // Backend-first: Add
   // -------------------------------------------------
   async function handleAddTodo(data) {
      if (!data?.text?.trim()) return;

      try {
         const saved = await createTodo({
            title: data.text,
            description: data.description || "",
            dueDate: data.dueDate
               ? new Date(data.dueDate).toISOString()
               : null,
         });

         // Update local state after backend success
         setTodos((prev) => [
            ...prev,
            {
               id: saved.id,
               text: saved.title,
               description: saved.description || "",
               dueDate: saved.dueDate ? new Date(saved.dueDate) : null,
               completed: !!saved.isCompleted,
            },
         ]);
      } catch (err) {
         console.error(err);
         setError("Failed to create task.");
      }
   }

   // -------------------------------------------------
   // Backend-first: Toggle Complete
   // -------------------------------------------------
   async function handleToggleTodo(id) {
      const existing = todos.find((t) => t.id === id);
      if (!existing) return;

      try {
         const updated = await updateTodo(id, {
            id,
            title: existing.text,
            description: existing.description || "",
            isCompleted: !existing.completed,
            dueDate: existing.dueDate,
         });

         // If server returns null (204), fallback to our expected update
         const completed = updated?.isCompleted ?? !existing.completed;

         setTodos((prev) =>
            prev.map((t) =>
               t.id === id
                  ? {
                     ...t,
                     completed,
                  }
                  : t
            )
         );
      }
      catch (err) {
         console.error(err);
         setError("Failed to update task.");
      }
   }


   // -------------------------------------------------
   // Backend-first: Edit Task
   // -------------------------------------------------
   async function handleEditTodo(id, updates) {
      const existing = todos.find((t) => t.id === id);
      if (!existing) return;

      const merged = { ...existing, ...updates };

      try {
         const updated = await updateTodo(id, {
            id,
            title: merged.text,
            description: merged.description || "",
            isCompleted: merged.completed,
            dueDate: merged.dueDate,
         });

         // If backend returns null, fallback to merged local version
         const server = updated || {};

         setTodos((prev) =>
            prev.map((t) =>
               t.id === id
                  ? {
                     id: server.id ?? t.id,
                     text: server.title ?? merged.text,
                     description: server.description ?? merged.description,
                     dueDate: server.dueDate
                        ? new Date(server.dueDate)
                        : merged.dueDate,
                     completed:
                        server.isCompleted !== undefined
                           ? server.isCompleted
                           : merged.completed,
                  }
                  : t
            )
         );
      }
      catch (err) {
         console.error(err);
         setError("Failed to update task.");
      }
   }

   // -------------------------------------------------
   // Backend-first: Delete
   // -------------------------------------------------
   async function handleDeleteTodo(id) {
      try {
         await deleteTodo(id);

         // Remove only if backend succeeded
         setTodos((prev) => prev.filter((t) => t.id !== id));
      }
      catch (err) {
         console.error(err);
         setError("Failed to delete task.");
      }
   }

   // -------------------------------------------------
   // Filtering
   // -------------------------------------------------
   const filteredTodos = todos.filter((todo) => {
      if (filter === "active") {
         return !todo.completed;
      }

      if (filter === "completed") {
         return todo.completed;
      }
      return true;
   });

   const counts = {
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
   };

   // -------------------------------------------------
   // Loading Screen
   // -------------------------------------------------
   if (loading) {
      return (
         <div className="min-h-screen bg-muted/80 flex items-center justify-center">
            <div className="rounded-xl bg-background border border-border px-4 py-3 shadow-sm text-[18px] text-muted-foreground">
               Loading tasks...
            </div>
         </div>
      );
   }

   // -------------------------------------------------
   // UI
   // -------------------------------------------------
   return (
      <div className="min-h-screen bg-muted/80 text-foreground flex items-start justify-center px-4 py-10">
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
               <TaskInput onAdd={handleAddTodo} />

               <div className="flex items-center justify-between gap-3">
                  <FilterTabs
                     activeFilter={filter}
                     onFilterChange={setFilter}
                     counts={counts}
                  />
               </div>

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
