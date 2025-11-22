
import React, { useEffect, useState } from 'react'
import TodoList from './components/TodoList'
import { getTodos, createTodo } from './api/todoApi'

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => { load() }, [])

  async function load(){
    try{
      const data = await getTodos()
      setTodos(data)
    }catch(err){
      console.error(err)
      setTodos([])
    }
  }

  async function handleCreate(e){
    e.preventDefault()
    if (!title.trim()) return
    await createTodo({ title, description: '' })
    setTitle('')
    load()
  }

  return (
    <div className="app">
      <h1>ToDo</h1>
      <form onSubmit={handleCreate} className="new-form">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task title" />
        <button type="submit">Add</button>
      </form>
      <TodoList todos={todos} reload={load} />
    </div>
  )
}
