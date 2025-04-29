import { DashboardShell } from "@/components/dashboard-shell"
import { PlayerDetails } from "@/components/player-details"

export default function PlayerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Détails du Joueur</h1>
        </div>
        <PlayerDetails playerId={params.id} />
      </div>
    </DashboardShell>
  )
}

