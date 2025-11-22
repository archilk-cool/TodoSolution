import React, { useEffect, useState } from 'react'
import TaskInput from './components/TaskInput'
import TaskItem from './components/TaskItem'
import FilterTabs from './components/FilterTabs'
import EmptyState from './components/EmptyState'
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todoApi'
import { AnimatePresence } from 'framer-motion'

export default function App() {
   const [todos, setTodos] = useState([])
   const [filter, setFilter] = useState('all')
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   async function load() {
      setLoading(true)
      setError(null)
      try {
         const data = await getTodos()
         // Backend returns: { id, title, description, isCompleted }
         // UI expects: { id, text, description, dueDate, completed }
         const mapped = (data || []).map(t => ({
            id: t.id,
            text: t.title,
            description: t.description || "",
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            completed: !!t.isCompleted
         }));
         setTodos(mapped)
      }
      catch (err) {
         console.error(err)
         setError(err.message || 'Failed to load tasks')
      }
      finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      load()
   }, [])

   async function handleAddTodo(data) {
      // data: { text, description, dueDate }
      if (!data?.text?.trim()) return
      try {
         await createTodo({
            title: data.text,
            description: data.description || '',
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null
         })
         await load()
      }
      catch (err) {
         console.error(err)
         setError(err.message || 'Failed to create task')
      }
   }

   async function handleToggleTodo(id) {
      const existing = todos.find(t => t.id === id)
      if (!existing) return
      try {
         await updateTodo(id, {
            id,
            title: existing.text,
            description: existing.description || '',
            isCompleted: !existing.completed,
            dueDate: existing.dueDate || null
         })
         await load()
      }
      catch (err) {
         console.error(err)
         setError(err.message || 'Failed to update task')
      }
   }

   async function handleEditTodo(id, updates) {
      const existing = todos.find(t => t.id === id)
      if (!existing) return
      const merged = {
         ...existing,
         ...updates
      }
      try {
         await updateTodo(id, {
            id,
            title: merged.text,
            description: merged.description || '',
            isCompleted: !!merged.completed,
            dueDate: merged.dueDate || null
         })
         await load()
      }
      catch (err) {
         console.error(err)
         setError(err.message || 'Failed to update task')
      }
   }

   async function handleDeleteTodo(id) {
      try {
         await deleteTodo(id)
         await load()
      }
      catch (err) {
         console.error(err)
         setError(err.message || 'Failed to delete task')
      }
   }

   const filteredTodos = todos.filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
   })

   const counts = {
      all: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
   }

   if (loading) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-muted-foreground text-base">Loading tasks...</div>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-background text-foreground">
         <div className="max-w-2xl mx-auto px-6 py-8">
            <header className="mb-6 flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
                  <p className="text-sm text-muted-foreground">
                     {counts.active} active • {counts.all} total
                  </p>
               </div>
            </header>

            {error && (
               <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
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

               <div className="space-y-3">
                  {filteredTodos.length === 0 ? (
                     <EmptyState filter={filter} />
                  ) : (
                     <AnimatePresence mode="popLayout">
                        {filteredTodos.map(todo => (
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
   )
}
