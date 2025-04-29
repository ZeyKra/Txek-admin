"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ban, Plus, RotateCw, Shuffle } from "lucide-react"
import { toast } from "sonner"
import { updatePlayerStats } from "@/lib/player-actions"

interface PlayerCardStatsProps {
  playerId: string
  cardStats: any[]
  onUpdate: () => void
}

export function PlayerCardStats({ playerId, cardStats = [], onUpdate }: PlayerCardStatsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCardStat, setNewCardStat] = useState({
    color: "red",
    type: "number",
    name: "Carte Numéro",
    played: 0,
    wins: 0,
  })

  const handleAddCardStat = async () => {
    try {
      const updatedCardStats = [...cardStats, newCardStat]
      await updatePlayerStats(playerId, { cardStats: updatedCardStats })
      toast.success("Statistique de carte ajoutée avec succès")
      setIsAddDialogOpen(false)
      setNewCardStat({
        color: "red",
        type: "number",
        name: "Carte Numéro",
        played: 0,
        wins: 0,
      })
      onUpdate()
    } catch (error) {
      console.error("Failed to add card stat:", error)
      toast.error("Échec de l'ajout de la statistique de carte")
    }
  }

  // Get card icon based on type
  const getCardIcon = (type: string) => {
    switch (type) {
      case "skip":
        return <Ban className="h-5 w-5 text-red-500" />
      case "reverse":
        return <RotateCw className="h-5 w-5 text-blue-500" />
      case "draw2":
        return <Plus className="h-5 w-5 text-green-500" />
      case "wild":
        return <Shuffle className="h-5 w-5 text-purple-500" />
      case "wild4":
        return <Plus className="h-5 w-5 text-amber-500" />
      default:
        return null
    }
  }

  // Get color name
  const getColorName = (color: string) => {
    switch (color) {
      case "red":
        return "Rouge"
      case "blue":
        return "Bleu"
      case "green":
        return "Vert"
      case "yellow":
        return "Jaune"
      case "black":
        return "Noir"
      default:
        return color
    }
  }

  // Get color class for badge
  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 text-white"
      case "blue":
        return "bg-blue-500 text-white"
      case "green":
        return "bg-green-500 text-white"
      case "yellow":
        return "bg-yellow-500 text-black"
      case "black":
        return "bg-black text-white"
      default:
        return ""
    }
  }

  // Calculate win rate
  const calculateWinRate = (played: number, wins: number) => {
    if (played === 0) return 0
    return Math.round((wins / played) * 100)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Statistiques des Cartes</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une Statistique
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une Statistique de Carte</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la Carte</Label>
                <Input
                  id="name"
                  value={newCardStat.name}
                  onChange={(e) => setNewCardStat({ ...newCardStat, name: e.target.value })}
                  placeholder="Ex: +4 Joker"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="color">Couleur</Label>
                  <Select
                    value={newCardStat.color}
                    onValueChange={(value) => setNewCardStat({ ...newCardStat, color: value })}
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Sélectionner une couleur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Rouge</SelectItem>
                      <SelectItem value="blue">Bleu</SelectItem>
                      <SelectItem value="green">Vert</SelectItem>
                      <SelectItem value="yellow">Jaune</SelectItem>
                      <SelectItem value="black">Noir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newCardStat.type}
                    onValueChange={(value) => setNewCardStat({ ...newCardStat, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Numéro</SelectItem>
                      <SelectItem value="skip">Passer</SelectItem>
                      <SelectItem value="reverse">Inverser</SelectItem>
                      <SelectItem value="draw2">+2</SelectItem>
                      <SelectItem value="wild">Joker</SelectItem>
                      <SelectItem value="wild4">+4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="played">Nombre Joué</Label>
                  <Input
                    id="played"
                    type="number"
                    min="0"
                    value={newCardStat.played}
                    onChange={(e) => setNewCardStat({ ...newCardStat, played: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wins">Victoires</Label>
                  <Input
                    id="wins"
                    type="number"
                    min="0"
                    value={newCardStat.wins}
                    onChange={(e) => setNewCardStat({ ...newCardStat, wins: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleAddCardStat} disabled={!newCardStat.name}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {cardStats.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">Aucune statistique de carte disponible</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carte</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Couleur</TableHead>
                <TableHead>Jouée</TableHead>
                <TableHead>Victoires</TableHead>
                <TableHead className="text-right">Taux de Victoire</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCardIcon(stat.type)}
                      <span>{stat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {stat.type === "number"
                      ? "Numéro"
                      : stat.type === "skip"
                        ? "Passer"
                        : stat.type === "reverse"
                          ? "Inverser"
                          : stat.type === "draw2"
                            ? "+2"
                            : stat.type === "wild"
                              ? "Joker"
                              : stat.type === "wild4"
                                ? "+4"
                                : stat.type}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getColorClass(stat.color)} h-3 w-3 rounded-full p-0`} />
                      {getColorName(stat.color)}
                    </div>
                  </TableCell>
                  <TableCell>{stat.played}</TableCell>
                  <TableCell>{stat.wins}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={calculateWinRate(stat.played, stat.wins) > 50 ? "success" : "outline"}>
                      {calculateWinRate(stat.played, stat.wins)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

