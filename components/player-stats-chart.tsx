"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PlayerStatsChartProps {
  wins: number
  losses: number
  totalGames: number
}

export function PlayerStatsChart({ wins, losses, totalGames }: PlayerStatsChartProps) {
  const chartData = [
    {
      name: "Victoires",
      value: wins,
      fill: "hsl(var(--chart-1))"
    },
    {
      name: "Défaites", 
      value: losses,
      fill: "hsl(var(--chart-2))"
    },
    {
      name: "Total Parties",
      value: totalGames,
      fill: "hsl(var(--chart-3))"
    }
  ]

  const chartConfig = {
    value: {
      label: "Nombre",
    },
    wins: {
      label: "Victoires",
      color: "hsl(var(--chart-1))",
    },
    losses: {
      label: "Défaites", 
      color: "hsl(var(--chart-2))",
    },
    totalGames: {
      label: "Total Parties",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          className="text-sm"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm"
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 0, 0]}
          fill="var(--color-value)"
        />
      </BarChart>
    </ChartContainer>
  )
}

