import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../services/api"

export default function SuperAdmin() {
  const { token, rol, loginSuperAdmin, logout } = useContext(AuthContext)
  const isAuthenticated = token && rol === "SUPERADMIN"

  // ── Login state ──────────────────────────────────────
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // ── Oficinas state ───────────────────────────────────
  const [offices, setOffices] = useState([])
  const [loadingOffices, setLoadingOffices] = useState(false)

  // ── Modal crear oficina ──────────────────────────────
  const [showCreateOffice, setShowCreateOffice] = useState(false)
  const [officeForm, setOfficeForm] = useState({ name: "", slug: "", phone: "", address: "" })
  const [officeMsg, setOfficeMsg] = useState("")

  // ── Modal crear admin ────────────────────────────────
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [adminForm, setAdminForm] = useState({ nombre: "", cedula: "", celular: "", direccion: "", email: "", password: "" })
  const [adminMsg, setAdminMsg] = useState("")

  useEffect(() => {
    if (isAuthenticated) fetchOffices()
  }, [isAuthenticated])

  const fetchOffices = async () => {
    setLoadingOffices(true)
    try {
      const res = await api.get("/superadmin/oficinas")
      setOffices(res.data)
    } catch {
      //
    } finally {
      setLoadingOffices(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError("")
    try {
      await loginSuperAdmin(email.trim(), password)
    } catch {
      setLoginError("Credenciales incorrectas")
    }
  }

  const handleCreateOffice = async (e) => {
    e.preventDefault()
    setOfficeMsg("")
    try {
      const res = await api.post("/superadmin/oficinas", officeForm)
      setOffices((prev) => [res.data, ...prev])
      setOfficeMsg("✅ Oficina creada. URL: /offices/" + res.data.slug + "/login")
      setOfficeForm({ name: "", slug: "", phone: "", address: "" })
    } catch (err) {
      setOfficeMsg("❌ " + (err.response?.data?.message || "Error creando oficina"))
    }
  }

  const handleToggleOffice = async (id) => {
    try {
      const res = await api.patch(`/superadmin/oficinas/${id}/toggle`)
      setOffices((prev) => prev.map((o) => o._id === id ? res.data.office : o))
    } catch {
      alert("Error actualizando oficina")
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setAdminMsg("")
    try {
      await api.post(`/superadmin/oficinas/${selectedOffice._id}/admin`, adminForm)
      setAdminMsg("✅ Admin creado correctamente")
      setAdminForm({ nombre: "", cedula: "", celular: "", direccion: "", email: "", password: "" })
    } catch (err) {
      setAdminMsg("❌ " + (err.response?.data?.message || "Error creando admin"))
    }
  }

  // ── PANTALLA LOGIN ───────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>⚙ Superadmin</h2>
          {loginError && <p style={s.error}>{loginError}</p>}
          <form onSubmit={handleLogin} style={s.form}>
            <input style={s.input} type="email" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input style={s.input} type="password" placeholder="Contraseña"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button style={s.btnPrimary} type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    )
  }

  // ── PANTALLA DASHBOARD ───────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.dashboard}>

        {/* Header */}
        <div style={s.dashHeader}>
          <h2 style={{ color: "#fff", margin: 0 }}>⚙ Panel Superadmin</h2>
          <button style={s.btnLogout} onClick={logout}>Cerrar sesión</button>
        </div>

        {/* Botón crear oficina */}
        <button style={s.btnPrimary} onClick={() => setShowCreateOffice(true)}>
          + Nueva oficina
        </button>

        {/* Lista de oficinas */}
        {loadingOffices ? (
          <p style={{ color: "#8b949e" }}>Cargando...</p>
        ) : (
          <div style={s.table}>
            {offices.length === 0 && (
              <p style={{ color: "#8b949e" }}>No hay oficinas creadas aún.</p>
            )}
            {offices.map((office) => (
              <div key={office._id} style={s.row}>
                <div style={s.rowInfo}>
                  <strong style={{ color: "#fff" }}>{office.name}</strong>
                  <span style={{ color: "#8b949e", fontSize: 13 }}>
                    /offices/{office.slug}/login
                  </span>
                </div>
                <div style={s.rowActions}>
                  <span style={{ ...s.badge, background: office.active ? "#1a7f37" : "#6e3939" }}>
                    {office.active ? "Activa" : "Inactiva"}
                  </span>
                  <button style={s.btnSmall} onClick={() => handleToggleOffice(office._id)}>
                    {office.active ? "Desactivar" : "Activar"}
                  </button>
                  <button style={{ ...s.btnSmall, background: "#565bba" }} onClick={() => {
                    setSelectedOffice(office)
                    setAdminMsg("")
                    setShowCreateAdmin(true)
                  }}>
                    + Admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal crear oficina */}
      {showCreateOffice && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={s.modalTitle}>Nueva oficina</h3>
            <form onSubmit={handleCreateOffice} style={s.form}>
              <input style={s.input} placeholder="Nombre de la oficina"
                value={officeForm.name}
                onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })} required />
              <input style={s.input} placeholder="Slug (ej: gotas-norte)"
                value={officeForm.slug}
                onChange={(e) => setOfficeForm({ ...officeForm, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required />
              <input style={s.input} placeholder="Teléfono"
                value={officeForm.phone}
                onChange={(e) => setOfficeForm({ ...officeForm, phone: e.target.value })} />
              <input style={s.input} placeholder="Dirección"
                value={officeForm.address}
                onChange={(e) => setOfficeForm({ ...officeForm, address: e.target.value })} />
              {officeMsg && <p style={{ color: officeMsg.startsWith("✅") ? "#3fb950" : "#f85149", fontSize: 13 }}>{officeMsg}</p>}
              <button style={s.btnPrimary} type="submit">Crear</button>
              <button style={s.btnSecondary} type="button" onClick={() => { setShowCreateOffice(false); setOfficeMsg("") }}>Cerrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal crear admin */}
      {showCreateAdmin && selectedOffice && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={s.modalTitle}>Admin para: {selectedOffice.name}</h3>
            <form onSubmit={handleCreateAdmin} style={s.form}>
              <input style={s.input} placeholder="Nombre"
                value={adminForm.nombre}
                onChange={(e) => setAdminForm({ ...adminForm, nombre: e.target.value })} required />
              <input style={s.input} placeholder="Cédula"
                value={adminForm.cedula}
                onChange={(e) => setAdminForm({ ...adminForm, cedula: e.target.value })} required />
              <input style={s.input} placeholder="Celular"
                value={adminForm.celular}
                onChange={(e) => setAdminForm({ ...adminForm, celular: e.target.value })} required />
              <input style={s.input} placeholder="Dirección"
                value={adminForm.direccion}
                onChange={(e) => setAdminForm({ ...adminForm, direccion: e.target.value })} required />
              <input style={s.input} type="email" placeholder="Email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} required />
              <input style={s.input} type="password" placeholder="Contraseña"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required />
              {adminMsg && <p style={{ color: adminMsg.startsWith("✅") ? "#3fb950" : "#f85149", fontSize: 13 }}>{adminMsg}</p>}
              <button style={s.btnPrimary} type="submit">Crear admin</button>
              <button style={s.btnSecondary} type="button" onClick={() => { setShowCreateAdmin(false); setSelectedOffice(null) }}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { minHeight: "100vh", background: "#0d1117", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 20px", fontFamily: "'Segoe UI', sans-serif" },
  card: { background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 40, width: 340, display: "flex", flexDirection: "column", gap: 16 },
  cardTitle: { color: "#fff", textAlign: "center", margin: 0 },
  dashboard: { width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: 20 },
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: "10px 14px", borderRadius: 8, border: "1px solid #30363d", background: "#0d1117", color: "#fff", fontSize: 14, outline: "none" },
  btnPrimary: { padding: 10, borderRadius: 8, border: "none", background: "#565bba", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  btnSecondary: { padding: 10, borderRadius: 8, border: "1px solid #30363d", background: "transparent", color: "#8b949e", cursor: "pointer", fontSize: 14 },
  btnLogout: { padding: "6px 14px", borderRadius: 8, border: "1px solid #30363d", background: "transparent", color: "#f85149", cursor: "pointer", fontSize: 13 },
  btnSmall: { padding: "4px 10px", borderRadius: 6, border: "none", background: "#21262d", color: "#ccc", cursor: "pointer", fontSize: 12 },
  table: { display: "flex", flexDirection: "column", gap: 10 },
  row: { background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
  rowInfo: { display: "flex", flexDirection: "column", gap: 2 },
  rowActions: { display: "flex", gap: 8, alignItems: "center" },
  badge: { padding: "2px 10px", borderRadius: 20, color: "#fff", fontSize: 12 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 32, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 4 },
  modalTitle: { color: "#fff", margin: "0 0 16px", textAlign: "center" },
  error: { color: "#f85149", textAlign: "center", fontSize: 13 }
}