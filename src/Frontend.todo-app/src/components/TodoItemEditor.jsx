
import React, { useState } from 'react'
import { updateTodo } from '../api/todoApi'

export default function TodoItemEditor({ todo, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [desc, setDesc] = useState(todo.description || '')

  async function save(){
    await updateTodo(todo.id, { ...todo, title, description: desc })
    setEditing(false)
    onSaved()
  }

  if (!editing) return <button onClick={() => setEditing(true)}>Edit</button>

  return (
    <div className="editor">
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <input value={desc} onChange={e => setDesc(e.target.value)} />
      <button onClick={save}>Save</button>
      <button onClick={() => setEditing(false)}>Cancel</button>
    </div>
  )
}
