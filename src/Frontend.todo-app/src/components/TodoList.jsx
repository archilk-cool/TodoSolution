
import React from 'react'
import TodoItemEditor from './TodoItemEditor'
import { updateTodo, deleteTodo } from '../api/todoApi'

export default function TodoList({ todos, reload }) {
  async function toggle(item){
    await updateTodo(item.id, { ...item, isCompleted: !item.isCompleted })
    reload()
  }

  async function remove(id){
    await deleteTodo(id)
    reload()
  }

  return (
    <div className="todo-list">
      {todos.length === 0 && <div className="empty">No tasks yet</div>}
      {todos.map(t => (
        <div className="todo-row" key={t.id}>
          <input type="checkbox" checked={t.isCompleted} onChange={() => toggle(t)} />
          <div className="todo-main">
            <div className={t.isCompleted ? 'title done' : 'title'}>{t.title}</div>
            {t.description && <div className="desc">{t.description}</div>}
          </div>
          <div className="actions">
            <TodoItemEditor todo={t} onSaved={reload} />
            <button className="btn del" onClick={() => remove(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
