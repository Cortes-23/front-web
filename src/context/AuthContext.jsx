import { createContext, useState } from "react"
import api from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [rol, setRol] = useState(localStorage.getItem("rol"))

  // Login admin web (requiere slug)
  const loginAdmin = async (email, password, slug) => {
    const res = await api.post("/auth/login-admin", { email, password, slug })
    const { token: t } = res.data
    localStorage.setItem("token", t)
    localStorage.setItem("rol", "ADMIN")
    setToken(t)
    setRol("ADMIN")
  }

  // Login superadmin (sin slug)
  const loginSuperAdmin = async (email, password) => {
    const res = await api.post("/auth/login-superadmin", { email, password })
    const { token: t } = res.data
    localStorage.setItem("token", t)
    localStorage.setItem("rol", "SUPERADMIN")
    setToken(t)
    setRol("SUPERADMIN")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    localStorage.removeItem("tenant")
    setToken(null)
    setRol(null)
  }

  return (
    <AuthContext.Provider value={{ token, rol, loginAdmin, loginSuperAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
