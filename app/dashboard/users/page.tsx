import { DashboardShell } from "@/components/dashboard-shell"
import { UsersManagement } from "@/components/users-management"

export default function UsersPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        </div>
        <UsersManagement />
      </div>
    </DashboardShell>
  )
}

