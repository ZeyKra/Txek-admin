"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchPlayerMatches } from "@/lib/player-actions"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MatchDetails } from "./match-details"

interface PlayerMatchHistoryProps {
  playerId: string
}

export function PlayerMatchHistory({ playerId }: PlayerMatchHistoryProps) {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<string | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true)
      try {
        const data = await fetchPlayerMatches(playerId)
        setMatches(data)
      } catch (error) {
        console.error("Failed to fetch player matches:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [playerId])

  // Filter matches based on result
  const filteredMatches = filter ? matches.filter((match) => match.result === filter) : matches

  // Paginate matches
  const paginatedMatches = filteredMatches.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage)

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

  const handleViewDetails = (match: any) => {
    setSelectedMatch(match)
    setIsDetailsOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historique des Manches</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem checked={filter === null} onCheckedChange={() => setFilter(null)}>
              Toutes les Manches
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter === "win"}
              onCheckedChange={(checked) => setFilter(checked ? "win" : null)}
            >
              Victoires Seulement
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter === "loss"}
              onCheckedChange={(checked) => setFilter(checked ? "loss" : null)}
            >
              Défaites Seulement
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter === "draw"}
              onCheckedChange={(checked) => setFilter(checked ? "draw" : null)}
            >
              Nuls Seulement
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-muted-foreground">Chargement de l'historique des manches...</div>
        ) : matches.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">Aucun historique de manche disponible</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Adversaire</TableHead>
                  <TableHead>Cartes Jouées</TableHead>
                  <TableHead>Cartes Spéciales</TableHead>
                  <TableHead>Résultat</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMatches.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                    <TableCell>{match.opponent}</TableCell>
                    <TableCell>{match.cardsPlayed}</TableCell>
                    <TableCell>{match.specialCardsPlayed}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          match.result === "win" ? "success" : match.result === "loss" ? "destructive" : "outline"
                        }
                      >
                        {translateResult(match.result)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(match)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Détails</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails de la Manche</DialogTitle>
          </DialogHeader>
          {selectedMatch && <MatchDetails match={selectedMatch} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

