import { useState, useEffect } from 'react'
import { CATS, formatCur, formatDate, catOptions } from '../utils/categories'
import { getExpenses, updateExpense, deleteExpense, clearAll } from '../services/api'
import { toast } from './Toast'

function EditModal({ expense, onClose, onSaved }) {
  const [f, setF] = useState({ name: expense.name, amount: expense.amount, category: expense.category, date: expense.date, description: expense.description || '' })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const save = async () => {
    try {
      await updateExpense(expense._id, { ...f, amount: Number(f.amount) })
      toast('✅ Updated', 'Expense updated.'); onSaved()
    } catch { toast('❌ Error', 'Update failed.') }
  }
  return (
    <div className="sm-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sm-box">
        <div className="sm-hd">
          <span className="sm-title">Edit Expense</span>
          <div className="ib" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="fg2">
            <div className="fi"><label className="fl">Name</label><input className="finp" value={f.name} onChange={set('name')}/></div>
            <div className="fi"><label className="fl">Amount (₹)</label><input className="finp" type="number" value={f.amount} onChange={set('amount')}/></div>
          </div>
          <div className="fg2">
            <div className="fi"><label className="fl">Category</label>
              <select className="finp finp-sel" value={f.category} onChange={set('category')}>
                {catOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="fi"><label className="fl">Date</label><input className="finp" type="date" value={f.date} onChange={set('date')}/></div>
          </div>
          <div className="fi"><label className="fl">Description</label><input className="finp" value={f.description} onChange={set('description')}/></div>
        </div>
        <div className="sm-ft">
          <button className="btn btn-g" onClick={onClose}>Cancel</button>
          <button className="btn btn-p" onClick={save}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [expenses, setExpenses] = useState([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [sort, setSort] = useState('date-d')
  const [editing, setEditing] = useState(null)

  const load = () => getExpenses().then(r => setExpenses(r.data?.data || []))
  useEffect(() => { load() }, [])

  const del = async id => {
    if (!confirm('Delete this expense?')) return
    await deleteExpense(id); toast('🗑 Deleted', 'Expense removed.'); load()
  }
  const clrAll = async () => {
    if (!confirm('Clear ALL expenses? Cannot be undone.')) return
    await clearAll(); toast('🗑 Cleared', 'All expenses removed.'); load()
  }

  let data = [...expenses]
  if (search) data = data.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || (e.description || '').toLowerCase().includes(search.toLowerCase()))
  if (cat) data = data.filter(e => e.category === cat)
  const [sf, sd] = sort.split('-')
  data.sort((a, b) => { const v = sf === 'amt' ? a.amount - b.amount : sf === 'name' ? a.name.localeCompare(b.name) : new Date(a.date) - new Date(b.date); return sd === 'd' ? -v : v })

  return (
    <div>
      {editing && <EditModal expense={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }}/>}
      <div className="pg-title">All Expenses</div>
      <div className="pg-sub">Full history — search, filter and manage all records.</div>
      <div className="card">
        <div className="card-bd">
          <div className="flex gap-2 aic mb-4" style={{ flexWrap: 'wrap' }}>
            <div className="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="search-inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or description…"/>
            </div>
            <select className="sel-sm" value={cat} onChange={e => setCat(e.target.value)}>
              <option value="">All Categories</option>
              {catOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select className="sel-sm" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="date-d">Newest First</option>
              <option value="date-a">Oldest First</option>
              <option value="amt-d">Highest Amount</option>
              <option value="amt-a">Lowest Amount</option>
              <option value="name-a">Name A–Z</option>
            </select>
            <button className="btn btn-d btn-sm ml-auto" onClick={clrAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              Clear All
            </button>
          </div>
          <div className="twrap">
            <table>
              <thead><tr>
                <th onClick={() => setSort(s => s === 'date-d' ? 'date-a' : 'date-d')}>Date ↕</th>
                <th onClick={() => setSort(s => s === 'name-a' ? 'name-d' : 'name-a')}>Name ↕</th>
                <th>Category</th>
                <th>Description</th>
                <th onClick={() => setSort(s => s === 'amt-d' ? 'amt-a' : 'amt-d')}>Amount ↕</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {data.map(e => { const c = CATS[e.category] || CATS.other; return (
                  <tr key={e._id}>
                    <td style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}>{formatDate(e.date)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--tx)' }}>{e.name}</td>
                    <td><span className="chip" style={{ background: c.bg, color: c.c }}>{c.i} {c.l}</span></td>
                    <td className="muted txt-sm">{e.description || '—'}</td>
                    <td className="mono-val">{formatCur(e.amount)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-g btn-xs" onClick={() => setEditing(e)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14h16v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></svg>
                        </button>
                        <button className="btn btn-d btn-xs" onClick={() => del(e._id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
            {!data.length && (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p>No expenses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
