import { useEffect, useState } from "react"
import api from "../services/api"

export default function Creditos() {
  const [clientes, setClientes] = useState([])
  const [creditos, setCreditos] = useState([])
  const [clienteId, setClienteId] = useState("")
  const [monto, setMonto] = useState("")
  const [fechaPago, setFechaPago] = useState("")

  const interes = 0.30
  const montoAPagar = monto ? Number(monto) * (1 + interes) : 0

  useEffect(() => {
    api.get("/clientes").then((res) => setClientes(res.data)).catch(() => {})
  }, [])

  const obtenerCreditos = async () => {
    if (!clienteId) return
    const res = await api.get("/creditos/cliente/" + clienteId)
    setCreditos(res.data)
  }

  const crearCredito = async (e) => {
    e.preventDefault()
    if (!clienteId || !monto || !fechaPago) return alert("Complete todos los campos")

    await api.post("/creditos", {
      clienteId,
      montoPrestamo: Number(monto),
      montoAPagar,
      fechaPago
    })

    setMonto("")
    setFechaPago("")
    obtenerCreditos()
  }

  return (
    <div>
      <h2>Créditos</h2>

      <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
        <option value="">Seleccionar cliente</option>
        {clientes.map(c => (
          <option key={c._id} value={c._id}>{c.nombre}</option>
        ))}
      </select>

      <form onSubmit={crearCredito}>
        <input type="number" placeholder="Monto prestado"
          value={monto} onChange={(e) => setMonto(e.target.value)} />
        <input type="date" value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)} />
        <p>Interés: 30%</p>
        <p>Monto total a pagar: ${montoAPagar}</p>
        <button type="submit">Crear Crédito</button>
      </form>

      <button onClick={obtenerCreditos}>Ver créditos del cliente</button>

      <hr />

      <ul>
        {creditos.map(c => (
          <li key={c._id}>
            Prestado: {c.montoPrestamo} | Total: {c.montoAPagar} | Saldo: {c.saldoPendiente} | Estado: {c.estado}
          </li>
        ))}
      </ul>
    </div>
  )
}