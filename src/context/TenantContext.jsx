import { createContext, useContext, useState } from "react"

const TenantContext = createContext(null)

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(() => {
    const stored = localStorage.getItem("tenant")
    return stored ? JSON.parse(stored) : null
  })

  const saveTenant = (officeData) => {
    setTenant(officeData)
    localStorage.setItem("tenant", JSON.stringify(officeData))
  }

  const clearTenant = () => {
    setTenant(null)
    localStorage.removeItem("tenant")
    localStorage.removeItem("token")
  }

  return (
    <TenantContext.Provider value={{ tenant, saveTenant, clearTenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => useContext(TenantContext)