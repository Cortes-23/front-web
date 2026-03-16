import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../services/api"

export default function SuperAdmin() {

  const { token, rol, loginSuperAdmin, logout } = useContext(AuthContext)
  const isAuthenticated = token && rol === "SUPERADMIN"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [offices, setOffices] = useState([])
  const [loadingOffices, setLoadingOffices] = useState(false)

  const [showCreateOffice, setShowCreateOffice] = useState(false)

  const [officeForm, setOfficeForm] = useState({
    name: "",
    slug: "",
    phone: "",
    address: ""
  })

  const [officeMsg, setOfficeMsg] = useState("")

  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState(null)

  const [adminForm, setAdminForm] = useState({
    nombre: "",
    cedula: "",
    celular: "",
    direccion: "",
    email: "",
    password: ""
  })

  const [adminMsg, setAdminMsg] = useState("")

  // NUEVO: estado para modal de ver oficina
  const [viewOffice, setViewOffice] = useState(null)

  useEffect(() => {
    if (isAuthenticated) fetchOffices()
  }, [isAuthenticated])

  const fetchOffices = async () => {
    setLoadingOffices(true)
    try {
      const res = await api.get("/superadmin/oficinas")
      setOffices(res.data)
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

      setOffices(prev => [res.data, ...prev])

      setOfficeMsg(
        "✅ Oficina creada. URL: /offices/" +
        res.data.slug +
        "/login"
      )

      setOfficeForm({
        name: "",
        slug: "",
        phone: "",
        address: ""
      })

    } catch (err) {

      setOfficeMsg(
        "❌ " +
        (err.response?.data?.message || "Error creando oficina")
      )
    }
  }

  const handleToggleOffice = async (id) => {
    try {

      const res = await api.patch(`/superadmin/oficinas/${id}/toggle`)

      setOffices(prev =>
        prev.map(o =>
          o._id === id ? res.data.office : o
        )
      )

    } catch {
      alert("Error actualizando oficina")
    }
  }

  const handleCreateAdmin = async (e) => {

    e.preventDefault()
    setAdminMsg("")

    try {

      await api.post(
        `/superadmin/oficinas/${selectedOffice._id}/admin`,
        adminForm
      )

      setAdminMsg("✅ Admin creado correctamente")

      setAdminForm({
        nombre: "",
        cedula: "",
        celular: "",
        direccion: "",
        email: "",
        password: ""
      })

    } catch (err) {

      setAdminMsg(
        "❌ " +
        (err.response?.data?.message || "Error creando admin")
      )
    }
  }

  // LOGIN

  if (!isAuthenticated) {

    return (
      <div style={s.page}>
        <div style={s.card}>

          <h2 style={s.cardTitle}>Panel Superadmin</h2>

          {loginError && (
            <p style={s.error}>
              {loginError}
            </p>
          )}

          <form
            onSubmit={handleLogin}
            style={s.form}
          >

            <input
              style={s.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              style={s.input}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              style={s.btnPrimary}
              type="submit"
            >
              Ingresar
            </button>

          </form>
        </div>
      </div>
    )
  }

  // DASHBOARD

  return (

    <div style={s.page}>

      <div style={s.dashboard}>

        <div style={s.dashHeader}>

          <h2 style={{ margin: 0 }}>
            Panel Superadmin
          </h2>

          <button
            style={s.btnLogout}
            onClick={logout}
          >
            Cerrar sesión
          </button>

        </div>

        <button
          style={s.btnPrimary}
          onClick={() =>
            setShowCreateOffice(true)
          }
        >
          + Nueva oficina
        </button>

        {loadingOffices ? (

          <p>Cargando...</p>

        ) : (

          <div style={s.table}>

            {offices.map(office => (

              <div
                key={office._id}
                style={s.row}
              >

                <div style={s.rowInfo}>
                  <strong>
                    {office.name}
                  </strong>
                </div>

                <div style={s.rowActions}>

                  <span
                    style={{
                      ...s.badge,
                      background:
                        office.active
                          ? "#16a34a"
                          : "#b91c1c"
                    }}
                  >
                    {office.active
                      ? "Activa"
                      : "Inactiva"}
                  </span>

                  <button
                    style={s.btnSmall}
                    onClick={() =>
                      handleToggleOffice(
                        office._id
                      )
                    }
                  >
                    {office.active
                      ? "Desactivar"
                      : "Activar"}
                  </button>

                  <button
                    style={s.btnSmall}
                    onClick={() =>
                      setViewOffice(office)
                    }
                  >
                    Ver
                  </button>

                  <button
                    style={{
                      ...s.btnSmall,
                      background:
                        "#2563eb",
                      color: "#fff"
                    }}
                    onClick={() => {

                      setSelectedOffice(
                        office
                      )

                      setAdminMsg("")

                      setShowCreateAdmin(
                        true
                      )

                    }}
                  >
                    + Admin
                  </button>

                </div>
              </div>

            ))}
          </div>
        )}
      </div>

      {/* MODAL VER OFICINA */}

      {viewOffice && (

        <div style={s.overlay}>

          <div style={s.modal}>

            <h3 style={s.modalTitle}>
              Información de Oficina
            </h3>

            <p>
              <strong>Nombre:</strong>{" "}
              {viewOffice.name}
            </p>

            <p>
              <strong>URL:</strong>{" "}
              /offices/{viewOffice.slug}/login
            </p>

            <p>
              <strong>Teléfono:</strong>{" "}
              {viewOffice.phone ||
                "No registrado"}
            </p>

            <p>
              <strong>Dirección:</strong>{" "}
              {viewOffice.address ||
                "No registrada"}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {viewOffice.active
                ? "Activa"
                : "Inactiva"}
            </p>

            <button
              style={s.btnSecondary}
              onClick={() =>
                setViewOffice(null)
              }
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

const s = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#f0f4f8,#e2e8f0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Poppins"
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 40,
    width: 360,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.1)"
  },

  dashboard: {
    width: "100%",
    maxWidth: 900,
    display: "flex",
    flexDirection: "column",
    gap: 25
  },

  dashHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#3b82f6",
    padding: "18px 22px",
    borderRadius: 16,
    color: "#fff"
  },

  table: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  row: {
    background: "#fff",
    borderRadius: 14,
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  rowInfo: {
    display: "flex",
    flexDirection: "column"
  },

  rowActions: {
    display: "flex",
    gap: 8
  },

  badge: {
    padding: "4px 12px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12
  },

  btnPrimary: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },

  btnSecondary: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #3b82f6",
    background: "transparent",
    cursor: "pointer"
  },

  btnSmall: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    background: "#93c5fd",
    cursor: "pointer",
    fontSize: 12
  },

  btnLogout: {
    padding: "6px 14px",
    borderRadius: 10,
    border: "none",
    background: "#fff",
    color: "#b91c1c",
    cursor: "pointer"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  modal: {
    background: "#fff",
    borderRadius: 18,
    padding: 32,
    width: 400,
    boxShadow:
      "0 12px 40px rgba(0,0,0,0.15)"
  },

  modalTitle: {
    marginBottom: 20
  },

  error: {
    color: "#dc2626",
    textAlign: "center"
  }

}