"use client"

const HISTORY_KEY = "surreal_query_history"
const MAX_HISTORY_ITEMS = 10

interface QueryHistoryItem {
  query: string
  timestamp: number
}

export function addQueryToHistory(query: string) {
  if (typeof window === "undefined") return

  const history = getRecentQueries()

  // Add the new query to the beginning of the array
  const newHistory = [{ query, timestamp: Date.now() }, ...history.filter((item) => item.query !== query)].slice(
    0,
    MAX_HISTORY_ITEMS,
  )

  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
}

export function getRecentQueries(): QueryHistoryItem[] {
  if (typeof window === "undefined") return []

  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error("Failed to parse query history:", error)
    return []
  }
}

export function clearQueryHistory() {
  if (typeof window === "undefined") return
  localStorage.removeItem(HISTORY_KEY)
}

