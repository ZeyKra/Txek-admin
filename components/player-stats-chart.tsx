"use client"

import { useEffect, useRef } from "react"

interface PlayerStatsChartProps {
  stats: {
    games: number
    wins: number
    losses: number
    draws: number
    points: number
    [key: string]: any
  }
}

export function PlayerStatsChart({ stats }: PlayerStatsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set canvas dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    /*
    const data = [
      { label: "Matchs", value: stats.games || 0 },
      { label: "Victoires", value: stats.wins || 0 },
      { label: "Défaites", value: stats.losses || 0 },
      { label: "Nuls", value: stats.draws || 0 },
      { label: "Points", value: stats.points || 0 },
    ] */
      const data = [
        { label: "Matchs", value: 1  },
        { label: "Victoires", value: 10  },
        { label: "Défaites", value: 2 },
        { label: "Nuls", value: 15  },
        { label: "Points", value: 1 },
      ]

    // Find max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value), 10)

    // Colors
    const barColors = [
      "#3b82f6", // blue-500
      "#10b981", // emerald-500
      "#ef4444", // red-500
      "#f59e0b", // amber-500
      "#8b5cf6", // violet-500
    ]

    // Draw bars
    const barWidth = chartWidth / data.length / 2
    const barSpacing = chartWidth / data.length

    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight
      const x = padding + index * barSpacing + barSpacing / 4
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = barColors[index % barColors.length]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)

      // Draw label below bar
      ctx.fillText(item.label, x + barWidth / 2, height - padding + 15)
    })

    // Draw axes
    ctx.strokeStyle = "#e5e7eb" // gray-200
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw Y-axis labels
    const yAxisSteps = 5
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = Math.round((maxValue / yAxisSteps) * i)
      const y = height - padding - (i / yAxisSteps) * chartHeight

      ctx.fillStyle = "#6b7280" // gray-500
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(value.toString(), padding - 5, y + 3)

      // Draw grid line
      ctx.strokeStyle = "#e5e7eb" // gray-200
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }
  }, [stats])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  )
}

