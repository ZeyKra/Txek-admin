"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchStatistics } from "@/lib/statistics-actions"
import { TopPlayersTable } from "./top-players-table"
import { StatisticsChart } from "./statistics-chart"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function StatisticsOverview() {
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const data = await fetchStatistics()
      setStatistics(data)
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
      toast.error("Échec du chargement des statistiques", {
        description: "Une erreur s'est produite lors de la récupération des données statistiques.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await fetchStatistics()
      setStatistics(data)
      toast.success("Statistiques actualisées avec succès")
    } catch (error) {
      console.error("Failed to refresh statistics:", error)
      toast.error("Échec de l'actualisation des statistiques")
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return <div className="py-6 text-center text-muted-foreground">Chargement des statistiques...</div>
  }

  if (!statistics) {
    return <div className="py-6 text-center text-muted-foreground">Échec du chargement des statistiques</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tableau de Bord Statistiques</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Actualisation..." : "Actualiser les Données"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Joueurs Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">{statistics.newPlayers} nouveaux ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Joueurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.activePlayers}</div>
            <p className="text-xs text-muted-foreground">{statistics.activePlayersPercentage}% du total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Matchs Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalMatches}</div>
            <p className="text-xs text-muted-foreground">{statistics.matchesThisMonth} ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.scoreChange > 0 ? "+" : ""}
              {statistics.scoreChange}% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="players">Meilleurs Joueurs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des Performances</CardTitle>
              <CardDescription>Métriques d'activité et de performance des joueurs au fil du temps</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <StatisticsChart data={statistics.chartData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="players" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Meilleurs Joueurs</CardTitle>
              <CardDescription>Joueurs classés par score et performance</CardDescription>
            </CardHeader>
            <CardContent>
              <TopPlayersTable players={statistics.topPlayers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

