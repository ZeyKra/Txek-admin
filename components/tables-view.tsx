"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchTables, fetchTableInfo, countTable } from "@/lib/surreal-actions"
import { ExternalLink, Search } from "lucide-react"
import { toast } from "sonner"

interface TableInfo {
  name: string
  recordCount: number
}

export function TablesView() {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const getTables = async () => {
      try {
        const tableNames = await fetchTables()
        if (tableNames.length === 0) {
          setTables([])
          setLoading(false)
          return
        }

        const tableInfoPromises = tableNames.map(async (name) => {
          try {
            const count = await countTable(name)
            return { name, recordCount: count }
          } catch (error) {
            console.error(`Failed to fetch info for table ${name}:`, error)
            return { name, recordCount: 0 }
          }
        })

        const tableInfo = await Promise.all(tableInfoPromises)
        setTables(tableInfo)
      } catch (error) {
        console.error("Failed to fetch tables:", error)
        toast.error("Échec de récupération des tables", {
          description: "Veuillez vérifier vos paramètres de connexion et la version de SurrealDB",
        })
      } finally {
        setLoading(false)
      }
    }

    getTables()
  }, [])

  const filteredTables = tables.filter((table) => table.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des tables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full md:w-[300px]"
        />
      </div>
      {loading ? (
        <div className="py-6 text-center text-muted-foreground">Chargement des tables...</div>
      ) : tables.length === 0 ? (
        <div className="py-6 text-center text-muted-foreground">Aucune table trouvée dans la base de données</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la Table</TableHead>
                <TableHead className="text-right">Nombre d'Enregistrements</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell className="text-right">{table.recordCount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                      <Link href={`/dashboard/tables/${encodeURIComponent(table.name)}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Voir la table</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

