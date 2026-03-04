import { getCategoryInfo, formatCurrency, formatDate } from '../utils/categories'

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  if (loading) return (
    <div className="loading-overlay">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '2.5rem', height: '2.5rem' }}></div>
        <p className="text-muted small">Loading expenses...</p>
      </div>
    </div>
  )

  if (!expenses.length) return (
    <div className="empty-state">
      <div className="empty-icon">💸</div>
      <h5 className="fw-semibold text-muted mb-2">No expenses yet</h5>
      <p className="text-muted small mb-0">Click "Add Expense" to record your first entry.</p>
    </div>
  )

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="fw-semibold small text-uppercase text-muted ps-4" style={{ letterSpacing: '.06em' }}>Description</th>
            <th className="fw-semibold small text-uppercase text-muted hide-mobile" style={{ letterSpacing: '.06em' }}>Category</th>
            <th className="fw-semibold small text-uppercase text-muted hide-mobile" style={{ letterSpacing: '.06em' }}>Date</th>
            <th className="fw-semibold small text-uppercase text-muted text-end" style={{ letterSpacing: '.06em' }}>Amount</th>
            <th className="fw-semibold small text-uppercase text-muted text-center" style={{ letterSpacing: '.06em' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, i) => {
            const cat = getCategoryInfo(expense.category)
            return (
              <tr key={expense._id} className="expense-row animate-in" style={{ animationDelay: `${i * 0.04}s` }}>
                <td className="ps-4">
                  <div className="fw-semibold">{expense.name}</div>
                  {expense.note && <div className="text-muted small">{expense.note}</div>}
                  {/* Show category & date inline on mobile */}
                  <div className="d-sm-none mt-1">
                    <span className={`cat-badge cat-${expense.category} me-2`}>{cat.icon} {cat.label}</span>
                    <span className="text-muted small">{formatDate(expense.date)}</span>
                  </div>
                </td>
                <td className="hide-mobile">
                  <span className={`cat-badge cat-${expense.category}`}>{cat.icon} {cat.label}</span>
                </td>
                <td className="text-muted small hide-mobile">{formatDate(expense.date)}</td>
                <td className="text-end fw-bold" style={{ color: '#4f46e5' }}>{formatCurrency(expense.amount)}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    style={{ borderRadius: 8 }}
                    onClick={() => onEdit(expense)}
                    title="Edit"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: 8 }}
                    onClick={() => onDelete(expense._id)}
                    title="Delete"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
