import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-eta6.onrender.com/api"
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`

  // Inyecta el slug del tenant en cada petición automáticamente
  const tenant = localStorage.getItem("tenant")
  if (tenant) {
    const { slug } = JSON.parse(tenant)
    if (slug) config.headers["x-tenant-slug"] = slug
  }

  return config
})

export default api