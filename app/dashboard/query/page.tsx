import { DashboardShell } from "@/components/dashboard-shell"
import { QueryEditor } from "@/components/query-editor"

export default function QueryPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Éditeur de Requêtes</h1>
        </div>
        <QueryEditor />
      </div>
    </DashboardShell>
  )
}

