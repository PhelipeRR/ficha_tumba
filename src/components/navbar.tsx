import React from "react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-primary via-destructive to-secondary backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center">
              <img src="/logo.png" alt="Tumba de Nazarick Logo" width={56} height={56} className="object-contain" />
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
          </div>
        </div>
      </div>
    </nav>
  )
}
