import { DashboardShell } from "@/components/dashboard-shell"
import { StatisticsOverview } from "@/components/statistics-overview"

export default function StatisticsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
        </div>
        <StatisticsOverview />
      </div>
    </DashboardShell>
  )
}

