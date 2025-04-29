"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users } from "lucide-react"

interface TeamPerformanceProps {
  teams: {
    name: string
    wins: number
    losses: number
    draws: number
    winRate: number
    totalScore: number
    playerCount: number
  }[]
}

export function TeamPerformance({ teams }: TeamPerformanceProps) {
  // Sort teams by win rate
  const sortedTeams = [...teams].sort((a, b) => b.winRate - a.winRate)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team</TableHead>
          <TableHead>Players</TableHead>
          <TableHead>W/L/D</TableHead>
          <TableHead>Win Rate</TableHead>
          <TableHead className="text-right">Total Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTeams.map((team) => (
          <TableRow key={team.name}>
            <TableCell className="font-medium">{team.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{team.playerCount}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Badge variant="success" className="text-xs">
                  {team.wins}
                </Badge>
                <Badge variant="destructive" className="text-xs">
                  {team.losses}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {team.draws}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={team.winRate} className="h-2" />
                <span className="text-xs font-medium">{team.winRate}%</span>
              </div>
            </TableCell>
            <TableCell className="text-right">{team.totalScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

