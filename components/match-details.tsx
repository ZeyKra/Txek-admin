"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, User, Layers, Zap, RotateCw, Ban, Plus, Shuffle } from "lucide-react"

interface MatchDetailsProps {
  match: any
}

export function MatchDetails({ match }: MatchDetailsProps) {
  // Translate result to French
  const translateResult = (result: string) => {
    switch (result) {
      case "win":
        return "Victoire"
      case "loss":
        return "Défaite"
      case "draw":
        return "Nul"
      default:
        return result
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
        return <Layers className="h-5 w-5 text-gray-500" />
    }
  }

  // Get card color name
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de la Manche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Date:</span>
                  </div>
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Adversaire:</span>
                  </div>
                  <span>{match.opponent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Résultat:</span>
                  </div>
                  <Badge
                    variant={match.result === "win" ? "success" : match.result === "loss" ? "destructive" : "outline"}
                  >
                    {translateResult(match.result)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cartes Jouées:</span>
                  </div>
                  <span>{match.cardsPlayed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cartes Spéciales:</span>
                  </div>
                  <span>{match.specialCardsPlayed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques de la Manche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cartes Restantes:</span>
                  <span>{match.cardsRemaining || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tours Joués:</span>
                  <span>{match.turns || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cartes Piochées:</span>
                  <span>{match.cardsDrawn || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Points Gagnés:</span>
                  <span className="font-bold">{match.points}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée de la Partie:</span>
                  <span>{match.duration || "3 min"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cartes Spéciales Jouées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {match.specialCards?.map((card: any, index: number) => (
              <div key={index} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  {getCardIcon(card.type)}
                  <div>
                    <div className="font-medium">{card.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Badge className={`${getColorClass(card.color)} h-4 w-4 rounded-full p-0`} />
                      {getColorName(card.color)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">Jouée {card.count}x</Badge>
              </div>
            )) || (
              <div className="col-span-2 py-6 text-center text-muted-foreground">
                Aucune carte spéciale jouée dans cette manche
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Moments Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {match.keyMoments?.map((moment: any, index: number) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Tour {moment.turn}</span>
                  <Badge variant={moment.impact === "positive" ? "success" : "destructive"}>
                    {moment.impact === "positive" ? "Favorable" : "Défavorable"}
                  </Badge>
                </div>
                <div className="text-sm">{moment.description}</div>
              </div>
            )) || (
              <div className="py-6 text-center text-muted-foreground">
                Aucun moment clé enregistré pour cette manche
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

