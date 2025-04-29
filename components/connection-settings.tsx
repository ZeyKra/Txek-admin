"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { testConnection, saveConnectionSettings, getConnectionSettings } from "@/lib/surreal-actions"
import { toast } from "sonner"

export function ConnectionSettings() {
  const [settings, setSettings] = useState({
    url: "",
    namespace: "",
    database: "",
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentSettings = await getConnectionSettings()
        setSettings(currentSettings)
      } catch (error) {
        console.error("Failed to load connection settings:", error)
        toast.error("Échec du chargement des paramètres de connexion", {
          description: "Veuillez vérifier les cookies de votre navigateur",
        })
      }
    }

    loadSettings()
  }, [])

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await saveConnectionSettings(settings)
      toast.success("Paramètres enregistrés", {
        description: "Vos paramètres de connexion ont été enregistrés avec succès.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Erreur", {
        description: "Échec de l'enregistrement des paramètres de connexion.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    try {
      const result = await testConnection(settings)
      if (result.success) {
        toast.success("Connexion réussie", {
          description: "Connexion à SurrealDB établie avec succès.",
        })
      } else {
        toast.error("Échec de la connexion", {
          description: result.message || "Échec de la connexion à SurrealDB. Assurez-vous d'utiliser SurrealDB 1.2.1.",
        })
      }
    } catch (error: any) {
      toast.error("Échec de la connexion", {
        description: error.message || "Échec de la connexion à SurrealDB. Assurez-vous d'utiliser SurrealDB 1.2.1.",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de Connexion</CardTitle>
        <CardDescription>
          Configurez vos paramètres de connexion SurrealDB (Compatible avec SurrealDB 1.2.1)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="url">URL SurrealDB</Label>
          <Input
            id="url"
            placeholder="http://localhost:8000"
            value={settings.url}
            onChange={(e) => handleChange("url", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="namespace">Espace de Noms</Label>
          <Input
            id="namespace"
            placeholder="test"
            value={settings.namespace}
            onChange={(e) => handleChange("namespace", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="database">Base de Données</Label>
          <Input
            id="database"
            placeholder="test"
            value={settings.database}
            onChange={(e) => handleChange("database", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Nom d'Utilisateur</Label>
          <Input
            id="username"
            placeholder="root"
            value={settings.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de Passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={settings.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTest} disabled={isTesting}>
          {isTesting ? "Test en cours..." : "Tester la Connexion"}
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les Paramètres"}
        </Button>
      </CardFooter>
    </Card>
  )
}

