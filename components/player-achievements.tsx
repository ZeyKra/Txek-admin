"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Calendar, Plus } from "lucide-react"

interface Achievement {
  title: string
  description: string
  date: string
  icon?: string
}

interface PlayerAchievementsProps {
  achievements: Achievement[]
  onAddAchievement: (achievement: Achievement) => void
}

export function PlayerAchievements({ achievements, onAddAchievement }: PlayerAchievementsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    icon: "award",
  })

  const handleChange = (field: keyof Achievement, value: string) => {
    setNewAchievement((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddAchievement(newAchievement)
    setIsDialogOpen(false)
    setNewAchievement({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      icon: "award",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Réalisations du Joueur</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Réalisation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une Nouvelle Réalisation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newAchievement.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAchievement.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAchievement.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Enregistrer la Réalisation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {achievements.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            Aucune réalisation pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">{achievement.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{achievement.description}</CardDescription>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(achievement.date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

