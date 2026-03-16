import { Link, useParams } from "react-router-dom"

export default function Layout({ children }) {
  const { slug } = useParams()

  return (
    <div className="container">

      <aside className="sidebar">

        <div className="logo">
          ☀️ Admin
        </div>

        <nav className="menu">

          <Link to={`/offices/${slug}/clientes`} className="menu-item">
            <span className="icon">👤</span>
            <span className="text">Clientes</span>
          </Link>

          <Link to={`/offices/${slug}/cobradores`} className="menu-item">
            <span className="icon">💼</span>
            <span className="text">Cobradores</span>
          </Link>

          <Link to={`/offices/${slug}/creditos`} className="menu-item">
            <span className="icon">💳</span>
            <span className="text">Créditos</span>
          </Link>

        </nav>

      </aside>

      <main className="content">
        {children}
      </main>

    </div>
  )
}