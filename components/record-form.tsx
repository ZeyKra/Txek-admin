"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface RecordFormProps {
  columns: string[]
  initialData: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
}

export function RecordForm({ columns, initialData, onSubmit }: RecordFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)

  const handleChange = (column: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [column]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getInputType = (value: any): string => {
    if (value === null || value === undefined) return "text"

    switch (typeof value) {
      case "number":
        return "number"
      case "boolean":
        return "checkbox"
      default:
        return "text"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {columns.map((column) => {
        const value = formData[column]
        const inputType = getInputType(value)

        if (typeof value === "object") {
          return (
            <div key={column} className="grid gap-2">
              <Label htmlFor={column}>{column}</Label>
              <Textarea
                id={column}
                value={value ? JSON.stringify(value, null, 2) : ""}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    handleChange(column, parsed)
                  } catch {
                    handleChange(column, e.target.value)
                  }
                }}
                rows={4}
              />
            </div>
          )
        }

        return (
          <div key={column} className="grid gap-2">
            <Label htmlFor={column}>{column}</Label>
            {inputType === "checkbox" ? (
              <div className="flex items-center space-x-2">
                <Input
                  id={column}
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => handleChange(column, e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor={column}>{value ? "True" : "False"}</Label>
              </div>
            ) : (
              <Input
                id={column}
                type={inputType}
                value={value ?? ""}
                onChange={(e) => {
                  const newValue = inputType === "number" ? Number.parseFloat(e.target.value) : e.target.value
                  handleChange(column, newValue)
                }}
              />
            )}
          </div>
        )
      })}
      <Button type="submit" className="mt-4">
        Sauvegarder
      </Button>
    </form>
  )
}

