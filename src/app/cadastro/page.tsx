"use client";
import { useState } from "react";
import Link from "next/link";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirm }),
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
          <h1 className="text-2xl font-semibold mb-1">Cadastre-se</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Crie sua conta para começar.
          </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-muted-foreground">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>
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
              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm text-muted-foreground">
                  Confirmar senha
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive-foreground bg-destructive/20 border border-destructive rounded-md px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
          <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground flex items-center justify-between">
            <Link href="/login" className="text-accent hover:underline">
              Já tenho conta
            </Link>
            <Link href="/redefinir-senha" className="text-accent hover:underline">
              Esqueci a senha
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}