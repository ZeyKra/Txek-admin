"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface PlayerFormProps {
  initialData: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
}

export function PlayerForm({ initialData, onSubmit }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    username: initialData.username || "",
    team: initialData.team || "",
    position: initialData.position || "",
    level: initialData.level || 1,
    score: initialData.score || 0,
    active: initialData.active !== undefined ? initialData.active : true,
    bio: initialData.bio || "",
    joinDate: initialData.joinDate || new Date().toISOString().split("T")[0],
    // Initialize stats if they exist, otherwise create empty stats
    stats: initialData.stats || {
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      points: 0,
      achievements: [],
    },
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStatChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const positions = [
    "Forward",
    "Midfielder",
    "Defender",
    "Goalkeeper",
    "Striker",
    "Winger",
    "Center",
    "Guard",
    "Pitcher",
    "Catcher",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom Complet</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Nom d'Utilisateur</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="team">Équipe</Label>
          <Input id="team" value={formData.team} onChange={(e) => handleChange("team", e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="position">Position</Label>
          <Select value={formData.position} onValueChange={(value) => handleChange("position", value)}>
            <SelectTrigger id="position">
              <SelectValue placeholder="Sélectionner une position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos.toLowerCase()}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="level">Niveau</Label>
          <Input
            id="level"
            type="number"
            min="1"
            value={formData.level}
            onChange={(e) => handleChange("level", Number.parseInt(e.target.value))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            type="number"
            value={formData.score}
            onChange={(e) => handleChange("score", Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="joinDate">Date d'Inscription</Label>
          <Input
            id="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleChange("joinDate", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 self-end">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => handleChange("active", checked)}
          />
          <Label htmlFor="active">Actif</Label>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio">Biographie</Label>
        <Textarea id="bio" value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} rows={3} />
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">Statistiques du Joueur</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="games">Matchs Joués</Label>
            <Input
              id="games"
              type="number"
              min="0"
              value={formData.stats.games}
              onChange={(e) => handleStatChange("games", Number.parseInt(e.target.value))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="wins">Victoires</Label>
            <Input
              id="wins"
              type="number"
              min="0"
              value={formData.stats.wins}
              onChange={(e) => handleStatChange("wins", Number.parseInt(e.target.value))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="losses">Défaites</Label>
            <Input
              id="losses"
              type="number"
              min="0"
              value={formData.stats.losses}
              onChange={(e) => handleStatChange("losses", Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="draws">Nuls</Label>
            <Input
              id="draws"
              type="number"
              min="0"
              value={formData.stats.draws}
              onChange={(e) => handleStatChange("draws", Number.parseInt(e.target.value))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={formData.stats.points}
              onChange={(e) => handleStatChange("points", Number.parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="mt-4">
        Enregistrer le Joueur
      </Button>
    </form>
  )
}

