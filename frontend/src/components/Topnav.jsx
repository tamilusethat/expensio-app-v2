import { useState, useRef, useEffect } from 'react'

export default function Topnav({ theme, setTheme, onUserSwitch, onTestReminder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const themes = [{ id: 'light', label: '☀️ Light' }, { id: 'dark', label: '🌙 Dark' }, { id: 'system', label: '💻 Auto' }]

  return (
    <nav className="topnav">
      <div className="flex gap-2 aic">
        <div className="dd-wrap" ref={ref}>
          <div className="ib" onClick={() => setOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
          {open && (
            <div className="dd">
              <div className="dd-lbl">Account</div>
              <div className="dd-item" onClick={() => { onUserSwitch(); setOpen(false) }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                Switch User
              </div>
              <div className="dd-sep"/>
              <div className="dd-lbl">Theme</div>
              <div className="theme-row">
                {themes.map(t => (
                  <button key={t.id} className={`th-btn${theme === t.id ? ' active' : ''}`}
                    onClick={() => { setTheme(t.id); setOpen(false) }}>{t.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="nav-brand">💸 Expense<b>Tracker</b></div>
      </div>
      <div className="flex gap-2 aic">
        <div className="ib" title="Test reminder" onClick={onTestReminder}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </div>
        <div className="ava" onClick={onUserSwitch}>TU</div>
      </div>
    </nav>
  )
}
