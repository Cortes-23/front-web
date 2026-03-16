import { Link, useParams } from "react-router-dom"

export default function Layout({ children }) {
  const { slug } = useParams()

  return (
    <div className="app-container">

      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>

        <nav className="menu">
          <Link to={`/offices/${slug}/clientes`} className="menu-item">
            Clientes
          </Link>

          <Link to={`/offices/${slug}/cobradores`} className="menu-item">
            Cobradores
          </Link>

          <Link to={`/offices/${slug}/creditos`} className="menu-item">
            Créditos
          </Link>
        </nav>
      </aside>

      <main className="content">
        {children}
      </main>

    </div>
  )
}