export default function Navbar() {
  return (
    <nav className="navbar navbar-dark sticky-top" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 2px 20px rgba(79,70,229,.35)' }}>
      <div className="container-xl">
        <a className="navbar-brand fw-bold fs-4" href="/">
          <i className="bi bi-wallet2 me-2"></i>
          Expen<span>sio</span>
        </a>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50 small d-none d-sm-block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
    </nav>
  )
}
