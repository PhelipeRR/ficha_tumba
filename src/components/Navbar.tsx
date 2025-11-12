"use client"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export function Navbar() {
  const router = useRouter()
  const { isAuthed, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarLabel, setAvatarLabel] = useState<string>("?")
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const base = (user?.name || user?.email || "?").trim()
    setAvatarLabel(base ? base.charAt(0).toUpperCase() : "?")
    setAvatarSrc(typeof user?.avatarBase64 === "string" ? (user!.avatarBase64 as string) : null)
  }, [user])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-primary via-destructive to-secondary backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center">
              <Image src="/logo.png" alt="Tumba de Nazarick Logo" width={56} height={56} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">Tumba de Nazarick</h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://jamboeditora.com.br/produto/tormenta20/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Sobre o Jogo
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              GitHub
            </a>
            {isAuthed && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 text-white font-semibold border-2 border-border hover:bg-white/30 overflow-hidden"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Perfil"
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-base md:text-lg">{avatarLabel}</span>
                  )}
                </button>
                {menuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-card shadow-lg p-1">
                    <button
                      role="menuitem"
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm"
                      onClick={() => { setMenuOpen(false); router.push("/auth/perfil") }}
                    >
                      Editar perfil
                    </button>
                    <button
                      role="menuitem"
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm"
                      onClick={() => { setMenuOpen(false); router.push("/auth/alterar-senha") }}
                    >
                      Alterar senha
                    </button>
                    <button
                      role="menuitem"
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-600/10"
                      onClick={() => { setMenuOpen(false); handleLogout() }}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
