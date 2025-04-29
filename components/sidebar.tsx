"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Database, FileCode, Globe, LayoutDashboard, Settings, UserRound, Users } from "lucide-react"

const sidebarItems = [
  {
    title: "Tableau de Bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Joueurs",
    href: "/dashboard/players",
    icon: UserRound,
  },
  {
    title: "Statistiques",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
  {
    title: "Tables",
    href: "/dashboard/tables",
    icon: Database,
  },
  {
    title: "Éditeur de Requêtes",
    href: "/dashboard/query",
    icon: FileCode,
  },
  {
    title: "Test d'API",
    href: "/dashboard/api-test",
    icon: Globe,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex flex-col gap-2 p-6">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </aside>
  )
}

