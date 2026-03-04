export const CATEGORIES = [
  { value: 'food',          label: 'Food & Dining',    icon: '🍜', color: '#c2410c', bar: '#fb923c' },
  { value: 'transport',     label: 'Transport',         icon: '🚌', color: '#065f46', bar: '#34d399' },
  { value: 'housing',       label: 'Housing & Rent',   icon: '🏠', color: '#1d4ed8', bar: '#60a5fa' },
  { value: 'health',        label: 'Health & Medical', icon: '💊', color: '#9d174d', bar: '#f472b6' },
  { value: 'entertainment', label: 'Entertainment',    icon: '🎬', color: '#5b21b6', bar: '#a78bfa' },
  { value: 'shopping',      label: 'Shopping',         icon: '🛍', color: '#92400e', bar: '#fbbf24' },
  { value: 'other',         label: 'Other',            icon: '📌', color: '#475569', bar: '#94a3b8' },
]

export const getCategoryInfo = (value) =>
  CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1]

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateInput = (dateStr) => {
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0]
}
