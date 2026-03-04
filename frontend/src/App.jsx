import { useState, useEffect, useCallback } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Navbar from './components/Navbar'
import SummaryStats from './components/SummaryStats'
import ExpenseModal from './components/ExpenseModal'
import ExpenseTable from './components/ExpenseTable'
import CategoryChart from './components/CategoryChart'
import FilterBar from './components/FilterBar'
import { getExpenses, getSummary, addExpense, updateExpense, deleteExpense, clearAllExpenses } from './services/api'

export default function App() {
  const [expenses, setExpenses]   = useState([])
  const [summary, setSummary]     = useState(null)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData]   = useState(null)
  const [loading, setLoading]     = useState({ list: true, summary: true, submit: false })
  const [confirmClear, setConfirmClear] = useState(false)

  // ── Filtered + searched list ────────────────────────────────────────────────
  const displayed = expenses.filter(e => {
    const matchCat    = filter === 'all' || e.category === filter
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.note || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // ── Fetch data ──────────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(l => ({ ...l, list: true }))
    try {
      const res = await getExpenses({ limit: 200, sort: '-date' })
      setExpenses(res.data.data)
    } catch {
      toast.error('Failed to load expenses. Is the server running?')
    } finally {
      setLoading(l => ({ ...l, list: false }))
    }
  }, [])

  const fetchSummary = useCallback(async () => {
    setLoading(l => ({ ...l, summary: true }))
    try {
      const res = await getSummary()
      setSummary(res.data.data)
    } catch {
      // silent
    } finally {
      setLoading(l => ({ ...l, summary: false }))
    }
  }, [])

  const refresh = useCallback(() => {
    fetchExpenses()
    fetchSummary()
  }, [fetchExpenses, fetchSummary])

  useEffect(() => { refresh() }, [refresh])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleOpenAdd = () => { setEditData(null); setShowModal(true) }
  const handleEdit    = (exp) => { setEditData(exp); setShowModal(true) }
  const handleClose   = () => { setShowModal(false); setEditData(null) }

  const handleSubmit = async (formData) => {
    setLoading(l => ({ ...l, submit: true }))
    try {
      if (editData) {
        await updateExpense(editData._id, formData)
        toast.success('Expense updated!')
      } else {
        await addExpense(formData)
        toast.success('Expense added!')
      }
      handleClose()
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(l => ({ ...l, submit: false }))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await deleteExpense(id)
      toast.success('Expense deleted')
      refresh()
    } catch {
      toast.error('Failed to delete expense')
    }
  }

  const handleClearAll = async () => {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    try {
      await clearAllExpenses()
      toast.success('All expenses cleared')
      setConfirmClear(false)
      refresh()
    } catch {
      toast.error('Failed to clear expenses')
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: '.9rem' } }} />

      <Navbar />

      <main className="container-xl py-4 px-3 px-md-4">

        {/* Page header */}
        <div className="d-flex align-items-center justify-content-between mb-4 animate-in">
          <div>
            <h4 className="font-heading fw-bold mb-0">Dashboard</h4>
            <p className="text-muted small mb-0">{expenses.length} expense{expenses.length !== 1 ? 's' : ''} tracked</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAdd}>
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline">Add Expense</span>
          </button>
        </div>

        {/* Summary */}
        <SummaryStats summary={summary} loading={loading.summary} />

        {/* Main grid */}
        <div className="row g-4">

          {/* Left — Expense list */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                <h6 className="font-heading fw-bold mb-3">
                  <i className="bi bi-list-ul me-2 text-primary"></i>Expense List
                </h6>
                <FilterBar
                  filter={filter}
                  onFilterChange={setFilter}
                  search={search}
                  onSearchChange={setSearch}
                  onClearAll={handleClearAll}
                  confirmClear={confirmClear}
                />
              </div>
              <div className="card-body p-0">
                <ExpenseTable
                  expenses={displayed}
                  loading={loading.list}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
              {displayed.length > 0 && (
                <div className="card-footer bg-transparent text-muted small px-4 py-3">
                  Showing {displayed.length} of {expenses.length} entries
                </div>
              )}
            </div>
          </div>

          {/* Right — Category chart */}
          <div className="col-lg-4">
            <CategoryChart summary={summary} loading={loading.summary} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-muted small py-4 mt-4 border-top">
        <span>Expensio &copy; {new Date().getFullYear()} &mdash; Built with React + Node.js + MongoDB</span>
      </footer>

      {/* Modal */}
      <ExpenseModal
        show={showModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editData={editData}
        loading={loading.submit}
      />
    </>
  )
}
