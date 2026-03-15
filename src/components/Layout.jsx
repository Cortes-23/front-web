import { Link, useParams } from "react-router-dom"

export default function Layout({ children }) {
  const { slug } = useParams()

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ width: "220px", background: "#1f2937", color: "white", padding: "20px" }}>
        <h3>Admin Panel</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to={`/offices/${slug}/clientes`} style={{ color: "white" }}>Clientes</Link>
          <Link to={`/offices/${slug}/cobradores`} style={{ color: "white" }}>Cobradores</Link>
          <Link to={`/offices/${slug}/creditos`} style={{ color: "white" }}>Créditos</Link>
        </nav>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  )
}