import Link from "next/link"
import { Database } from "lucide-react"

export function MainNav() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <span className="font-bold">Txek Admin</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/dashboard/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Paramètres
          </Link>
        </nav>
      </div>
    </header>
  )
}

