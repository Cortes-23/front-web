import { useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useTenant } from "../context/TenantContext"

export default function Login() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { loginAdmin } = useContext(AuthContext)
  const { saveTenant } = useTenant()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
      saveTenant({ slug })
      await loginAdmin(email.trim(), password, slug)
      navigate(`/offices/${slug}/clientes`)
    } catch (err) {
      setError("Credenciales incorrectas")
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center", color: "#2f386b" }}>Panel Administrativo</h2>
        <p style={{ textAlign: "center", color: "#888", fontSize: 13, margin: 0 }}>
          Oficina: <strong>{slug}</strong>
        </p>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleLogin} style={formStyle}>
          <input style={input} type="email" placeholder="Correo"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={input} type="password" placeholder="Contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <button style={buttonPrimary} type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}

const container = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#2f386bff" }
const card = { backgroundColor: "white", padding: 40, borderRadius: 12, width: 350, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: 15 }
const formStyle = { display: "flex", flexDirection: "column", gap: 10 }
const input = { padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }
const buttonPrimary = { padding: 10, borderRadius: 6, border: "none", backgroundColor: "#565bbaff", color: "white", fontWeight: "bold", cursor: "pointer" }
const errorStyle = { color: "red", textAlign: "center" }