import { DashboardShell } from "@/components/dashboard-shell"
import { PlayersManagement } from "@/components/players-management"

export default function PlayersPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Joueurs</h1>
        </div>
        <PlayersManagement />
      </div>
    </DashboardShell>
  )
}

