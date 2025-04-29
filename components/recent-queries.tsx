"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentQueries } from "@/lib/query-history"

export function RecentQueries() {
  const [queries, setQueries] = useState<{ query: string; timestamp: number }[]>([])

  useEffect(() => {
    const recentQueries = getRecentQueries()
    setQueries(recentQueries)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requêtes Récentes</CardTitle>
        <CardDescription>Vos requêtes récemment exécutées</CardDescription>
      </CardHeader>
      <CardContent>
        {queries.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">Aucune requête récente trouvée</div>
        ) : (
          <div className="space-y-4">
            {queries.map((item, index) => (
              <div key={index} className="rounded-md bg-muted p-3">
                <div className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</div>
                <pre className="mt-2 overflow-x-auto text-xs">{item.query}</pre>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

