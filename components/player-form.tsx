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


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">

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

      <Button type="submit" className="mt-4">
        Enregistrer le Joueur
      </Button>
    </form>
  )
}

