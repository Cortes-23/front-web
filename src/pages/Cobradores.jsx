import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../services/api"

export default function Cobradores() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [cobradores, setCobradores] = useState([])
  const [clientes, setClientes] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [form, setForm] = useState({
    nombre: "", cedula: "", celular: "",
    direccion: "", email: "", password: "", rol: "COBRADOR"
  })

  const cargarCobradores = async () => {
    try {
      const res = await api.get("/users")
      const solo = res.data.filter(u => u.rol === "COBRADOR")
      setCobradores(solo)
    } catch (error) {
      console.error("Error cargando cobradores", error)
    }
  }

  const verClientes = async (id) => {
    try {
      const res = await api.get("/clientes/cobrador/" + id)
      setClientes(res.data)
    } catch (error) {
      console.error("Error cargando clientes", error)
    }
  }

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put("/users/habilitar/" + id, { habilitado: estado })
      cargarCobradores()
    } catch (error) {
      console.error("Error cambiando estado", error)
    }
  }

  const handleCrearUsuario = async (e) => {
    e.preventDefault()
    try {
      await api.post("/users", form)
      alert("Usuario creado correctamente")
      setMostrarModal(false)
      setForm({ nombre: "", cedula: "", celular: "", direccion: "", email: "", password: "", rol: "COBRADOR" })
      cargarCobradores()
    } catch (err) {
      alert("Error creando usuario")
    }
  }

  useEffect(() => {
    cargarCobradores()
  }, [])

  return (
    <div style={{ fontSize: "20px", fontFamily: "Arial", color: "#16283aff", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Cobradores</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate(`/offices/${slug}/clientes`)}
            style={{ padding: "8px 14px", cursor: "pointer" }}>
            Volver al inicio
          </button>
          <button onClick={() => setMostrarModal(true)}
            style={{ padding: "8px 14px", cursor: "pointer", backgroundColor: "#565bba", color: "white", border: "none", borderRadius: 6 }}>
            + Crear Usuario
          </button>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {cobradores.map(c => (
          <li key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid #ddd" }}>
            <span>{c.nombre}</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => verClientes(c._id)} style={{ padding: "6px 10px", cursor: "pointer" }}>
                Ver clientes
              </button>
              {c.habilitado ? (
                <button onClick={() => cambiarEstado(c._id, false)}
                  style={{ padding: "6px 10px", cursor: "pointer", backgroundColor: "#819ed1ff", color: "white", border: "none" }}>
                  Deshabilitar
                </button>
              ) : (
                <button onClick={() => cambiarEstado(c._id, true)}
                  style={{ padding: "6px 10px", cursor: "pointer", backgroundColor: "#3962b2ff", color: "white", border: "none" }}>
                  Habilitar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "25px 0" }} />
      <h3>Clientes asignados</h3>
      <ul>
        {clientes.map(cl => (
          <li key={cl._id}>{cl.nombre} - {cl.cedula} - {cl.telefono}</li>
        ))}
      </ul>

      {mostrarModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ textAlign: "center", marginBottom: 15 }}>Nuevo Usuario</h3>
            <form onSubmit={handleCrearUsuario} style={formStyle}>
              <input style={input} placeholder="Nombre" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              <input style={input} placeholder="Cédula" value={form.cedula}
                onChange={(e) => setForm({ ...form, cedula: e.target.value })} required />
              <input style={input} placeholder="Celular" value={form.celular}
                onChange={(e) => setForm({ ...form, celular: e.target.value })} required />
              <input style={input} placeholder="Dirección" value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })} required />
              <input style={input} placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input style={input} type="password" placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <select style={input} value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                <option value="COBRADOR">COBRADOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button style={btnPrimary} type="submit">Guardar</button>
              <button style={btnDanger} type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const overlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }
const modal = { backgroundColor: "white", padding: 30, borderRadius: 10, width: 400, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }
const formStyle = { display: "flex", flexDirection: "column", gap: 10 }
const input = { padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }
const btnPrimary = { padding: 10, borderRadius: 6, border: "none", backgroundColor: "#565bbaff", color: "white", fontWeight: "bold", cursor: "pointer" }
const btnDanger = { padding: 10, borderRadius: 6, border: "none", backgroundColor: "#878ed9ff", color: "white", cursor: "pointer" }