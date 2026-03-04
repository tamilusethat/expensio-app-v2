import { useState, useEffect } from 'react'
import { CATS, formatCur, formatDate } from '../utils/categories'
import { getExpenses } from '../services/api'

function getPeriodInfo(type, offset) {
  const now = new Date()
  let label = '', start = '', end = ''

  if (type === 'today') {
    const d = new Date(now); d.setDate(d.getDate() + offset)
    start = end = d.toISOString().split('T')[0]
    const dn = d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
    label = offset === 0 ? `Today — ${dn}` : dn
  } else if (type === 'week') {
    const ws = new Date(now); ws.setDate(now.getDate() - now.getDay() + offset * 7); ws.setHours(0,0,0,0)
    const we = new Date(ws); we.setDate(ws.getDate() + 6)
    start = ws.toISOString().split('T')[0]; end = we.toISOString().split('T')[0]
    const wl = offset === 0 ? 'This Week' : offset === -1 ? 'Last Week' : `${Math.abs(offset)} Weeks Ago`
    label = `${wl} (${ws.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – ${we.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })})`
  } else {
    const md = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    const me = new Date(md.getFullYear(), md.getMonth() + 1, 0)
    start = md.toISOString().split('T')[0]; end = me.toISOString().split('T')[0]
    const ml = offset === 0 ? 'This Month' : offset === -1 ? 'Last Month' : md.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    label = `${ml} — ${md.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`
  }
  return { label, start, end }
}

function downloadFile(name, type, content) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['\ufeff' + content], { type }))
  a.download = name; a.click()
}

export default function CardModal({ type, onClose, onGoAddForm }) {
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { label, start, end } = getPeriodInfo(type, offset)

  useEffect(() => {
    setLoading(true)
    getExpenses().then(res => {
      const all = res.data?.data || []
      setData(all.filter(e => e.date >= start && e.date <= end).sort((a, b) => new Date(b.date) - new Date(a.date)))
      setLoading(false)
    })
  }, [type, offset, start, end])

  const total = data.reduce((s, e) => s + e.amount, 0)

  const conf = {
    today: { ico: '📅', col: 'var(--ac)', lbl: 'Daily View' },
    week:  { ico: '📊', col: 'var(--pu)', lbl: 'Weekly View' },
    month: { ico: '💰', col: 'var(--gr)', lbl: 'Monthly View' },
  }[type]

  const doExport = fmt => {
    if (!data.length) { import('./Toast').then(m => m.toast('⚠️ No data', 'No expenses in this period.')); return }
    if (fmt === 'csv') {
      const rows = [['Date','Name','Category','Description','Amount'], ...data.map(e => [e.date, e.name, CATS[e.category]?.l || e.category, e.description || '', e.amount]), ['','','','Total', total]]
      downloadFile('expenses.csv', 'text/csv', rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n'))
    } else if (fmt === 'excel') {
      const rows = [['Date','Name','Category','Description','Amount'], ...data.map(e => [e.date, e.name, CATS[e.category]?.l || e.category, e.description || '', e.amount]), ['','','','Total', total]]
      downloadFile('expenses.xls', 'application/vnd.ms-excel', rows.map(r => r.join('\t')).join('\n'))
    } else {
      const w = window.open('', '_blank')
      w.document.write(`<!DOCTYPE html><html><head><title>Expense Report</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:sans-serif;padding:36px;color:#0e1520}.hd{display:flex;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #e3e8f2}.logo{font-size:1.2rem;font-weight:800;color:#2457e8}.logo span{color:#0e1520}.meta{text-align:right;font-size:.8rem;color:#8fa0b0;line-height:1.8}table{width:100%;border-collapse:collapse}th{padding:10px 12px;text-align:left;background:#f2f5fb;font-size:.72rem;text-transform:uppercase;letter-spacing:.07em;color:#8fa0b0;border-bottom:2px solid #e3e8f2}td{padding:10px 12px;border-bottom:1px solid #e3e8f2;font-size:.855rem;color:#526070}tr:last-child td{border-bottom:none}.chip{display:inline-flex;padding:2px 8px;border-radius:99px;font-size:.7rem;font-weight:700}.amt{font-family:monospace;font-weight:600;color:#0e1520}tfoot td{font-weight:800;background:#f2f5fb;border-top:2px solid #0e1520;padding:12px}.pbtn{display:inline-flex;padding:9px 18px;background:#2457e8;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;margin-bottom:20px;font-size:.855rem}@media print{.pbtn{display:none}}</style></head><body>
      <div class="hd"><div><div class="logo">💸 Expense<span>Tracker</span></div><div style="font-size:.78rem;color:#8fa0b0;margin-top:4px">Expense Report</div></div><div class="meta"><div><b>${label}</b></div><div>Generated: ${new Date().toLocaleString('en-IN')}</div><div>${data.length} expense${data.length !== 1 ? 's' : ''} · Total: <b>${formatCur(total)}</b></div></div></div>
      <button class="pbtn" onclick="window.print()">🖨 Print / Save as PDF</button>
      <table><thead><tr><th>Date</th><th>Name</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
      <tbody>${data.map(e => { const c = CATS[e.category] || CATS.other; return `<tr><td style="font-size:.8rem;white-space:nowrap">${formatDate(e.date)}</td><td style="font-weight:600;color:#0e1520">${e.name}</td><td><span class="chip" style="background:${c.bg};color:${c.c}">${c.i} ${c.l}</span></td><td>${e.description || '—'}</td><td class="amt">${formatCur(e.amount)}</td></tr>` }).join('')}</tbody>
      <tfoot><tr><td colspan="4" style="text-align:right">Grand Total</td><td class="amt">${formatCur(total)}</td></tr></tfoot></table></body></html>`)
      w.document.close()
    }
  }

  return (
    <div className="ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mod-box">
        {/* Header */}
        <div className="mod-hd">
          <div className="flex aic gap-3" style={{ flex: 1, minWidth: 200 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--acl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{conf.ico}</div>
            <div>
              <div style={{ fontSize: '.67rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--tx3)' }}>{conf.lbl}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--tx)', fontFamily: 'var(--fm)' }}>{formatCur(total)}</div>
            </div>
          </div>
          <div className="flex aic gap-2">
            <div className="pnav">
              <div className="pnarr" onClick={() => setOffset(o => o - 1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"/></svg>
              </div>
              <div className="pnlbl">{label}</div>
              <div className={`pnarr${offset >= 0 ? ' dis' : ''}`} onClick={() => setOffset(o => o + 1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
            <div className="ib" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mod-body">
          {loading ? <div className="empty-state"><p>Loading…</p></div>
          : !data.length ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p>No expenses for this period. Use ← to go back.</p>
              <button className="btn btn-p btn-sm" style={{ margin: '12px auto 0', display: 'flex' }} onClick={() => { onClose(); onGoAddForm() }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Expense
              </button>
            </div>
          ) : (
            <div className="twrap">
              <table>
                <thead><tr><th>Date</th><th>Name</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
                <tbody>
                  {data.map(e => { const c = CATS[e.category] || CATS.other; return (
                    <tr key={e._id}>
                      <td style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}>{formatDate(e.date)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--tx)' }}>{e.name}</td>
                      <td><span className="chip" style={{ background: c.bg, color: c.c }}>{c.i} {c.l}</span></td>
                      <td className="muted txt-sm">{e.description || '—'}</td>
                      <td className="mono-val">{formatCur(e.amount)}</td>
                    </tr>
                  )})}
                </tbody>
                <tfoot><tr><td colSpan={4} style={{ textAlign: 'right' }}>Total for this period</td><td className="mono-val">{formatCur(total)}</td></tr></tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mod-ft">
          <div className="txt-sm muted"><b style={{ color: 'var(--tx)' }}>{data.length}</b> expenses · Total: <b style={{ color: 'var(--tx)' }}>{formatCur(total)}</b></div>
          <div className="exp-row">
            <button className="exp-btn exp-csv" onClick={() => doExport('csv')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/></svg>CSV
            </button>
            <button className="exp-btn exp-xl" onClick={() => doExport('excel')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>Excel
            </button>
            <button className="exp-btn exp-pdf" onClick={() => doExport('pdf')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h1a2 2 0 010 4H9v-4z"/><path d="M14 13h2M14 17h2"/></svg>PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
