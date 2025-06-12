"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StatisticsChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      color: string
    }[]
  }
}

export function StatisticsChart({ data }: StatisticsChartProps) {
  // Transform data for Recharts format
  const chartData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label }
    
    data.datasets.forEach((dataset) => {
      // Translate dataset labels to French
      const translateLabel = (label: string) => {
        switch (label) {
          case "Active Players":
            return "Joueurs Actifs"
          case "Matches":
            return "Matchs"
          default:
            return label
        }
      }
      
      dataPoint[translateLabel(dataset.label)] = dataset.data[index] || 0
    })
    
    return dataPoint
  })

  // Translate dataset labels for the chart
  const translatedDatasets = data.datasets.map(dataset => ({
    ...dataset,
    translatedLabel: (() => {
      switch (dataset.label) {
        case "Active Players":
          return "Joueurs Actifs"
        case "Matches":
          return "Matchs"
        default:
          return dataset.label
      }
    })()
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>
          Aperçu des performances et de l'activité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-sm fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-sm fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
              />
              {translatedDatasets.map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.translatedLabel}
                  stroke={dataset.color}
                  strokeWidth={2}
                  dot={{ fill: dataset.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: dataset.color, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

