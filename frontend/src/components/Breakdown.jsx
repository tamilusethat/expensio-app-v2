import { CATS, formatCur } from '../utils/categories'

export default function Breakdown({ byCategory, monthLabel }) {
  const total = byCategory?.reduce((s, c) => s + c.total, 0) || 0

  return (
    <div className="card">
      <div className="card-hd">
        <span className="card-title">Monthly Breakdown</span>
        <span className="txt-xs muted">{monthLabel}</span>
      </div>
      <div className="card-bd">
        {!byCategory?.length ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z"/></svg>
            <p>No expenses this month yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {byCategory.map(({ category, total: amt }) => {
              const c = CATS[category] || CATS.other
              const pct = total > 0 ? (amt / total * 100).toFixed(1) : 0
              return (
                <div key={category}>
                  <div className="flex jsb aic" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{c.i} {c.l}</span>
                    <span style={{ fontFamily: 'var(--fm)', fontSize: '.82rem', fontWeight: 500, color: c.c }}>
                      {formatCur(amt)} <span style={{ color: 'var(--tx3)', fontSize: '.7rem' }}>{pct}%</span>
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'var(--sur3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: c.c, borderRadius: 99, transition: 'width .5s ease' }}/>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
