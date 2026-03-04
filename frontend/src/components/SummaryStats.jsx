import { formatCurrency } from '../utils/categories'

const StatCard = ({ icon, label, value, bg, textColor, statBg }) => (
  <div className={`card stat-card h-100 ${bg}`}>
    <div className="card-body p-3 p-md-4">
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <p className={`text-uppercase fw-semibold mb-1 ${textColor}`} style={{ fontSize: '.7rem', letterSpacing: '.08em', opacity: .75 }}>{label}</p>
          <h3 className={`fw-bold mb-0 font-heading ${textColor}`} style={{ fontSize: '1.4rem' }}>{value}</h3>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(255,255,255,.2)' }}>
          <i className={`bi ${icon} ${textColor}`}></i>
        </div>
      </div>
      <div className="stat-bg">{statBg}</div>
    </div>
  </div>
)

export default function SummaryStats({ summary, loading }) {
  if (loading) return (
    <div className="row g-3 mb-4">
      {[...Array(4)].map((_, i) => (
        <div className="col-6 col-md-3" key={i}>
          <div className="card h-100"><div className="card-body p-4 placeholder-glow"><span className="placeholder col-8 mb-2 d-block"></span><span className="placeholder col-5 d-block" style={{height:32}}></span></div></div>
        </div>
      ))}
    </div>
  )

  const { overall = {}, monthly = {}, weekly = {} } = summary || {}

  return (
    <div className="row g-3 mb-4 animate-in">
      <div className="col-6 col-md-3">
        <StatCard icon="bi-receipt-cutoff" label="Total Expenses" value={formatCurrency(overall.total || 0)} bg="bg-primary" textColor="text-white" statBg="💸" />
      </div>
      <div className="col-6 col-md-3">
        <StatCard icon="bi-calendar-month" label="This Month" value={formatCurrency(monthly.total || 0)} bg="" textColor="" statBg="📅" />
      </div>
      <div className="col-6 col-md-3">
        <StatCard icon="bi-graph-up-arrow" label="This Week" value={formatCurrency(weekly.total || 0)} bg="" textColor="" statBg="📈" />
      </div>
      <div className="col-6 col-md-3">
        <StatCard icon="bi-list-ol" label="Total Entries" value={overall.count || 0} bg="" textColor="" statBg="🧾" />
      </div>
    </div>
  )
}
