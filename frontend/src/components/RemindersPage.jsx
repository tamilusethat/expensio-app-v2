import { useState, useEffect } from 'react'
import { toast } from './Toast'
import { mkid } from '../utils/categories'

const REM_KEY = 'expensio_v3_rems'
const loadRems = () => { try { return JSON.parse(localStorage.getItem(REM_KEY) || '[]') } catch { return [] } }
const saveRems = r => localStorage.setItem(REM_KEY, JSON.stringify(r))

export function useReminders(onFire) {
  const [rems, setRems] = useState(loadRems)
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date()
      const hm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      rems.filter(r => r.enabled && r.time === hm).forEach(r => onFire(r))
    }, 60000)
    return () => clearInterval(t)
  }, [rems, onFire])
  const update = r => { saveRems(r); setRems(r) }
  return { rems, update }
}

export default function RemindersPage({ onGoAddForm }) {
  const [rems, setRemsState] = useState(loadRems)
  const [time, setTime] = useState('09:00')
  const [label, setLabel] = useState('')

  const save = r => { saveRems(r); setRemsState(r) }

  const add = () => {
    if (!time) { toast('⚠️ Missing time', 'Please select a time.'); return }
    const r = [...rems, { id: mkid(), time, label: label.trim() || 'Expense Reminder', enabled: true }]
    save(r); setTime('09:00'); setLabel('')
    toast('⏰ Reminder Set', `Daily reminder at ${time}.`)
  }

  const toggle = (id, v) => save(rems.map(r => r.id === id ? { ...r, enabled: v } : r))
  const del = id => save(rems.filter(r => r.id !== id))
  const edit = id => {
    const r = rems.find(x => x.id === id); if (!r) return
    setTime(r.time); setLabel(r.label); save(rems.filter(x => x.id !== id))
  }

  return (
    <div>
      <div className="pg-title">Reminders</div>
      <div className="pg-sub">Set daily reminders to stay on top of logging expenses.</div>
      <div className="two-col">
        <div>
          <div className="card mb-4">
            <div className="card-hd"><span className="card-title">Add Reminder</span></div>
            <div className="card-bd">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div className="fg2">
                  <div className="fi"><label className="fl">Time</label><input className="finp" type="time" value={time} onChange={e => setTime(e.target.value)}/></div>
                  <div className="fi"><label className="fl">Label</label><input className="finp" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Morning log"/></div>
                </div>
                <button className="btn btn-p" onClick={add}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rems.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <p>No reminders set yet</p>
              </div>
            ) : rems.map(r => (
              <div key={r.id} className="rem-card">
                <div><div className="rem-time">{r.time}</div><div className="rem-lbl">{r.label}</div></div>
                <div className="flex gap-2 aic ml-auto">
                  <label className="tog">
                    <input type="checkbox" checked={r.enabled} onChange={e => toggle(r.id, e.target.checked)}/>
                    <span className="tog-sli"/>
                  </label>
                  <button className="btn btn-g btn-xs" onClick={() => edit(r.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14h16v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></svg>
                  </button>
                  <button className="btn btn-d btn-xs" onClick={() => del(r.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><span className="card-title">How It Works</span></div>
          <div className="card-bd">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { n: 1, col: 'var(--ac)', bg: 'var(--acl)', title: 'Set your time', desc: 'Choose when you want to be nudged each day.' },
                { n: 2, col: 'var(--pu)', bg: 'var(--pul)', title: 'Notification fires', desc: 'A toast popup appears at your scheduled time.' },
                { n: 3, col: 'var(--gr)', bg: 'var(--grl)', title: 'Click → log instantly', desc: 'The notification opens the Add Expense form automatically.' },
              ].map(s => (
                <div key={s.n} className="flex gap-3">
                  <div className="step-circle" style={{ background: s.bg, color: s.col }}>{s.n}</div>
                  <div>
                    <div className="bold txt-sm">{s.title}</div>
                    <div className="txt-xs muted mt-3">{s.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--acl)', borderRadius: 'var(--rs)', padding: '11px 13px', fontSize: '.77rem', color: 'var(--ac)', fontWeight: 600 }}>
                💡 Click the 🔔 bell icon in the top bar to preview a reminder notification right now!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
