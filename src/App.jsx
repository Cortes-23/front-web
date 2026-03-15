import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { TenantProvider } from "./context/TenantContext"
import { AuthProvider } from "./context/AuthContext"
import Login from "./pages/Login"
import Clientes from "./pages/Clientes"
import Creditos from "./pages/Creditos"
import Layout from "./components/Layout"
import CrearUsuario from "./pages/CrearUsuario"
import Cobradores from "./pages/Cobradores"
import SuperAdmin from "./pages/Superadmin.jsx"

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <BrowserRouter>
          <Routes>

            {/* Ruta raíz — redirige si no hay slug */}
            <Route path="/" element={<Navigate to="/superadmin" replace />} />

            {/* Login por oficina */}
            <Route path="/offices/:slug/login" element={<Login />} />

            {/* Rutas privadas por oficina */}
            <Route path="/offices/:slug/crear-usuario"
              element={<PrivateRoute><CrearUsuario /></PrivateRoute>} />

            <Route path="/offices/:slug/cobradores"
              element={<PrivateRoute><Cobradores /></PrivateRoute>} />

            <Route path="/offices/:slug/clientes"
              element={<PrivateRoute><Layout><Clientes /></Layout></PrivateRoute>} />

            <Route path="/offices/:slug/creditos"
              element={<PrivateRoute><Layout><Creditos /></Layout></PrivateRoute>} />

            {/* Superadmin — login propio dentro de la misma página */}
            <Route path="/superadmin" element={<SuperAdmin />} />

          </Routes>
        </BrowserRouter>
      </TenantProvider>
    </AuthProvider>
  )
}

export default App