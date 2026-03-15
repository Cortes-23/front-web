import { useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useTenant } from "../context/TenantContext"

export default function CrearUsuario() {
  const { slug } = useParams()
  const { loginAdmin } = useContext(AuthContext)
  const { saveTenant } = useTenant()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
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
    <div>
      <h2>Login Admin</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}