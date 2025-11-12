"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type User = { id?: number; email?: string; name?: string | null; avatarBase64?: string | null }

type AuthContextValue = {
  isAuthed: boolean
  user: User | null
  setUser: (u: User | null) => void
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokenPresent, setTokenPresent] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null
      const usr = raw ? JSON.parse(raw) as User : null
      setUser(usr)
    } catch {}
    const hasCookieToken = typeof document !== "undefined" && document.cookie.includes("token=")
    const hasStorageToken = typeof window !== "undefined" && !!localStorage.getItem("token")
    setTokenPresent(hasCookieToken || hasStorageToken)
  }, [])

  const login = (token: string, u: User) => {
    try { localStorage.setItem("token", token) } catch {}
    try { localStorage.setItem("user", JSON.stringify(u)) } catch {}
    if (typeof document !== "undefined") {
      document.cookie = `token=${token}; Path=/; SameSite=Lax`
    }
    setUser(u)
    setTokenPresent(true)
  }

  const logout = () => {
    try { localStorage.removeItem("token") } catch {}
    try { localStorage.removeItem("user") } catch {}
    if (typeof document !== "undefined") {
      document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax"
    }
    setUser(null)
    setTokenPresent(false)
  }

  const value = useMemo<AuthContextValue>(() => ({
    isAuthed: tokenPresent,
    user,
    setUser,
    login,
    logout,
  }), [tokenPresent, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}