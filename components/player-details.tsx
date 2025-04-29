"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { fetchPlayerById, updatePlayerStats, addPlayerAchievement } from "@/lib/player-actions"
import { getPlayerPerformanceHistory } from "@/lib/statistics-actions"
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
      const data = await getPlayerPerformanceHistory(playerId)
      setPerformanceData(data)
    } catch (error) {
      console.error("Failed to fetch performance data:", error)
    } finally {
      setPerformanceLoading(false)
    }
  }

  useEffect(() => {
    loadPlayer()
    loadPerformanceData()
  }, [playerId])

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
  const totalGames = player.stats?.games || 0
  const wins = player.stats?.wins || 0
  const losses = player.stats?.losses || 0
  const draws = player.stats?.draws || 0
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
              <Badge variant={player.active ? "success" : "outline"} className="ml-auto">
                {player.active ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Équipe: {player.team || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Position: {player.position || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Niveau: {player.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Score: {player.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Inscrit le: {new Date(player.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Dernière activité: {player.updated_at ? new Date(player.updated_at).toLocaleDateString() : "Inconnue"}
                </span>
              </div>
            </div>

            {player.bio && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Biographie</h3>
                <p className="text-sm text-muted-foreground">{player.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Statistiques du Joueur</CardTitle>
            <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Mettre à jour
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Mettre à jour les Statistiques du Joueur</DialogTitle>
                </DialogHeader>
                <PlayerStatForm initialStats={player.stats} onSubmit={handleUpdateStats} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{player.stats?.games || 0}</span>
                <span className="text-xs text-muted-foreground">Parties</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{player.stats?.wins || 0}</span>
                <span className="text-xs text-muted-foreground">Victoires</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{player.stats?.losses || 0}</span>
                <span className="text-xs text-muted-foreground">Défaites</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{totalCardsPlayed}</span>
                <span className="text-xs text-muted-foreground">Cartes Jouées</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{specialCardsPlayed}</span>
                <span className="text-xs text-muted-foreground">Cartes Spéciales</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                <span className="text-2xl font-bold">{player.stats?.points || 0}</span>
                <span className="text-xs text-muted-foreground">Points</span>
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
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{avgPointsPerGame}</div>
                  <div className="text-xs text-muted-foreground">Pts/Partie Moy.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">Historique de Performance</TabsTrigger>
          <TabsTrigger value="cards">Statistiques de Cartes</TabsTrigger>
          <TabsTrigger value="matches">Historique des Manches</TabsTrigger>
          <TabsTrigger value="achievements">Réalisations</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>Répartition des statistiques actuelles</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PlayerStatsChart stats={player.stats} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique de Performance</CardTitle>
              <CardDescription>Statistiques du joueur au fil du temps</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {performanceLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">Chargement des données de performance...</div>
                </div>
              ) : !performanceData ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">Aucune donnée de performance disponible</div>
                </div>
              ) : (
                <PlayerPerformanceChart data={performanceData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cards" className="mt-4">
          <PlayerCardStats playerId={playerId} cardStats={player.stats?.cardStats || []} onUpdate={loadPlayer} />
        </TabsContent>
        <TabsContent value="matches" className="mt-4">
          <PlayerMatchHistory playerId={playerId} />
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <PlayerAchievements achievements={player.stats?.achievements || []} onAddAchievement={handleAddAchievement} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

