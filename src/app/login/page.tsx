"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        const messages = Object.values<string[]>(data.errors || {}).flat();
        setError(messages.join(". "));
        return;
      }
      // sucesso: aqui você pode redirecionar ou mostrar feedback
    } catch (err) {
      setError("Falha ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-red-600 py-8 px-4 flex items-center justify-center">
      <div className="mx-auto max-w-md">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center mb-4">
            <div className="logo-red" role="img" aria-label="Logo" />
          </div>
          <h1 className="text-2xl font-semibold mb-1">Entrar</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Acesse sua conta para continuar.
          </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-muted-foreground">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-muted-foreground">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          {error && (
            <p className="mt-4 text-sm text-destructive-foreground bg-destructive/20 border border-destructive rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground flex items-center justify-between">
            <Link href="/redefinir-senha" className="text-accent hover:underline">
              Esqueceu a senha?
            </Link>
            <Link href="/cadastro" className="text-accent hover:underline">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}