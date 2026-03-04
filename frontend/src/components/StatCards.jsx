import { formatCur } from '../utils/categories'

export default function StatCards({ summary, onCardClick }) {
  const cards = [
    {
      id: 'today', label: "Today's Expenses",
      val: summary?.today?.total ?? 0, count: summary?.today?.count ?? 0,
      color: 'var(--ac)', bg: 'var(--acl)',
      cta: '→ Click to view & navigate days',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.9"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    },
    {
      id: 'week', label: "This Week's Expenses",
      val: summary?.weekly?.total ?? 0, count: summary?.weekly?.count ?? 0,
      color: 'var(--pu)', bg: 'var(--pul)',
      cta: '→ Click to view & navigate weeks',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--pu)" strokeWidth="1.9"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    },
    {
      id: 'month', label: "This Month's Expenses",
      val: summary?.monthly?.total ?? 0, count: summary?.monthly?.count ?? 0,
      color: 'var(--gr)', bg: 'var(--grl)',
      cta: '→ Click to view & navigate months',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--gr)" strokeWidth="1.9"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg>
    },
  ]

  return (
    <div className="sgrid">
      {cards.map(c => (
        <div key={c.id} className="sc" onClick={() => onCardClick(c.id)}
          style={{ borderColor: c.color }}>
          <div className="sc-bg" style={{ background: c.color }}/>
          <div className="sc-ico" style={{ background: c.bg }}>{c.icon}</div>
          <div className="sc-lbl">{c.label}</div>
          <div className="sc-val">{formatCur(c.val)}</div>
          <div className="sc-sub">{c.count} entr{c.count === 1 ? 'y' : 'ies'}</div>
          <div className="sc-cta" style={{ color: c.color }}>{c.cta}</div>
        </div>
      ))}
    </div>
  )
}
