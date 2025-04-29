"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { fetchPlayers, createPlayer, updatePlayer, deletePlayer } from "@/lib/player-actions"
import { BarChart2, Edit, Plus, Search, Trash2, UserRound } from "lucide-react"
import { PlayerForm } from "./player-form"
import { toast } from "sonner"

export function PlayersManagement() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const pageSize = 10

  const loadPlayers = async () => {
    setLoading(true)
    try {
      const data = await fetchPlayers(page, pageSize)
      setPlayers(data.players)
      setTotalPages(Math.ceil(data.total / pageSize) || 1)
    } catch (error) {
      console.error("Failed to fetch players:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlayers()
  }, [page])

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce joueur ?")) {
      try {
        await deletePlayer(id)
        toast.success("Joueur supprimé avec succès")
        loadPlayers()
      } catch (error) {
        console.error("Failed to delete player:", error)
        toast.error("Échec de la suppression du joueur")
      }
    }
  }

  const handleEdit = (player: any) => {
    setSelectedPlayer(player)
    setIsEditDialogOpen(true)
  }

  const handleCreate = async (data: any) => {
    try {
      await createPlayer(data)
      toast.success("Joueur créé avec succès")
      setIsCreateDialogOpen(false)
      loadPlayers()
    } catch (error) {
      console.error("Failed to create player:", error)
      toast.error("Échec de la création du joueur")
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      await updatePlayer(selectedPlayer.id, data)
      toast.success("Joueur mis à jour avec succès")
      setIsEditDialogOpen(false)
      loadPlayers()
    } catch (error) {
      console.error("Failed to update player:", error)
      toast.error("Échec de la mise à jour du joueur")
    }
  }

  const filteredPlayers = players.filter((player) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      player.Nom?.toLowerCase().includes(searchLower) ||
      player.Prenom?.toLowerCase().includes(searchLower) ||
      player.team?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des joueurs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full md:w-[300px]"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Joueur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Joueur</DialogTitle>
            </DialogHeader>
            <PlayerForm initialData={{}} onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-6 text-center text-muted-foreground">Chargement des joueurs...</div>
      ) : players.length === 0 ? (
        <div className="py-6 text-center text-muted-foreground">Aucun joueur trouvé</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Joueur</TableHead>
                  <TableHead>Équipe</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                        {player.Nom}
                      </div>
                    </TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.level}</TableCell>
                    <TableCell>{player.score}</TableCell>
                    <TableCell>
                      <Badge variant={player.active ? "success" : "outline"}>
                        {player.active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                          <Link href={`/dashboard/players/${player.id}`}>
                            <BarChart2 className="h-4 w-4" />
                            <span className="sr-only">Statistiques</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(player)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(player.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink onClick={() => setPage(p)} isActive={page === p}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le Joueur</DialogTitle>
          </DialogHeader>
          {selectedPlayer && <PlayerForm initialData={selectedPlayer} onSubmit={handleUpdate} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

