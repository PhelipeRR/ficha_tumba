const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

async function request<T>(path: string, options: RequestInit = {}, useAuth = false): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }
  if (useAuth) {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null
    if (token) headers["Authorization"] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Erro ${res.status}`
    throw new Error(String(msg))
  }
  return data as T
}

export const api = {
  async signup(email: string, password: string, name?: string | null) {
    return request<{ token: string; user: { id: number; email: string; name: string | null } }>(
      "/auth/signup",
      { method: "POST", body: JSON.stringify({ email, password, name }) }
    )
  },
  async login(email: string, password: string) {
    return request<{ token: string; user: { id: number; email: string; name: string | null } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    )
  },
  async recoverStart(email: string) {
    return request<{ message: string; previewUrl?: string }>(
      "/auth/recover/start",
      { method: "POST", body: JSON.stringify({ email }) }
    )
  },
  async recoverComplete(token: string, newPassword: string) {
    return request<{ message: string }>(
      "/auth/recover/complete",
      { method: "POST", body: JSON.stringify({ token, newPassword }) }
    )
  },
  async getFichas() {
    return request<Array<{ id: number; userId: number; characterName: string; dataJson: any; createdAt: string; updatedAt: string }>>(
      "/fichas",
      { method: "GET" },
      true
    )
  },
  async createFicha(characterName: string, data: any) {
    return request<{ id: number; userId: number; characterName: string; dataJson: any; createdAt: string; updatedAt: string }>(
      "/fichas",
      { method: "POST", body: JSON.stringify({ characterName, data }) },
      true
    )
  },
  async getFicha(id: number) {
    return request<{ id: number; userId: number; characterName: string; dataJson: any; createdAt: string; updatedAt: string }>(
      `/fichas/${id}`,
      { method: "GET" },
      true
    )
  },
  async deleteFicha(id: number) {
    return request<{ message: string }>(`/fichas/${id}`, { method: "DELETE" }, true)
  },
  async getMe() {
    return request<{ id: number; email: string; name: string | null }>(
      "/auth/me",
      { method: "GET" },
      true
    )
  },
  async updateMe(payload: { name?: string | null; email?: string }) {
    return request<{ id: number; email: string; name: string | null }>(
      "/auth/me",
      { method: "PATCH", body: JSON.stringify(payload) },
      true
    )
  },
  async updateAccount(payload: { email?: string; name?: string | null }) {
    return request<{ user: { id: number; email: string; name: string | null; avatarBase64: string | null } }>(
      "/auth/account",
      { method: "PATCH", body: JSON.stringify(payload) },
      true
    )
  },
  async changePassword(currentPassword: string, newPassword: string) {
    return request<{ message: string }>(
      "/auth/password",
      { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) },
      true
    )
  },
}