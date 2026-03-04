import { useState } from 'react'
import { catOptions, todayStr } from '../utils/categories'
import { addExpense } from '../services/api'
import { toast } from './Toast'
import { formatCur } from '../utils/categories'

export default function AddExpenseForm({ onAdded }) {
  const [f, setF] = useState({ name: '', amount: '', category: 'food', date: todayStr(), description: '' })
  const [loading, setLoading] = useState(false)

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    if (!f.name.trim()) { toast('⚠️ Missing field', 'Please enter an expense name.'); return }
    if (!f.amount || Number(f.amount) <= 0) { toast('⚠️ Invalid amount', 'Enter a valid amount greater than 0.'); return }
    setLoading(true)
    try {
      await addExpense({ name: f.name.trim(), amount: Number(f.amount), category: f.category, date: f.date || todayStr(), description: f.description.trim() })
      toast('✅ Expense Added', `${f.name} — ${formatCur(Number(f.amount))} saved.`)
      setF({ name: '', amount: '', category: 'food', date: todayStr(), description: '' })
      onAdded()
    } catch { toast('❌ Error', 'Failed to save expense.') }
    setLoading(false)
  }

  return (
    <div className="fcard">
      <div className="ftitle"><span>➕</span> Add New Expense</div>
      <div className="fg4" style={{ marginBottom: 12 }}>
        <div className="fi">
          <label className="fl">Expense Name *</label>
          <input className="finp" value={f.name} onChange={set('name')} placeholder="e.g. Groceries, Fuel…"/>
        </div>
        <div className="fi">
          <label className="fl">Amount (₹) *</label>
          <input className="finp" type="number" value={f.amount} onChange={set('amount')} placeholder="0.00" min="0.01" step="0.01"/>
        </div>
        <div className="fi">
          <label className="fl">Category</label>
          <select className="finp finp-sel" value={f.category} onChange={set('category')}>
            {catOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="fi">
          <label className="fl">Date</label>
          <input className="finp" type="date" value={f.date} onChange={set('date')}/>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div className="fi">
          <label className="fl">Description (optional)</label>
          <input className="finp" value={f.description} onChange={set('description')} placeholder="Add a note…"/>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-p" onClick={submit} disabled={loading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {loading ? 'Saving…' : 'Add Expense'}
        </button>
        <button className="btn btn-g" onClick={() => setF({ name: '', amount: '', category: 'food', date: todayStr(), description: '' })}>Clear</button>
      </div>
    </div>
  )
}
