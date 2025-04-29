"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Table, Clock, Users, UserRound, Trophy } from "lucide-react"
import { fetchDatabaseStats } from "@/lib/surreal-actions"
import { toast } from "sonner"

export function DatabaseStats() {
  const [stats, setStats] = useState({
    tables: 0,
    records: 0,
    uptime: "0s",
    version: "",
    users: 0,
    players: 0,
    activePlayers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDatabaseStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch database stats:", error)
        toast.error("Échec de récupération des statistiques de la base de données", {
          description: "Veuillez vérifier vos paramètres de connexion",
        })
      } finally {
        setLoading(false)
      }
    }

    getStats()
  }, [])

  const statCards = [
    {
      title: "Tables",
      value: stats.tables.toString(),
      icon: Table,
    },
    {
      title: "Enregistrements",
      value: stats.records.toString(),
      icon: Database,
    },
    {
      title: "Utilisateurs",
      value: stats.users.toString(),
      icon: Users,
    },
    {
      title: "Joueurs",
      value: stats.players.toString(),
      icon: UserRound,
    },
    {
      title: "Joueurs Actifs",
      value: stats.activePlayers.toString(),
      icon: Trophy,
    },
    {
      title: "Temps de Fonctionnement",
      value: stats.uptime,
      icon: Clock,
    },
  ]

  return (
    <>
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "Chargement..." : card.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

