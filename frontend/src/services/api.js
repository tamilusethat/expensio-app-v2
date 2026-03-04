// Offline-first API — uses localStorage on mobile (Capacitor), real API in browser
import axios from 'axios'

const STORAGE_KEY = 'expensio_expenses'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
function saveLocal(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function isMobile() {
  if (typeof window === 'undefined') return false
  return (
    window.Capacitor !== undefined ||
    window.location.protocol === 'capacitor:' ||
    window.location.href.startsWith('capacitor://') ||
    window.location.protocol === 'file:'
  )
}

// ── Local (mobile) ────────────────────────────────────────────────────────────
function localGetExpenses(params = {}) {
  let data = loadLocal()
  if (params.category && params.category !== 'all')
    data = data.filter(e => e.category === params.category)
  data.sort((a, b) => new Date(b.date) - new Date(a.date))
  return { data: { success: true, data, pagination: { total: data.length } } }
}

function localGetSummary() {
  const all = loadLocal()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const monthly = all.filter(e => new Date(e.date) >= startOfMonth)
  const weekly  = all.filter(e => new Date(e.date) >= startOfWeek)
  const byCat = {}
  all.forEach(e => {
    if (!byCat[e.category]) byCat[e.category] = { total: 0, count: 0 }
    byCat[e.category].total += e.amount
    byCat[e.category].count += 1
  })
  return { data: { success: true, data: {
    overall:    { total: all.reduce((s,e)=>s+e.amount,0),     count: all.length },
    monthly:    { total: monthly.reduce((s,e)=>s+e.amount,0), count: monthly.length },
    weekly:     { total: weekly.reduce((s,e)=>s+e.amount,0),  count: weekly.length },
    byCategory: Object.entries(byCat).map(([category,v])=>({category,...v})).sort((a,b)=>b.total-a.total),
  }}}
}

function localAdd(data) {
  const all = loadLocal()
  const n = { ...data, _id: makeId(), createdAt: new Date().toISOString() }
  all.unshift(n); saveLocal(all)
  return { data: { success: true, data: n, message: 'Expense added!' } }
}

function localUpdate(id, data) {
  const all = loadLocal()
  const i = all.findIndex(e => e._id === id)
  if (i === -1) throw new Error('Not found')
  all[i] = { ...all[i], ...data }; saveLocal(all)
  return { data: { success: true, data: all[i], message: 'Updated!' } }
}

function localDelete(id) {
  saveLocal(loadLocal().filter(e => e._id !== id))
  return { data: { success: true, message: 'Deleted!' } }
}

function localClear() {
  saveLocal([])
  return { data: { success: true, message: 'Cleared!' } }
}

// ── Remote (browser with backend) ────────────────────────────────────────────
const http = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

const USE_LOCAL = isMobile()
console.log('Running mode:', USE_LOCAL ? '📱 Mobile (offline)' : '🌐 Browser (backend)')

export const getExpenses      = (p)    => Promise.resolve(USE_LOCAL ? localGetExpenses(p)  : http.get('/expenses', { params: p }))
export const getSummary       = ()     => Promise.resolve(USE_LOCAL ? localGetSummary()     : http.get('/expenses/summary'))
export const addExpense       = (d)    => Promise.resolve(USE_LOCAL ? localAdd(d)           : http.post('/expenses', d))
export const updateExpense    = (id,d) => Promise.resolve(USE_LOCAL ? localUpdate(id,d)     : http.put(`/expenses/${id}`, d))
export const deleteExpense    = (id)   => Promise.resolve(USE_LOCAL ? localDelete(id)       : http.delete(`/expenses/${id}`))
export const clearAllExpenses = ()     => Promise.resolve(USE_LOCAL ? localClear()          : http.delete('/expenses'))
export default http
