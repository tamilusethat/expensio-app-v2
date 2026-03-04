import { useState, useEffect } from 'react'
import { CATEGORIES, formatDateInput } from '../utils/categories'

const EMPTY = { name: '', amount: '', category: 'food', note: '', date: new Date().toISOString().split('T')[0] }

export default function ExpenseModal({ show, onClose, onSubmit, editData, loading }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        amount: editData.amount,
        category: editData.category,
        note: editData.note || '',
        date: formatDateInput(editData.date),
      })
    } else {
      setForm(EMPTY)
    }
    setErrors({})
  }, [editData, show])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Description is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  const set = (field) => (ev) => setForm(f => ({ ...f, [field]: ev.target.value }))

  if (!show) return null

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content animate-in">
          <div className="modal-header">
            <h5 className="modal-title font-heading">
              <i className={`bi ${editData ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>
              {editData ? 'Edit Expense' : 'Add New Expense'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Description <span className="text-danger">*</span></label>
                  <input
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Grocery shopping"
                    value={form.name}
                    onChange={set('name')}
                    maxLength={100}
                    autoFocus
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Amount */}
                <div className="col-sm-6">
                  <label className="form-label fw-semibold small">Amount (₹) <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                      value={form.amount}
                      onChange={set('amount')}
                      min="0.01"
                      step="0.01"
                    />
                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                  </div>
                </div>

                {/* Date */}
                <div className="col-sm-6">
                  <label className="form-label fw-semibold small">Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    value={form.date}
                    onChange={set('date')}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>

                {/* Category */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Category</label>
                  <div className="row g-2">
                    {CATEGORIES.map(cat => (
                      <div className="col-6 col-sm-4" key={cat.value}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="category"
                          id={`cat-${cat.value}`}
                          value={cat.value}
                          checked={form.category === cat.value}
                          onChange={set('category')}
                        />
                        <label
                          className="btn btn-outline-secondary w-100 d-flex align-items-center gap-2 justify-content-center py-2"
                          htmlFor={`cat-${cat.value}`}
                          style={{ fontSize: '.8rem' }}
                        >
                          <span>{cat.icon}</span> {cat.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="col-12">
                  <label className="form-label fw-semibold small">Note <span className="text-muted">(optional)</span></label>
                  <textarea
                    className="form-control"
                    placeholder="Any additional details..."
                    rows={2}
                    value={form.note}
                    onChange={set('note')}
                    maxLength={250}
                  />
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  : <><i className={`bi ${editData ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>{editData ? 'Update' : 'Add Expense'}</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
