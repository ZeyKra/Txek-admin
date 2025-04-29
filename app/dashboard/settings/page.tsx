import { DashboardShell } from "@/components/dashboard-shell"
import { ConnectionSettings } from "@/components/connection-settings"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        </div>
        <ConnectionSettings />
      </div>
    </DashboardShell>
  )
}

