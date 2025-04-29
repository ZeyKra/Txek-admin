"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { executeQuery } from "@/lib/surreal-actions"
import { addQueryToHistory } from "@/lib/query-history"
import { Play } from "lucide-react"
import { toast } from "sonner"

export function QueryEditor() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleExecute = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await executeQuery(query)
      setResults(result)
      addQueryToHistory(query)
      toast.success("Requête exécutée avec succès")
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'exécution de la requête")
      toast.error("Échec de l'exécution de la requête", {
        description: err.message || "Une erreur s'est produite lors de l'exécution de la requête",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-md border">
        <div className="flex items-center justify-between border-b p-2">
          <div className="text-sm font-medium">Requête SQL</div>
          <Button size="sm" onClick={handleExecute} disabled={isLoading || !query.trim()}>
            <Play className="mr-2 h-4 w-4" />
            Exécuter
          </Button>
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[200px] w-full resize-y rounded-md bg-transparent p-4 font-mono text-sm outline-none"
          placeholder="SELECT * FROM table;"
        />
      </div>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Résultats</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="results" className="rounded-md border p-4">
          {isLoading ? (
            <div className="py-4 text-center text-muted-foreground">Exécution de la requête...</div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-4 text-destructive">{error}</div>
          ) : !results ? (
            <div className="py-4 text-center text-muted-foreground">Exécutez une requête pour voir les résultats</div>
          ) : Array.isArray(results) && results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((key) => (
                      <th key={key} className="border px-4 py-2 text-left text-sm font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row: any, i: number) => (
                    <tr key={i}>
                      {Object.values(row).map((value: any, j: number) => (
                        <td key={j} className="border px-4 py-2 text-sm">
                          {typeof value === "object" ? JSON.stringify(value) : String(value ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              Requête exécutée avec succès. {Array.isArray(results) ? results.length : 0} résultats retournés.
            </div>
          )}
        </TabsContent>
        <TabsContent value="json" className="rounded-md border">
          <pre className="overflow-x-auto p-4 text-sm">
            {isLoading
              ? "Exécution de la requête..."
              : error
                ? JSON.stringify({ error }, null, 2)
                : results
                  ? JSON.stringify(results, null, 2)
                  : "Exécutez une requête pour voir les résultats"}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}

