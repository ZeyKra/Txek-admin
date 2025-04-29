"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlayerStatFormProps {
  initialStats: {
    games: number
    wins: number
    losses: number
    draws: number
    points: number
    cardsPlayed: number
    specialCardsPlayed: number
    [key: string]: any
  }
  onSubmit: (stats: any) => void
}

export function PlayerStatForm({ initialStats, onSubmit }: PlayerStatFormProps) {
  const [stats, setStats] = useState({
    games: initialStats?.games || 0,
    wins: initialStats?.wins || 0,
    losses: initialStats?.losses || 0,
    draws: initialStats?.draws || 0,
    points: initialStats?.points || 0,
    cardsPlayed: initialStats?.cardsPlayed || 0,
    specialCardsPlayed: initialStats?.specialCardsPlayed || 0,
    // Préserver les autres propriétés
    cardStats: initialStats?.cardStats || [],
    achievements: initialStats?.achievements || [],
  })

  const handleChange = (field: string, value: number) => {
    setStats((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...initialStats,
      ...stats,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Statistiques Générales</TabsTrigger>
          <TabsTrigger value="cards">Statistiques de Cartes</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="games">Parties Jouées</Label>
              <Input
                id="games"
                type="number"
                min="0"
                value={stats.games}
                onChange={(e) => handleChange("games", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="points">Points Totaux</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={stats.points}
                onChange={(e) => handleChange("points", Number.parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="wins">Victoires</Label>
              <Input
                id="wins"
                type="number"
                min="0"
                value={stats.wins}
                onChange={(e) => handleChange("wins", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="losses">Défaites</Label>
              <Input
                id="losses"
                type="number"
                min="0"
                value={stats.losses}
                onChange={(e) => handleChange("losses", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="draws">Nuls</Label>
              <Input
                id="draws"
                type="number"
                min="0"
                value={stats.draws}
                onChange={(e) => handleChange("draws", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cardsPlayed">Cartes Jouées</Label>
              <Input
                id="cardsPlayed"
                type="number"
                min="0"
                value={stats.cardsPlayed}
                onChange={(e) => handleChange("cardsPlayed", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specialCardsPlayed">Cartes Spéciales Jouées</Label>
              <Input
                id="specialCardsPlayed"
                type="number"
                min="0"
                value={stats.specialCardsPlayed}
                onChange={(e) => handleChange("specialCardsPlayed", Number.parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Note: Les statistiques détaillées par type de carte peuvent être gérées dans l'onglet "Statistiques de
              Cartes".
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="mt-4">
        Mettre à Jour les Statistiques
      </Button>
    </form>
  )
}

