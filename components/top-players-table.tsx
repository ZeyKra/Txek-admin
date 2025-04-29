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
          <TableHead className="w-[60px]">Rang</TableHead>
          <TableHead>Joueur</TableHead>
          <TableHead>Équipe</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Évolution</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>
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
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">{player.name}</div>
              </div>
            </TableCell>
            <TableCell>{player.team}</TableCell>
            <TableCell className="text-right font-medium">{player.score}</TableCell>
            <TableCell className="text-right">
              <Badge variant={player.change > 0 ? "success" : player.change < 0 ? "destructive" : "outline"}>
                {player.change > 0 ? "+" : ""}
                {player.change}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

