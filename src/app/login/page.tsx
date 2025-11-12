"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  try {
      const data = await api.login(email, password);
      // Atualiza contexto (inclui salvar token/user e cookie)
      login(data.token, data.user);
      // redireciona para rota protegida (ou home)
      router.replace(nextParam);
    } catch (err: any) {
      setError(String(err?.message || "Erro ao fazer login"));
    } finally {
      setLoading(false);
    }
  };

  // Redireciona automaticamente se já estiver autenticado
  useEffect(() => {
    const hasCookieToken = typeof document !== "undefined" && document.cookie.includes("token=");
    const hasStorageToken = typeof window !== "undefined" && !!localStorage.getItem("token");
    if (hasCookieToken || hasStorageToken) {
      router.replace(nextParam || "/");
    }
  }, [router, nextParam]);

  return (
    <main className="flex-1 bg-white py-8 px-4 flex items-center justify-center">
      <div className="mx-auto max-w-md">
        <div className="bg-card border-2 border-yellow-600 rounded-lg p-6 shadow-sm">
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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-input text-foreground border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none pr-20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground bg-muted/30 px-2 py-1 rounded"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
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

export default function LoginPage() {
  // Envolve o conteúdo em Suspense para uso de useSearchParams sem erro de build
  return (
    <Suspense fallback={(
      <main className="flex-1 bg-white py-8 px-4 flex items-center justify-center">
        <div className="mx-auto max-w-md">
          <div className="bg-card border-2 border-yellow-600 rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-1">Entrar</h1>
            <p className="text-sm text-muted-foreground">Carregando…</p>
          </div>
        </div>
      </main>
    )}>
      <LoginContent />
    </Suspense>
  )
}