"use client"
import React, { useState } from "react"
import { api } from "@/lib/api"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useRouter } from "next/navigation"

export default function AlterarSenhaPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    if (!currentPassword || !newPassword) {
      setError("Informe a senha atual e a nova senha.")
      setLoading(false)
      return
    }
    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      setLoading(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setError("A confirmação da senha não confere.")
      setLoading(false)
      return
    }

    try {
      const res = await api.changePassword(currentPassword, newPassword)
      setMessage(res.message || "Senha alterada com sucesso.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(String(err?.message || "Erro ao alterar senha"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background py-8 px-4 flex items-center justify-center">
        <div className="mx-auto max-w-md">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-1">Alterar senha</h1>
            <p className="text-sm text-muted-foreground mb-6">Defina uma nova senha para sua conta.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm text-muted-foreground">Senha atual</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm text-muted-foreground">Nova senha</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirmar nova senha</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-secondary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Alterando..." : "Alterar senha"}
              </button>
            </form>
            {message && (
              <p className="mt-4 text-sm text-accent">{message}</p>
            )}
            {error && (
              <p className="mt-4 text-sm text-destructive-foreground bg-destructive/20 border border-destructive rounded-md px-3 py-2">{error}</p>
            )}

            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push("/auth/perfil")}
                className="text-accent hover:underline"
              >
                Editar perfil
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-accent hover:underline"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}