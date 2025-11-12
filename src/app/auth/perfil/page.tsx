"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PerfilPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarBase64(typeof user.avatarBase64 === "string" ? (user.avatarBase64 as string) : null);
    }
    // opcional: buscar dados com a API se disponível
    api.getMe().then((me) => {
      setName(me.name || "");
      setEmail(me.email || "");
      // avatarBase64 pode não estar disponível em /auth/me; manter valor existente
      setUser({ ...me, avatarBase64 });
    }).catch(() => { /* ignora se não implementado no backend */ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarFile = async (file: File) => {
    setAvatarError(null);
    const maxBytes = 4 * 1024 * 1024; // ~4MB
    if (file.size > maxBytes) {
      setAvatarError("Imagem muito grande (máx ~4MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // aceita data:image/...;base64,... ou base64 puro
      if (result.startsWith("data:")) {
        setAvatarBase64(result);
      } else {
        // caso improvável em FileReader, mas garantimos compatibilidade
        setAvatarBase64(result);
      }
    };
    reader.onerror = () => setAvatarError("Falha ao ler a imagem.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const payload: { name?: string | null; email?: string; avatarBase64?: string | null } = {};
      if (name !== undefined) payload.name = name || null;
      if (email) payload.email = email;
      // avatar: pode ser string (data URL/base64) ou null para limpar
      if (avatarBase64 !== undefined) payload.avatarBase64 = avatarBase64;
      const updated = await api.updateAccount(payload);
      setUser(updated.user)
      setMessage("Perfil atualizado com sucesso.");
    } catch (err: any) {
      setError(String(err?.message || "Erro ao atualizar perfil"));
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background py-8 px-4 flex items-center justify-center">
        <div className="mx-auto max-w-md">
          <div className="bg-card border-2 border-yellow-600 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold mb-1">Perfil</h1>
          <p className="text-sm text-muted-foreground mb-6">Atualize suas informações da conta.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center hover:ring-2 hover:ring-ring transition"
                aria-label="Clique para alterar avatar"
              >
                {avatarBase64 ? (
                  <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold">
                    {(name || email || "?").trim().charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAvatarFile(f);
                }}
                className="sr-only"
              />
              {avatarBase64 && (
                <button
                  type="button"
                  onClick={() => setAvatarBase64(null)}
                  className="text-xs text-destructive-foreground hover:underline"
                >
                  Remover
                </button>
              )}
            </div>
            {avatarError && (
              <p className="text-center text-xs text-destructive-foreground bg-destructive/20 border border-destructive rounded-md px-3 py-2">{avatarError}</p>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-muted-foreground">Nome</label>
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
              <label htmlFor="email" className="text-sm text-muted-foreground">E-mail</label>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
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
              onClick={() => router.push("/auth/alterar-senha")}
              className="text-accent hover:underline"
            >
              Alterar senha
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
  );
}