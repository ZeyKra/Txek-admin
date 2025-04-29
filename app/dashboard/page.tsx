import { DashboardShell } from "@/components/dashboard-shell"
import { DatabaseStats } from "@/components/database-stats"
import { RecentQueries } from "@/components/recent-queries"
import { TablesList } from "@/components/tables-list"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DatabaseStats />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <TablesList />
          <RecentQueries />
        </div>
      </div>
    </DashboardShell>
  )
}

