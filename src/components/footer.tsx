import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-gradient-to-r from-secondary via-accent to-primary">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-white/90">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-white fill-white" />
            <span>para jogadores de Tormenta 20</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span>© 2025 Tumba de Nazarick</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">•</span>
            <span className="text-xs text-white/80">Tumba de Nazarick</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
