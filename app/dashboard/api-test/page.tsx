import { DashboardShell } from "@/components/dashboard-shell"
import { ApiTester } from "@/components/api-tester"

export default function ApiTestPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Test d'API</h1>
        </div>
        <ApiTester />
      </div>
    </DashboardShell>
  )
}

