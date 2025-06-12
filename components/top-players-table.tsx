"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

interface TopPlayersTableProps {
  players: {
    id: string
    name: string
    team: string
    score: number
    rank: number
    change: number
  }[]
}

export function TopPlayersTable({ players }: TopPlayersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rang</TableHead>
          <TableHead>Joueur</TableHead>
          <TableHead className="text-right">Match créé</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="w-[100px]">
              {player.rank <= 3 ? (
                <div className="flex items-center justify-center">
                  <Trophy
                    className={`h-5 w-5 ${
                      player.rank === 1 ? "text-yellow-500" : player.rank === 2 ? "text-gray-400" : "text-amber-700"
                    }`}
                  />
                </div>
              ) : (
                <div className="text-center">{player.rank}</div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">{player.name}</div>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium">{player.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

