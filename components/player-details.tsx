"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { fetchPlayerById, updatePlayerStats, addPlayerAchievement } from "@/lib/player-actions"
import { getPlayerPerformanceHistory, getPlayerStats, PlayerStats } from "@/lib/statistics-actions"
import { ArrowLeft, Award, BarChart3, Calendar, Edit, Trophy, UserRound, TrendingUp, Target, Clock } from "lucide-react"
import { PlayerStatsChart } from "./player-stats-chart"
import { PlayerAchievements } from "./player-achievements"
import { PlayerMatchHistory } from "./player-match-history"
import { PlayerStatForm } from "./player-stat-form"
import { PlayerPerformanceChart } from "./player-performance-chart"
import { PlayerCardStats } from "./player-card-stats"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface PlayerDetailsProps {
  playerId: string
}

export function PlayerDetails({ playerId }: PlayerDetailsProps) {
  const router = useRouter()
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [performanceLoading, setPerformanceLoading] = useState(true)
  const [playerStats, setPlayerStats] = useState<PlayerStats>()
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)

  const loadPlayer = async () => {
    setLoading(true)
    try {
      const data = await fetchPlayerById(playerId)
      setPlayer(data)
    } catch (error) {
      console.error("Failed to fetch player:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPerformanceData = async () => {
    setPerformanceLoading(true)
    try {
      //console.log(`Fetching performance data for player ${playerId}`); //DEBUG 

      const data = await getPlayerPerformanceHistory(playerId)
      setPerformanceData(data)
    } catch (error) {
      console.error("Failed to fetch performance data:", error)
    } finally {
      setPerformanceLoading(false)
    }
  }

  const generatePlayerStats = async () => {
    try {
      const stats = await getPlayerStats(playerId)
      console.log(`Generated stats for player ${playerId}:`, stats) //DEBUG

      setPlayerStats(stats)
    } catch (error) {
      console.error("Failed to fetch player stats:", error)
      toast.error("Échec de la récupération des statistiques du joueur")
    }
  }

  useEffect(() => {
    loadPlayer()
    loadPerformanceData()
    generatePlayerStats()
  }, [playerId])


  // Move this useEffect here, before any conditional returns
  const handleUpdateStats = async (stats: any) => {
    try {
      await updatePlayerStats(playerId, stats)
      toast.success("Statistiques du joueur mises à jour avec succès")
      setIsStatsDialogOpen(false)
      loadPlayer()
      loadPerformanceData()
    } catch (error) {
      console.error("Failed to update player stats:", error)
      toast.error("Échec de la mise à jour des statistiques du joueur")
    }
  }

  const handleAddAchievement = async (achievement: any) => {
    try {
      await addPlayerAchievement(playerId, achievement)
      toast.success("Réalisation ajoutée avec succès")
      loadPlayer()
    } catch (error) {
      console.error("Failed to add achievement:", error)
      toast.error("Échec de l'ajout de la réalisation")
    }
  }

  if (loading) {
    return <div className="py-6 text-center text-muted-foreground">Chargement des détails du joueur...</div>
  }

  if (!player) {
    return <div className="py-6 text-center text-muted-foreground">Joueur non trouvé</div>
  }

  // Calculate additional stats
  const totalGames: number = playerStats?.games || 0;
  const wins = playerStats?.wins || 0
  const losses = playerStats?.losses || 0
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0
  const avgPointsPerGame = totalGames > 0 ? Math.round((player.stats?.points || 0) / totalGames) : 0
  const totalCardsPlayed = player.stats?.cardsPlayed || 0
  const specialCardsPlayed = player.stats?.specialCardsPlayed || 0

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/players")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux Joueurs
      </Button>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{player.name}</CardTitle>
                <CardDescription>{player.username}</CardDescription>
              </div>
              <Badge variant={playerStats?.active ? "success" : "outline"} className="ml-auto">
                {playerStats?.active ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Inscrit le: {new Date(player.created_at).toLocaleDateString()}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Dernière activité: {player.updated_at ? new Date(player.updated_at).toLocaleDateString() : "Inconnue"}
                </span>
              </div> */}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Statistiques du Joueur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{playerStats?.games || 0}</span>
                <span className="text-xs text-muted-foreground">Parties</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{playerStats?.wins || 0}</span>
                <span className="text-xs text-muted-foreground">Victoires</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{playerStats?.losses || 0}</span>
                <span className="text-xs text-muted-foreground">Défaites</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{winRate}%</div>
                  <div className="text-xs text-muted-foreground">Taux de Victoire</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          {/* <TabsTrigger value="cards">Cartes</TabsTrigger> */}
          <TabsTrigger value="matches">Historique des Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>Répartition des statistiques actuelles</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PlayerStatsChart 
                wins={wins} 
                losses={losses} 
                totalGames={totalGames} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        {/* <TabsContent value="cards" className="mt-4">
          <PlayerCardStats playerId={playerId} cardStats={player.stats?.cardStats || []} onUpdate={loadPlayer} />
        </TabsContent> */}
        <TabsContent value="matches" className="mt-4">
          <PlayerMatchHistory playerId={playerId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

