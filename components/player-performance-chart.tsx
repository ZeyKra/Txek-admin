"use client"

import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PlayerPerformanceChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      color: string
    }[]
  }
}

export function PlayerPerformanceChart({ data }: PlayerPerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Games", "Wins", "Losses"])

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set canvas dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 60
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Filter datasets based on selected metrics
    const filteredDatasets = data.datasets.filter((ds) => selectedMetrics.includes(ds.label))

    // Find max value for scaling
    const allValues = filteredDatasets.flatMap((dataset) => dataset.data)
    const maxValue = Math.max(...allValues, 10)

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

    // Draw X-axis labels
    const xStep = chartWidth / (data.labels.length - 1)
    data.labels.forEach((label, i) => {
      const x = padding + i * xStep

      ctx.fillStyle = "#6b7280" // gray-500
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, height - padding + 15)
    })

    // Draw datasets
    filteredDatasets.forEach((dataset) => {
      ctx.strokeStyle = dataset.color
      ctx.lineWidth = 2
      ctx.beginPath()

      dataset.data.forEach((value, i) => {
        const x = padding + i * xStep
        const y = height - padding - (value / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      dataset.data.forEach((value, i) => {
        const x = padding + i * xStep
        const y = height - padding - (value / maxValue) * chartHeight

        ctx.fillStyle = dataset.color
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })
    })

    // Draw legend
    const legendY = padding / 2
    let legendX = padding

    // Translate dataset labels to French
    const translateLabel = (label: string) => {
      switch (label) {
        case "Games":
          return "Matchs"
        case "Wins":
          return "Victoires"
        case "Losses":
          return "Défaites"
        case "Draws":
          return "Nuls"
        case "Points":
          return "Points"
        case "Win Rate %":
          return "Taux de Victoire %"
        default:
          return label
      }
    }

    filteredDatasets.forEach((dataset) => {
      // Draw line
      ctx.strokeStyle = dataset.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(legendX, legendY)
      ctx.lineTo(legendX + 20, legendY)
      ctx.stroke()

      // Draw point
      ctx.fillStyle = dataset.color
      ctx.beginPath()
      ctx.arc(legendX + 10, legendY, 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw label in French
      const translatedLabel = translateLabel(dataset.label)
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(translatedLabel, legendX + 25, legendY + 4)

      legendX += ctx.measureText(translatedLabel).width + 50
    })
  }, [data, selectedMetrics])

  const handleMetricChange = (value: string) => {
    const metrics = value.split(",")
    setSelectedMetrics(metrics)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <Select value={selectedMetrics.join(",")} onValueChange={handleMetricChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Sélectionner les métriques à afficher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Games,Wins,Losses">Matchs, Victoires & Défaites</SelectItem>
            <SelectItem value="Wins,Losses,Draws">Victoires, Défaites & Nuls</SelectItem>
            <SelectItem value="Games,Points">Matchs & Points</SelectItem>
            <SelectItem value="Win Rate %">Taux de Victoire %</SelectItem>
            <SelectItem value="Games,Wins,Losses,Draws,Points">Toutes les Statistiques</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
      </div>
    </div>
  )
}

