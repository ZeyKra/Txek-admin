"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Play, Plus, Trash2 } from "lucide-react"

export function ApiTester() {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("")
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: "Content-Type", value: "application/json" },
  ])
  const [body, setBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  const handleSendRequest = async () => {
    if (!url) return

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const headerObj: Record<string, string> = {}
      headers.forEach((h) => {
        if (h.key && h.value) {
          headerObj[h.key] = h.value
        }
      })

      const options: RequestInit = {
        method,
        headers: headerObj,
      }

      if (method !== "GET" && method !== "HEAD" && body) {
        options.body = body
      }

      const res = await fetch(url, options)
      const contentType = res.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        const json = await res.json()
        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          body: json,
        })
      } else {
        const text = await res.text()
        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          body: text,
        })
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <div className="flex items-end gap-4">
          <div className="w-[100px]">
            <Label htmlFor="method">Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://api.example.com/endpoint"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button onClick={handleSendRequest} disabled={isLoading || !url}>
                <Play className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Headers</Label>
            <Button variant="outline" size="sm" onClick={addHeader}>
              <Plus className="mr-2 h-4 w-4" />
              Add Header
            </Button>
          </div>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Header name"
                  value={header.key}
                  onChange={(e) => updateHeader(index, "key", e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => updateHeader(index, "value", e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeHeader(index)} className="h-9 w-9">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <div>
            <Label htmlFor="body">Request Body</Label>
            <Textarea
              id="body"
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="font-mono"
              rows={5}
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">Response</h3>
        {isLoading ? (
          <div className="rounded-md border p-4 text-center text-muted-foreground">Sending request...</div>
        ) : error ? (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">{error}</div>
        ) : !response ? (
          <div className="rounded-md border p-4 text-center text-muted-foreground">
            Send a request to see the response
          </div>
        ) : (
          <Tabs defaultValue="body">
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            <TabsContent value="body" className="rounded-md border">
              <div className="flex items-center justify-between border-b p-2">
                <div className="text-sm font-medium">
                  Status: {response.status} {response.statusText}
                </div>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                {typeof response.body === "object" ? JSON.stringify(response.body, null, 2) : response.body}
              </pre>
            </TabsContent>
            <TabsContent value="headers" className="rounded-md border">
              <pre className="overflow-x-auto p-4 text-sm">{JSON.stringify(response.headers, null, 2)}</pre>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

