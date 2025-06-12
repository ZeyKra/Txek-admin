"use server"
import { SurrealResponse } from "@/types/surreal-response"
import { getSurrealClient } from "./surreal-actions"
import { log } from "console"
import { fetchPlayerById } from "./player-actions"
import { parse } from "path"

// Fetch statistics for dashboard
export async function fetchStatistics() {
  try {
    const db = await getSurrealClient()
    

    // Get total players count
    const totalPlayersResult: SurrealResponse<any> = await db.query(`SELECT COUNT() FROM RecordedUser GROUP ALL`)
    
    const totalPlayers = totalPlayersResult[0][0]['count'] || 0

    // Get active players count
    //const activePlayersResult: SurrealResponse<any> = await db.query(`SELECT COUNT() FROM RecordedUser GROUP ALL`)
    const activePlayers = await getActivePlayerCount()

    // Calculate active players percentage
    const activePlayersPercentage = totalPlayers > 0 ? Math.round((activePlayers / totalPlayers) * 100) : 0

    // Get new players in the last month
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const newPlayersResult: SurrealResponse<any> = await db.query(
      `SELECT COUNT() from RecordedUser WHERE time::week(created_at) = time::week(time::now()) GROUP ALL`,
    )
    const newPlayers = newPlayersResult[0][0]['count'] || 0

    // Get total matches count (assuming we have a match table)
    let totalMatches = 0
    let matchesThisMonth = 0

    try {
      const totalMatchesResult: SurrealResponse<any> = await db.query(`SELECT COUNT() FROM Match GROUP ALL`)
      totalMatches = totalMatchesResult[0][0]['count'] || 0

      const matchesThisMonthResult: SurrealResponse<any> = await db.query(
        `SELECT COUNT() from Match WHERE time::week(created_at) = time::week(time::now()) GROUP ALL`,
      )
      matchesThisMonth = matchesThisMonthResult[0][0]['count'] || 0
    } catch (e) {
      // Match table might not exist, use player stats as fallback
      const playerStatsResult: SurrealResponse<any> = await db.query(`
        SELECT math::sum(stats.games) AS total_games 
        FROM player 
        WHERE stats.games != NONE
      `)
      totalMatches = playerStatsResult[0]?.result?.[0]?.total_games || 0

      // For matches this month, we'll use a percentage of total as an estimate
      matchesThisMonth = Math.round(totalMatches * 0.15) // Assuming 15% of matches happened this month
    }

    // Get top players
    const topPlayersResult: SurrealResponse<any> = await db.query(`SELECT 
    username as name, id AS user_id,
    (SELECT VALUE count() FROM $parent->recordeduser_recorded_match->Match GROUP count)[0].count OR 0 AS score
FROM RecordedUser ORDER BY score DESC;`)
    console.log("Top Players Result:", topPlayersResult);
    const topPlayers = (topPlayersResult[0] || []).map((player: any, index: number) => {
      // Assign a random rank and change for each player
      const playerData = {
        ...player,
        rank: player.rank || index + 1,
        change: Math.round(Math.random() * 6 - 2),
      }
      console.log("Player Data:", playerData);
      
      return {
        ...player,
        rank: player.rank || index + 1,
        change: Math.round(Math.random() * 6 - 2), // Random value between -2 and 4
      }
    })

    // Get chart data - we'll create this from player stats over time
    // In a real app, you'd have timestamps for when stats changed
    // Here we'll simulate data for the last 6 months

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const currentMonth = new Date().getMonth()

    const labels = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i) % 12
      return months[monthIndex >= 0 ? monthIndex : monthIndex + 12]
    })

    // Generate realistic looking chart data based on current stats
    const activePlayers_data = [
      Math.round(activePlayers * 0.65),
      Math.round(activePlayers * 0.72),
      Math.round(activePlayers * 0.78),
      Math.round(activePlayers * 0.85),
      Math.round(activePlayers * 0.92),
      activePlayers,
    ]

    const matches_data = [
      Math.round(totalMatches * 0.5),
      Math.round(totalMatches * 0.6),
      Math.round(totalMatches * 0.7),
      Math.round(totalMatches * 0.8),
      Math.round(totalMatches * 0.9),
      totalMatches,
    ]

    const chartData = {
      labels,
      datasets: [
        {
          label: "Active Players",
          data: activePlayers_data,
          color: "#3b82f6", // blue-500
        },
        {
          label: "Matches",
          data: matches_data,
          color: "#f59e0b", // amber-500
        },
      ],
    }
    
    // Mock statistics data
    const statistics = {
      totalPlayers: 256,
      newPlayers: 24,
      activePlayers: 187,
      activePlayersPercentage: 73,
      totalMatches: 1243,
      matchesThisMonth: 156,

      // Chart data
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Active Players",
            data: [120, 132, 145, 162, 178, 187],
            color: "#3b82f6", // blue-500
          },
          {
            label: "Matches",
            data: [85, 103, 124, 142, 156, 168],
            color: "#f59e0b", // amber-500
          },
        ],
      },

      // Top players
      topPlayers: [
        {
          id: "player:1",
          name: "Alex Johnson",
          team: "Team Alpha",
          score: 98,
          rank: 1,
          change: 2,
        },
        {
          id: "player:2",
          name: "Maria Garcia",
          team: "Team Beta",
          score: 95,
          rank: 2,
          change: 0,
        },
        {
          id: "player:3",
          name: "James Wilson",
          team: "Team Alpha",
          score: 92,
          rank: 3,
          change: 1,
        },
        {
          id: "player:4",
          name: "Sarah Chen",
          team: "Team Gamma",
          score: 88,
          rank: 4,
          change: -1,
        },
        {
          id: "player:5",
          name: "David Kim",
          team: "Team Delta",
          score: 85,
          rank: 5,
          change: 3,
        },
      ],
    }

    await db.close()
    //return statistics

    
    return {
      totalPlayers,
      newPlayers,
      activePlayers,
      activePlayersPercentage,
      totalMatches,
      matchesThisMonth,
      chartData,
      topPlayers,
    }
      
  } catch (error) {
    console.error("Failed to fetch statistics:", error)
    throw new Error(`Failed to fetch statistics: ${error}`)
  }
}

// Get player performance over time
export async function getPlayerPerformanceHistory(playerId: string) {
  try {
    const db = await getSurrealClient()

    // Get the player data
    const player = await fetchPlayerById(playerId);
    

    if (!player) {
      throw new Error("Player not found")
    }

    // In a real app, you'd have a match history table with timestamps
    // Here we'll generate some realistic looking data based on the player's current stats

    const totalGameQuery: SurrealResponse<any> = await db.query(`SELECT count() AS match_count FROM ${playerId}->recordeduser_recorded_match->Match GROUP BY match_count;`)

    const totalGames: number = totalGameQuery[0]['count'] || 0;
    const wins = player.stats?.wins || 0
    const losses = player.stats?.losses || 0
    const draws = player.stats?.draws || 0
    const points = player.stats?.points || 0

    // Generate 6 data points representing the last 6 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const currentMonth = new Date().getMonth()

    const labels = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i) % 12
      return months[monthIndex >= 0 ? monthIndex : monthIndex + 12]
    })

    // Create a realistic progression of stats
    const gamesProgression = [
      Math.round(totalGames * 0.4),
      Math.round(totalGames * 0.5),
      Math.round(totalGames * 0.65),
      Math.round(totalGames * 0.75),
      Math.round(totalGames * 0.9),
      totalGames,
    ]

    const winsProgression = gamesProgression.map((games) => {
      const winRatio = wins / totalGames
      return Math.round(games * winRatio)
    })

    const lossesProgression = gamesProgression.map((games) => {
      const lossRatio = losses / totalGames
      return Math.round(games * lossRatio)
    })

    const drawsProgression = gamesProgression.map((games, i) => {
      return games - winsProgression[i] - lossesProgression[i]
    })

    const pointsProgression = gamesProgression.map((games) => {
      const pointsPerGame = points / totalGames
      return Math.round(games * pointsPerGame)
    })

    // Calculate win rate progression
    const winRateProgression = gamesProgression.map((games, i) => {
      return games > 0 ? Math.round((winsProgression[i] / games) * 100) : 0
    })

    await db.close()

    return {
      labels,
      datasets: [
        {
          label: "Games",
          data: gamesProgression,
          color: "#3b82f6", // blue-500
        },
        {
          label: "Wins",
          data: winsProgression,
          color: "#10b981", // emerald-500
        },
        {
          label: "Losses",
          data: lossesProgression,
          color: "#ef4444", // red-500
        },
        {
          label: "Draws",
          data: drawsProgression,
          color: "#f59e0b", // amber-500
        },
        {
          label: "Points",
          data: pointsProgression,
          color: "#8b5cf6", // violet-500
        },
        {
          label: "Win Rate %",
          data: winRateProgression,
          color: "#ec4899", // pink-500
        },
      ],
    }
  } catch (error) {
    console.error(`Failed to fetch player performance history: ${error}`)
    throw new Error(`Failed to fetch player performance history: ${error}`)
  }
}

export async function getActivePlayerCount() {
  try {
    const db = await getSurrealClient()
    
    // Get active player count
    const result: SurrealResponse<any> = await db.query(`SELECT 
    username as name, id AS user_id,
    (SELECT VALUE count() FROM $parent->recordeduser_recorded_match->Match WHERE Time::week(created_at) = Time::week(Time::now()) GROUP count )[0].count OR 0 AS match_count
FROM RecordedUser;`)
    const activePlayers = result[0] || []
    const activePlayersNumber = activePlayers.filter((player: any) => player.match_count > 0).length
    console.log("Active Players Result:", activePlayers);

    await db.close()
    return activePlayersNumber
  } catch (error) {
    console.error("Failed to fetch active player count:", error)
    throw new Error(`Failed to fetch active player count: ${error}`)
  }
}

export interface PlayerStats {
  games: number
  wins: number
  losses: number
  active: boolean
}

export async function getPlayerStats(playerId: string) : Promise<PlayerStats> {
  try {
    const db = await getSurrealClient()
    
    // Get player stats
    const playerData = await fetchPlayerById(playerId);
    const winsData: SurrealResponse<any> = await db.query(`SELECT COUNT() as count, winner FROM ${playerId}->recordeduser_recorded_match->Match WHERE winner = "Penny" GROUP count;`);
    const totalMatchData : SurrealResponse<any> = await db.query(`SELECT count() AS match_count FROM ${playerId}->recordeduser_recorded_match->Match GROUP BY match_count;`);
    
    /*
    console.log("Player Data:", playerData);
    console.log("Wins Data:", winsData);
    console.log("Total Match Data:", totalMatchData); */

    const wins : number = winsData[0][0]['count'] || 0;
    const totalMatches : number = totalMatchData[0][0]['match_count'] || 0;
    const losses = totalMatches - wins; // Assuming losses are total matches minus wins
    const active = await isPlayerActive(playerId); // Check if the player is active

    const playerStats: PlayerStats = {
      games: totalMatches,
      wins: wins,
      losses: losses,
      active: active,
    }
    
    await db.close()
    return playerStats
  } catch (error) {
    console.error(`Failed to fetch player stats for ${playerId}:`, error)
    throw new Error(`Failed to fetch player stats: ${error}`)
  }
}

export async function isPlayerActive(playerId: string) {
  try {
    const db = await getSurrealClient()
    let isActive = false;

    // Get player activity status
    const matchCreatedThisWeekNumber = await db.query(`(SELECT VALUE count() FROM ${playerId}->recordeduser_recorded_match->Match WHERE Time::week(created_at) = Time::week(Time::now()) GROUP count)[0].count OR 0`);
    const parsedMatchCount = parseInt(matchCreatedThisWeekNumber) || 0;

    if (parsedMatchCount > 0) {
      isActive = true;
    }

    await db.close()
    return isActive
  } catch (error) {
    console.error(`Failed to fetch player activity status for ${playerId}:`, error)
    throw new Error(`Failed to fetch player activity status: ${error}`)
  }
}
