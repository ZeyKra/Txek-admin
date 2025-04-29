import { DashboardShell } from "@/components/dashboard-shell"
import { TableDataView } from "@/components/table-data-view"

export default function TablePage({ params }: { params: { table: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Table: {decodeURIComponent(params.table)}</h1>
        </div>
        <TableDataView tableName={decodeURIComponent(params.table)} />
      </div>
    </DashboardShell>
  )
}

