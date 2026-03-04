import { CATEGORIES } from '../utils/categories'

export default function FilterBar({ filter, onFilterChange, search, onSearchChange, onClearAll }) {
  return (
    <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center mb-4">
      {/* Search */}
      <div className="input-group" style={{ maxWidth: 300 }}>
        <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
        <input
          type="text"
          className="form-control border-start-0 ps-1"
          placeholder="Search expenses..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
        {search && (
          <button className="btn btn-outline-secondary" onClick={() => onSearchChange('')}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="d-flex gap-2 flex-wrap">
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onFilterChange('all')}
        >All</button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`btn btn-sm ${filter === cat.value ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onFilterChange(cat.value)}
          >
            {cat.icon} <span className="d-none d-sm-inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Clear all */}
      <div className="ms-md-auto">
        <button className="btn btn-sm btn-outline-danger" onClick={onClearAll}>
          <i className="bi bi-trash3 me-1"></i><span className="d-none d-sm-inline">Clear All</span>
        </button>
      </div>
    </div>
  )
}
