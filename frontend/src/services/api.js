import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Expenses ──────────────────────────────────────────────────────────────────
export const getExpenses = (params = {}) => api.get('/expenses', { params })
export const getSummary  = ()             => api.get('/expenses/summary')
export const addExpense  = (data)         => api.post('/expenses', data)
export const updateExpense = (id, data)   => api.put(`/expenses/${id}`, data)
export const deleteExpense = (id)         => api.delete(`/expenses/${id}`)
export const clearAllExpenses = ()        => api.delete('/expenses')

export default api
