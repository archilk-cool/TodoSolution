import { AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react"; // pretty icons
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

   // NEW: theme state
   const [theme, setTheme] = useState("light");

   const firstLoadRef = useRef(true);

   // --------------------------------------------
   // THEME INITIALIZATION
   // --------------------------------------------
   useEffect(() => {
      // Load saved theme
      const saved = localStorage.getItem("theme");

      if (saved === "dark" || saved === "light") {
         setTheme(saved);
         document.documentElement.classList.toggle("dark", saved === "dark");
      }
      else {
         // default to light
         document.documentElement.classList.remove("dark");
      }
   }, []);

   // --------------------------------------------
   // TOGGLE THEME
   // --------------------------------------------
   function toggleTheme() {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);

      // Update HTML root
      document.documentElement.classList.toggle("dark", newTheme === "dark");

      // Persist
      localStorage.setItem("theme", newTheme);
   }

   // --------------------------------------------
   // Load tasks (initial load only)
   // --------------------------------------------
   async function load() {
      setLoading(true);
      setError(null);

      try {
         const data = await getTodos();

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

   // --------------------------------------------
   // Backend-first: Add
   // --------------------------------------------
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

   // --------------------------------------------
   // Backend-first: Toggle Complete
   // --------------------------------------------
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

         const completed = updated?.isCompleted ?? !existing.completed;

         setTodos((prev) =>
            prev.map((t) =>
               t.id === id ? { ...t, completed } : t
            )
         );
      } catch (err) {
         console.error(err);
         setError("Failed to update task.");
      }
   }

   // --------------------------------------------
   // Backend-first: Edit Task
   // --------------------------------------------
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
      } catch (err) {
         console.error(err);
         setError("Failed to update task.");
      }
   }

   // --------------------------------------------
   // Backend-first: Delete
   // --------------------------------------------
   async function handleDeleteTodo(id) {
      try {
         await deleteTodo(id);
         setTodos((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
         console.error(err);
         setError("Failed to delete task.");
      }
   }

   // --------------------------------------------
   // Filtering
   // --------------------------------------------
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

   // --------------------------------------------
   // Loading Screen
   // --------------------------------------------
   if (loading) {
      return (
         <div className="min-h-screen bg-muted/80 dark:bg-black flex items-center justify-center transition-colors">
            <div className="rounded-2xl px-6 py-6 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg flex flex-col items-center gap-4">

               {/* Minimal gradient spinner — OPTION 1 */}
               <div className="relative w-12 h-12 animate-spin">
                  <div
                     className="absolute inset-0 rounded-full border-4 border-transparent"
                     style={{
                        borderTopColor: "rgba(99,102,241,1)",       // Indigo 500
                        borderLeftColor: "rgba(167,139,250,0.8)",  // Violet glow
                     }}
                  />
               </div>

               <div className="text-lg font-medium text-foreground dark:text-gray-200">
                  Loading tasks...
               </div>
            </div>
         </div>
      );
   }

   // --------------------------------------------
   // UI
   // --------------------------------------------
   return (
      <div className="min-h-screen bg-muted/80 dark:bg-black text-foreground dark:text-gray-200 flex items-start justify-center px-4 py-10 transition-colors">

         <div className="w-full max-w-3xl rounded-2xl bg-background dark:bg-gray-900 border border-border dark:border-gray-700 shadow-lg px-6 py-7 transition-colors">

            {/* HEADER with DARK MODE TOGGLE */}
            <header className="mb-6 flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                     My To-Do List
                  </h1>
                  <p className="text-lg text-muted-foreground dark:text-gray-400">
                     {counts.active} active • {counts.all} total
                  </p>
               </div>

               {/* Toggle button */}
               <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full border border-border dark:border-gray-600 hover:bg-accent hover:bg-opacity-20 transition"
               >
                  {theme === "light" ? (
                     <Moon className="w-5 h-5" />
                  ) : (
                     <Sun className="w-5 h-5" />
                  )}
               </button>
            </header>

            {error && (
               <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-[18px] text-destructive">
                  {error}
               </div>
            )}

            <div className="space-y-6">
               <TaskInput onAdd={handleAddTodo} />

               <FilterTabs
                  activeFilter={filter}
                  onFilterChange={setFilter}
                  counts={counts}
               />

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
