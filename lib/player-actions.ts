"use server"
import { SurrealResponse } from "@/types/surreal-response"
import { countTable, getSurrealClient } from "./surreal-actions"

// Fetch players with pagination
export async function fetchPlayers(page = 1, limit = 10) {
  try {
    const db = await getSurrealClient()
    const offset = (page - 1) * limit

    const total = await countTable("RecordedUser") || 0
    //const total = countResult[0].result?.[0]?.count || 0

    const playersResult: SurrealResponse<any> = await db.query(`SELECT * FROM RecordedUser ORDER BY Nom DESC LIMIT ${limit} START ${offset}`)
    await db.close()
    
    return {
      players: JSON.parse(JSON.stringify(playersResult[0] || [])),
      total,
    }
  } catch (error) {
    console.error("Failed to fetch players:", error)
    return {
      players: [],
      total: 0,
    }
  }
}

// Fetch a player by ID
export async function fetchPlayerById(id: string) {
  try {
    const db = await getSurrealClient()
    const fetchedPlayerData: SurrealResponse<any> = await db.query(`SELECT * FROM ${id}`)

    const result = fetchedPlayerData[0][0]
    result.id = `${fetchedPlayerData[0][0].id.tb}:${fetchedPlayerData[0][0].id.id}`

    await db.close()
    return result
  } catch (error) {
    console.error(`Failed to fetch player ${id}:`, error)
    throw new Error(`Failed to fetch player: ${error}`)
  }
}

// Create a new player
export async function createPlayer(playerData: any) {
  try {
    const db = await getSurrealClient()

    // Add created_at timestamp
    playerData.created_at = new Date().toISOString()

    const result = await db.create("player", playerData)
    await db.close()
    return result
  } catch (error) {
    console.error("Failed to create player:", error)
    throw new Error(`Failed to create player: ${error}`)
  }
}

// Update a player
export async function updatePlayer(id: string, playerData: any) {
  try {
    const db = await getSurrealClient()

    // Add updated_at timestamp
    playerData.updated_at = new Date().toISOString()

    const result = await db.change(id, playerData)
    await db.close()
    return result
  } catch (error) {
    console.error(`Failed to update player ${id}:`, error)
    throw new Error(`Failed to update player: ${error}`)
  }
}

// Delete a player
export async function deletePlayer(id: string) {
  try {
    const db = await getSurrealClient()
    await db.query(`DELETE ${id}`)
    await db.close()
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete player ${id}:`, error)
    throw new Error(`Failed to delete player: ${error}`)
  }
}

// Update player statistics
export async function updatePlayerStats(id: string, stats: any) {
  try {
    const db = await getSurrealClient()

    // Get current player data
    const player = await db.select(id)

    // Update stats
    const updatedPlayer = {
      ...player,
      stats: {
        ...player.stats,
        ...stats,
      },
      updated_at: new Date().toISOString(),
    }

    const result = await db.update(id, updatedPlayer)
    await db.close()
    return result
  } catch (error) {
    console.error(`Failed to update player stats ${id}:`, error)
    throw new Error(`Failed to update player stats: ${error}`)
  }
}

// Add achievement to player
export async function addPlayerAchievement(id: string, achievement: any) {
  try {
    const db = await getSurrealClient()

    // Get current player data
    const player = await db.select(id)

    // Add achievement to array
    const achievements = player.stats?.achievements || []
    achievements.push({
      ...achievement,
      id: `achievement:${Date.now()}`,
    })

    // Update player
    const updatedPlayer = {
      ...player,
      stats: {
        ...player.stats,
        achievements,
      },
      updated_at: new Date().toISOString(),
    }

    const result = await db.update(id, updatedPlayer)
    await db.close()
    return result
  } catch (error) {
    console.error(`Failed to add achievement to player ${id}:`, error)
    throw new Error(`Failed to add achievement: ${error}`)
  }
}

// Fetch player matches
export async function fetchPlayerMatches(playerId: string) {
  try {
    const db = await getSurrealClient()

    // In a real app, you would query a matches table
    // This is mock data for demonstration
    const matches = [
      {
        id: "match:1",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        opponent: "Jean Dupont",
        result: "win",
        points: 10,
        cardsPlayed: 12,
        specialCardsPlayed: 3,
        cardsRemaining: 0,
        turns: 15,
        cardsDrawn: 4,
        duration: "3 min",
        specialCards: [
          { name: "Passer Tour", type: "skip", color: "red", count: 1 },
          { name: "Inverser Sens", type: "reverse", color: "blue", count: 1 },
          { name: "+4", type: "wild4", color: "black", count: 1 },
        ],
        keyMoments: [
          { turn: 3, impact: "positive", description: "A joué un +4 qui a fait piocher 4 cartes à l'adversaire" },
          { turn: 10, impact: "positive", description: "A joué un Inverser Sens au moment opportun" },
          { turn: 14, impact: "positive", description: "A terminé avec une carte Passer Tour" },
        ],
      },
      {
        id: "match:2",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        opponent: "Marie Martin",
        result: "draw",
        points: 5,
        cardsPlayed: 15,
        specialCardsPlayed: 2,
        cardsRemaining: 1,
        turns: 20,
        cardsDrawn: 6,
        duration: "4 min",
        specialCards: [
          { name: "+2", type: "draw2", color: "green", count: 1 },
          { name: "Joker", type: "wild", color: "black", count: 1 },
        ],
        keyMoments: [
          { turn: 5, impact: "positive", description: "A joué un +2 qui a fait piocher 2 cartes à l'adversaire" },
          { turn: 12, impact: "negative", description: "A dû piocher 4 cartes suite à un +4 de l'adversaire" },
        ],
      },
      {
        id: "match:3",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        opponent: "Pierre Durand",
        result: "loss",
        points: 0,
        cardsPlayed: 8,
        specialCardsPlayed: 1,
        cardsRemaining: 5,
        turns: 12,
        cardsDrawn: 3,
        duration: "2 min",
        specialCards: [{ name: "Inverser Sens", type: "reverse", color: "yellow", count: 1 }],
        keyMoments: [
          { turn: 7, impact: "negative", description: "A dû piocher 2 cartes suite à un +2 de l'adversaire" },
          { turn: 10, impact: "negative", description: "L'adversaire a joué un Passer Tour au moment critique" },
        ],
      },
      {
        id: "match:4",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        opponent: "Sophie Bernard",
        result: "win",
        points: 15,
        cardsPlayed: 18,
        specialCardsPlayed: 5,
        cardsRemaining: 0,
        turns: 22,
        cardsDrawn: 7,
        duration: "5 min",
        specialCards: [
          { name: "Passer Tour", type: "skip", color: "blue", count: 2 },
          { name: "+2", type: "draw2", color: "red", count: 1 },
          { name: "+4", type: "wild4", color: "black", count: 2 },
        ],
        keyMoments: [
          { turn: 8, impact: "positive", description: "A joué un +4 qui a fait piocher 4 cartes à l'adversaire" },
          {
            turn: 15,
            impact: "positive",
            description: "A joué un Passer Tour qui a empêché l'adversaire de jouer une carte importante",
          },
          {
            turn: 20,
            impact: "positive",
            description: "A joué un second +4 qui a fait piocher 4 cartes à l'adversaire",
          },
        ],
      },
    ]

    await db.close()
    return matches
  } catch (error) {
    console.error(`Failed to fetch matches for player ${playerId}:`, error)
    return []
  }
}

