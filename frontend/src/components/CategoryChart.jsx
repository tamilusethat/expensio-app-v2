import { getCategoryInfo, formatCurrency } from '../utils/categories'

export default function CategoryChart({ summary, loading }) {
  if (loading) return (
    <div className="card h-100">
      <div className="card-body p-4">
        <div className="placeholder-glow">
          <span className="placeholder col-5 mb-4 d-block" style={{ height: 24 }}></span>
          {[...Array(5)].map((_, i) => <span key={i} className="placeholder col-12 mb-3 d-block" style={{ height: 16 }}></span>)}
        </div>
      </div>
    </div>
  )

  const byCategory = summary?.byCategory || []
  const total = byCategory.reduce((s, c) => s + c.total, 0)

  return (
    <div className="card h-100">
      <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
        <h6 className="font-heading fw-bold mb-0">
          <i className="bi bi-pie-chart me-2 text-primary"></i>By Category
        </h6>
      </div>
      <div className="card-body p-4">
        {byCategory.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-bar-chart" style={{ fontSize: '2.5rem', opacity: .25 }}></i>
            <p className="small mt-2 mb-0">No data yet</p>
          </div>
        ) : (
          <div>
            {byCategory.map((item, i) => {
              const cat = getCategoryInfo(item.category)
              const pct = total ? ((item.total / total) * 100).toFixed(1) : 0
              return (
                <div key={item.category} className="mb-3 animate-in" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-semibold">
                      {cat.icon} {cat.label}
                      <span className="text-muted fw-normal ms-1">({item.count})</span>
                    </span>
                    <span className="small fw-bold" style={{ color: cat.color }}>
                      {formatCurrency(item.total)}
                      <span className="text-muted fw-normal ms-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${pct}%`, background: cat.bar }}
                    />
                  </div>
                </div>
              )
            })}

            <hr className="my-3" />
            <div className="d-flex justify-content-between">
              <span className="small fw-semibold text-muted">Total</span>
              <span className="fw-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
