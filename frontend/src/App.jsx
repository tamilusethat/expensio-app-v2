import { useState, useEffect, useCallback } from 'react'
import Topnav from './components/Topnav'
import Sidebar from './components/Sidebar'
import AddExpenseForm from './components/AddExpenseForm'
import StatCards from './components/StatCards'
import Breakdown from './components/Breakdown'
import CardModal from './components/CardModal'
import HistoryPage from './components/HistoryPage'
import RemindersPage, { useReminders } from './components/RemindersPage'
import ToastStack, { toast } from './components/Toast'
import { getSummary } from './services/api'

const REM_KEY = 'expensio_v3_rems'
const loadRems = () => { try { return JSON.parse(localStorage.getItem(REM_KEY) || '[]') } catch { return [] } }

export default function App() {
  const [theme, setThemeState] = useState(() => localStorage.getItem('expensio_v3_theme') || 'light')
  const [page, setPage] = useState('dashboard')
  const [summary, setSummary] = useState(null)
  const [cardModal, setCardModal] = useState(null) // 'today' | 'week' | 'month' | null
  const [showUserModal, setShowUserModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Apply theme
  useEffect(() => {
    const apply = t => {
      if (t === 'system') {
        document.documentElement.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light')
      } else {
        document.documentElement.setAttribute('data-theme', t)
      }
    }
    apply(theme)
    localStorage.setItem('expensio_v3_theme', theme)
  }, [theme])

  const setTheme = t => setThemeState(t)

  // Load summary
  const loadSummary = useCallback(() => {
    getSummary().then(r => setSummary(r.data?.data || null)).catch(() => {})
  }, [])

  useEffect(() => { if (page === 'dashboard') loadSummary() }, [page, loadSummary, refreshKey])

  const onAdded = () => { setRefreshKey(k => k + 1) }

  // Reminder fires
  const onReminderFire = useCallback(r => {
    toast(`⏰ ${r.label}`, 'Time to log your expenses!', true, () => setPage('dashboard'))
  }, [])
  useReminders(onReminderFire)

  const testReminder = () => toast('⏰ Daily Reminder', "Time to log today's expenses!", true, () => setPage('dashboard'))

  const remCount = loadRems().filter(r => r.enabled).length

  const monthLabel = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="app-shell">
      <Topnav theme={theme} setTheme={setTheme} onUserSwitch={() => setShowUserModal(true)} onTestReminder={testReminder}/>
      <div className="app-body">
        <Sidebar page={page} setPage={setPage} remCount={remCount}/>
        <main className="app-content">

          {/* DASHBOARD */}
          {page === 'dashboard' && (
            <div>
              <div className="pg-title">Dashboard</div>
              <div className="pg-sub">Track and manage your spending in one place.</div>

              {/* ① Form FIRST */}
              <AddExpenseForm onAdded={onAdded}/>

              {/* ② Stat Cards */}
              <StatCards summary={summary} onCardClick={setCardModal}/>

              {/* ③ Breakdown */}
              <Breakdown byCategory={summary?.byCategory} monthLabel={monthLabel}/>
            </div>
          )}

          {/* HISTORY */}
          {page === 'history' && <HistoryPage key={refreshKey}/>}

          {/* REMINDERS */}
          {page === 'reminders' && <RemindersPage onGoAddForm={() => setPage('dashboard')}/>}

        </main>
      </div>

      {/* Card detail modal */}
      {cardModal && (
        <CardModal type={cardModal} onClose={() => setCardModal(null)} onGoAddForm={() => { setCardModal(null); setPage('dashboard') }}/>
      )}

      {/* User switch modal */}
      {showUserModal && (
        <div className="sm-ov" onClick={e => e.target === e.currentTarget && setShowUserModal(false)}>
          <div className="sm-box">
            <div className="sm-hd">
              <span className="sm-title">Switch User</span>
              <div className="ib" onClick={() => setShowUserModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, borderRadius: 'var(--rs)', border: '2px solid var(--ac)', background: 'var(--acl)' }}>
                <div className="ava" style={{ fontSize: '.7rem' }}>TU</div>
                <div><div className="bold txt-sm">Tamil User</div><div className="txt-xs muted">Active · Personal</div></div>
                <div className="ml-auto" style={{ color: 'var(--ac)', fontWeight: 800 }}>✓</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, borderRadius: 'var(--rs)', border: '1.5px dashed var(--bdr)', cursor: 'pointer' }}
                onClick={() => toast('Coming soon!', 'Multi-user support is in the next update.')}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sur3)', border: '2px dashed var(--bdr2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)', fontSize: '1rem' }}>+</div>
                <div className="bold txt-sm muted">Add Account</div>
              </div>
            </div>
            <div className="sm-ft"><button className="btn btn-g" onClick={() => setShowUserModal(false)}>Close</button></div>
          </div>
        </div>
      )}

      <ToastStack/>
    </div>
  )
}
