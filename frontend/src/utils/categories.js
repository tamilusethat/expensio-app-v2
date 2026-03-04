export const CATS = {
  food:          { l: 'Food & Dining',  i: '🍜', c: '#c2410c', bg: '#fff0e6' },
  transport:     { l: 'Transport',      i: '🚌', c: '#065f46', bg: '#ecfdf5' },
  housing:       { l: 'Housing',        i: '🏠', c: '#1d4ed8', bg: '#eff6ff' },
  health:        { l: 'Health',         i: '💊', c: '#9d174d', bg: '#fdf2f8' },
  entertainment: { l: 'Entertainment',  i: '🎬', c: '#5b21b6', bg: '#f5f3ff' },
  shopping:      { l: 'Shopping',       i: '🛍', c: '#92400e', bg: '#fffbeb' },
  other:         { l: 'Other',          i: '📌', c: '#475569', bg: '#f1f5f9' },
}

export const catOptions = Object.entries(CATS).map(([value, { l, i }]) => ({ value, label: `${i} ${l}` }))

export const formatCur = n => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const formatDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
export const todayStr = () => new Date().toISOString().split('T')[0]
export const mkid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
