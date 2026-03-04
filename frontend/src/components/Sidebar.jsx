export default function Sidebar({ page, setPage, remCount }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: 'history',   label: 'All Expenses', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16h16V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: 'reminders', label: 'Reminders', badge: remCount, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  ]
  return (
    <aside className="sidebar">
      <div className="snav">
        <span className="snlbl">Navigation</span>
        {nav.map(n => (
          <button key={n.id} className={`sni${page === n.id ? ' active' : ''}`} onClick={() => setPage(n.id)}>
            {n.icon}{n.label}
            {n.badge > 0 && <span className="snbadge">{n.badge}</span>}
          </button>
        ))}
      </div>
      <div className="s-user">
        <div className="s-ucard">
          <div className="ava" style={{ fontSize: '.7rem' }}>TU</div>
          <div><div className="s-uname">Tamil User</div><div className="s-urole">Personal</div></div>
        </div>
      </div>
    </aside>
  )
}
