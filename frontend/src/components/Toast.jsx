import { useState, useEffect, useCallback } from 'react'

let addToastFn = null
export const toast = (title, body, clickable = false, cb = null) => {
  if (addToastFn) addToastFn({ title, body, clickable, cb, id: Date.now() + Math.random() })
}

export default function ToastStack() {
  const [toasts, setToasts] = useState([])
  useEffect(() => { addToastFn = t => setToasts(p => [...p, t]) }, [])
  const remove = useCallback(id => {
    setToasts(p => p.map(t => t.id === id ? { ...t, dying: true } : t))
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 250)
  }, [])
  useEffect(() => {
    toasts.forEach(t => { if (!t.timer) { t.timer = setTimeout(() => remove(t.id), 5500) } })
  }, [toasts, remove])

  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item${t.dying ? ' dying' : ''}`}
          onClick={() => { if (t.clickable && t.cb) { t.cb(); remove(t.id) } }}>
          <div className="t-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-title">{t.title}</div>
            <div className="t-body">{t.body}</div>
            {t.clickable && <div className="t-cta">Tap to add expense →</div>}
          </div>
          <button className="t-x" onClick={e => { e.stopPropagation(); remove(t.id) }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
