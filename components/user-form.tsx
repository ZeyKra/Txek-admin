"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface UserFormProps {
  initialData: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
}

export function UserForm({ initialData, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: initialData.username || "",
    name: initialData.name || "",
    email: initialData.email || "",
    password: "",
    role: initialData.role || "user",
    active: initialData.active !== undefined ? initialData.active : true,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If editing and password is empty, don't include it in the submission
    const dataToSubmit = { ...formData }
    if (initialData.id && !dataToSubmit.password) {
      delete dataToSubmit.password
    }

    onSubmit(dataToSubmit)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">{initialData.id ? "Password (leave empty to keep current)" : "Password"}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required={!initialData.id}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="active" checked={formData.active} onCheckedChange={(checked) => handleChange("active", checked)} />
        <Label htmlFor="active">Active</Label>
      </div>

      <Button type="submit" className="mt-4">
        Save User
      </Button>
    </form>
  )
}

