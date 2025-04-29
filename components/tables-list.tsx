"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { fetchTables } from "@/lib/surreal-actions"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"

export function TablesList() {
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getTables = async () => {
      try {
        const data = await fetchTables()
        setTables(data)
      } catch (error) {
        console.error("Failed to fetch tables:", error)
        toast.error("Échec de récupération des tables")
      } finally {
        setLoading(false)
      }
    }

    getTables()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tables de la Base de Données</CardTitle>
        <CardDescription>Liste des tables dans votre base de données SurrealDB</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-muted-foreground">Chargement des tables...</div>
        ) : tables.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">Aucune table trouvée dans la base de données</div>
        ) : (
          <Table>
            <TableBody>
              {tables.slice(0, 5).map((table) => (
                <TableRow key={table}>
                  <TableCell className="font-medium">{table}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                      <Link href={`/dashboard/tables/${encodeURIComponent(table)}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Voir la table</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {tables.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/tables">Voir toutes les tables</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

