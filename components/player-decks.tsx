"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Layers, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { updatePlayerStats } from "@/lib/player-actions"

interface PlayerDecksProps {
  playerId: string
  decks: any[]
  onUpdate: () => void
}

export function PlayerDecks({ playerId, decks = [], onUpdate }: PlayerDecksProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<any>(null)
  const [newDeck, setNewDeck] = useState({
    id: `deck:${Date.now()}`,
    name: "",
    description: "",
    type: "standard",
    cards: [],
    createdAt: new Date().toISOString(),
    lastUsed: null,
    wins: 0,
    losses: 0,
  })

  const handleCreateDeck = async () => {
    try {
      const updatedDecks = [...decks, newDeck]
      await updatePlayerStats(playerId, { decks: updatedDecks })
      toast.success("Deck créé avec succès")
      setIsCreateDialogOpen(false)
      setNewDeck({
        id: `deck:${Date.now()}`,
        name: "",
        description: "",
        type: "standard",
        cards: [],
        createdAt: new Date().toISOString(),
        lastUsed: null,
        wins: 0,
        losses: 0,
      })
      onUpdate()
    } catch (error) {
      console.error("Failed to create deck:", error)
      toast.error("Échec de la création du deck")
    }
  }

  const handleEditDeck = async () => {
    try {
      const updatedDecks = decks.map((deck) => (deck.id === selectedDeck.id ? selectedDeck : deck))
      await updatePlayerStats(playerId, { decks: updatedDecks })
      toast.success("Deck mis à jour avec succès")
      setIsEditDialogOpen(false)
      onUpdate()
    } catch (error) {
      console.error("Failed to update deck:", error)
      toast.error("Échec de la mise à jour du deck")
    }
  }

  const handleDeleteDeck = async (deckId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce deck ?")) {
      try {
        const updatedDecks = decks.filter((deck) => deck.id !== deckId)
        await updatePlayerStats(playerId, { decks: updatedDecks })
        toast.success("Deck supprimé avec succès")
        onUpdate()
      } catch (error) {
        console.error("Failed to delete deck:", error)
        toast.error("Échec de la suppression du deck")
      }
    }
  }

  const getDeckTypeLabel = (type: string) => {
    switch (type) {
      case "standard":
        return "Standard"
      case "competitive":
        return "Compétitif"
      case "casual":
        return "Casual"
      case "special":
        return "Spécial"
      default:
        return type
    }
  }

  const getDeckTypeVariant = (type: string) => {
    switch (type) {
      case "standard":
        return "default"
      case "competitive":
        return "destructive"
      case "casual":
        return "secondary"
      case "special":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Decks du Joueur</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Deck
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Deck</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom du Deck</Label>
                <Input
                  id="name"
                  value={newDeck.name}
                  onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                  placeholder="Ex: Deck Dragon"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  placeholder="Décrivez votre deck et sa stratégie..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type de Deck</Label>
                <Select value={newDeck.type} onValueChange={(value) => setNewDeck({ ...newDeck, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="competitive">Compétitif</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="special">Spécial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateDeck} disabled={!newDeck.name}>
                Créer le Deck
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">Aucun deck créé pour le moment</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {decks.map((deck) => (
            <Card key={deck.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{deck.name}</CardTitle>
                  </div>
                  <Badge variant={getDeckTypeVariant(deck.type)}>{getDeckTypeLabel(deck.type)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{deck.description || "Aucune description"}</p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>{deck.cards?.length || 0} cartes</span>
                  </div>
                  <div>
                    <span className="text-green-500">{deck.wins || 0}W</span>
                    {" / "}
                    <span className="text-red-500">{deck.losses || 0}L</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Créé le {new Date(deck.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setSelectedDeck(deck)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteDeck(deck.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le Deck</DialogTitle>
          </DialogHeader>
          {selectedDeck && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nom du Deck</Label>
                <Input
                  id="edit-name"
                  value={selectedDeck.name}
                  onChange={(e) => setSelectedDeck({ ...selectedDeck, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedDeck.description}
                  onChange={(e) => setSelectedDeck({ ...selectedDeck, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type de Deck</Label>
                <Select
                  value={selectedDeck.type}
                  onValueChange={(value) => setSelectedDeck({ ...selectedDeck, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="competitive">Compétitif</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="special">Spécial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-wins">Victoires</Label>
                  <Input
                    id="edit-wins"
                    type="number"
                    min="0"
                    value={selectedDeck.wins || 0}
                    onChange={(e) => setSelectedDeck({ ...selectedDeck, wins: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-losses">Défaites</Label>
                  <Input
                    id="edit-losses"
                    type="number"
                    min="0"
                    value={selectedDeck.losses || 0}
                    onChange={(e) => setSelectedDeck({ ...selectedDeck, losses: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleEditDeck} disabled={!selectedDeck.name}>
                Enregistrer les Modifications
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

