
const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:7295'

async function request(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if (!res.ok) {
    const txt = await res.text().catch(()=>null)
    throw new Error(txt || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

export const getTodos = () => request('/api/v1/todo')
export const getArchivedTodos = () => request('/api/v1/todo/archived')
export const createTodo = todo => request('/api/v1/todo', { method: 'POST', body: JSON.stringify(todo) })
export const updateTodo = (id, todo) => request(`/api/v1/todo/${id}`, { method: 'PUT', body: JSON.stringify(todo) })
export const deleteTodo = id => request(`/api/v1/todo/${id}`, { method: 'DELETE' })
export const archiveTodo = id => request(`/api/v1/todo/${id}/archive`, { method: 'POST' })
export const restoreTodo = id => request(`/api/v1/todo/${id}/restore`, { method: 'POST' })
