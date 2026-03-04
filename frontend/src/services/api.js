// Offline-first: uses localStorage on mobile (Capacitor), real API in browser with backend
import axios from 'axios'
import { mkid } from '../utils/categories'

const STORAGE_KEY = 'expensio_v3_data'

/* ── Local storage helpers ─────────────────────────────────────────── */
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const persist = d => localStorage.setItem(STORAGE_KEY, JSON.stringify(d))

/* ── Detect mobile (Capacitor) ─────────────────────────────────────── */
const isMobile = () =>
  typeof window !== 'undefined' && (
    typeof window.Capacitor !== 'undefined' ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'file:'
  )

/* ── Local implementations ─────────────────────────────────────────── */
const local = {
  getExpenses(params = {}) {
    let data = load()
    if (params.category && params.category !== 'all') data = data.filter(e => e.category === params.category)
    data.sort((a, b) => new Date(b.date) - new Date(a.date))
    return { data: { success: true, data, pagination: { total: data.length } } }
  },
  getSummary() {
    const all = load()
    const now = new Date(), td = new Date().toISOString().split('T')[0]
    const wStart = new Date(now); wStart.setDate(now.getDate() - now.getDay()); wStart.setHours(0,0,0,0)
    const mStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const todayExp    = all.filter(e => e.date === td)
    const weeklyExp   = all.filter(e => new Date(e.date + 'T12:00:00') >= wStart)
    const monthlyExp  = all.filter(e => new Date(e.date + 'T12:00:00') >= mStart)
    const sum = arr => arr.reduce((s, e) => s + e.amount, 0)
    const byCat = {}
    monthlyExp.forEach(e => { if (!byCat[e.category]) byCat[e.category] = { total: 0, count: 0 }; byCat[e.category].total += e.amount; byCat[e.category].count++ })
    return { data: { success: true, data: {
      today:   { total: sum(todayExp),   count: todayExp.length },
      weekly:  { total: sum(weeklyExp),  count: weeklyExp.length },
      monthly: { total: sum(monthlyExp), count: monthlyExp.length },
      byCategory: Object.entries(byCat).map(([category, v]) => ({ category, ...v })).sort((a, b) => b.total - a.total),
    }}}
  },
  addExpense(body) {
    const all = load()
    const e = { ...body, _id: mkid(), createdAt: new Date().toISOString() }
    all.unshift(e); persist(all)
    return { data: { success: true, data: e } }
  },
  updateExpense(id, body) {
    const all = load(); const i = all.findIndex(e => e._id === id)
    if (i === -1) throw new Error('Not found')
    all[i] = { ...all[i], ...body }; persist(all)
    return { data: { success: true, data: all[i] } }
  },
  deleteExpense(id) {
    persist(load().filter(e => e._id !== id))
    return { data: { success: true } }
  },
  clearAll() { persist([]); return { data: { success: true } } },
  getRange(start, end) {
    const all = load()
    const data = all.filter(e => e.date >= start && e.date <= end)
    return { data: { success: true, data } }
  }
}

/* ── Remote (axios) implementations ────────────────────────────────── */
const http = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

const USE_LOCAL = isMobile()
console.log('Mode:', USE_LOCAL ? '📱 Mobile/Offline' : '🌐 Browser+Backend')

export const getExpenses   = p      => Promise.resolve(USE_LOCAL ? local.getExpenses(p)    : http.get('/expenses', { params: p }))
export const getSummary    = ()     => Promise.resolve(USE_LOCAL ? local.getSummary()       : http.get('/expenses/summary'))
export const addExpense    = d      => Promise.resolve(USE_LOCAL ? local.addExpense(d)      : http.post('/expenses', d))
export const updateExpense = (id,d) => Promise.resolve(USE_LOCAL ? local.updateExpense(id,d): http.put(`/expenses/${id}`, d))
export const deleteExpense = id     => Promise.resolve(USE_LOCAL ? local.deleteExpense(id)  : http.delete(`/expenses/${id}`))
export const clearAll      = ()     => Promise.resolve(USE_LOCAL ? local.clearAll()         : http.delete('/expenses'))
export const getRange      = (s,e)  => Promise.resolve(USE_LOCAL ? local.getRange(s,e)     : http.get('/expenses', { params: { from: s, to: e } }))

export default http
