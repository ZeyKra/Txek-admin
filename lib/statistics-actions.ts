"use server"
import { getSurrealClient } from "./surreal-actions"

// Fetch statistics for dashboard
export async function fetchStatistics() {
  try {
    const db = await getSurrealClient()
    /*

    // Get total players count
    const totalPlayersResult = await db.query(`SELECT count() FROM Joueur GROUP ALL`)
    const totalPlayers = totalPlayersResult[0][0]['count']

    // Get active players count
    const activePlayersResult = await db.query(`SELECT count() FROM Joueur WHERE active = true`)
    const activePlayers = activePlayersResult[0]?.result?.[0]?.count || 0

    // Calculate active players percentage
    const activePlayersPercentage = totalPlayers > 0 ? Math.round((activePlayers / totalPlayers) * 100) : 0

    // Get new players in the last month
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const newPlayersResult = await db.query(
      `SELECT count() FROM player WHERE created_at > "${oneMonthAgo.toISOString()}"`,
    )
    const newPlayers = newPlayersResult[0]?.result?.[0]?.count || 0

    // Get total matches count (assuming we have a match table)
    let totalMatches = 0
    let matchesThisMonth = 0

    try {
      const totalMatchesResult = await db.query(`SELECT count() FROM match`)
      totalMatches = totalMatchesResult[0]?.result?.[0]?.count || 0

      const matchesThisMonthResult = await db.query(
        `SELECT count() FROM match WHERE created_at > "${oneMonthAgo.toISOString()}"`,
      )
      matchesThisMonth = matchesThisMonthResult[0]?.result?.[0]?.count || 0
    } catch (e) {
      // Match table might not exist, use player stats as fallback
      const playerStatsResult = await db.query(`
        SELECT math::sum(stats.games) AS total_games 
        FROM player 
        WHERE stats.games != NONE
      `)
      totalMatches = playerStatsResult[0]?.result?.[0]?.total_games || 0

      // For matches this month, we'll use a percentage of total as an estimate
      matchesThisMonth = Math.round(totalMatches * 0.15) // Assuming 15% of matches happened this month
    }

    // Get average score
    const avgScoreResult = await db.query(`
      SELECT math::mean(score) AS avg_score 
      FROM player 
      WHERE score != NONE
    `)
    const averageScore = Math.round(avgScoreResult[0]?.result?.[0]?.avg_score || 0)

    // For score change, we'll calculate based on player data
    // This would ideally use historical data, but we'll estimate
    const scoreChange = Math.round(Math.random() * 10 - 3) // Random value between -3 and 7

    // Get top players
    const topPlayersResult = await db.query(`
      SELECT id, name, team, score, 
             (SELECT count() FROM player WHERE score > tb.score) + 1 AS rank
      FROM player AS tb
      WHERE score != NONE
      ORDER BY score DESC
      LIMIT 5
    `)
    const topPlayers = (topPlayersResult[0]?.result || []).map((player: any, index: number) => {
      return {
        ...player,
        rank: player.rank || index + 1,
        change: Math.round(Math.random() * 6 - 2), // Random value between -2 and 4
      }
    })

    // Get team performance
    const teamsResult = await db.query(`
      SELECT 
        team,
        count() as player_count,
        math::sum(stats.wins) as wins,
        math::sum(stats.losses) as losses,
        math::sum(stats.draws) as draws,
        math::sum(score) as totalScore
      FROM player
      WHERE team != NONE AND team != ""
      GROUP BY team
      ORDER BY wins DESC
    `)

    const teamPerformance = (teamsResult[0]?.result || []).map((team: any) => {
      const totalGames = (team.wins || 0) + (team.losses || 0) + (team.draws || 0)
      const winRate = totalGames > 0 ? Math.round((team.wins / totalGames) * 100) : 0

      return {
        name: team.team,
        wins: team.wins || 0,
        losses: team.losses || 0,
        draws: team.draws || 0,
        winRate,
        totalScore: team.totalScore || 0,
        playerCount: team.player_count || 0,
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

    const avgScore_data = [
      Math.round(averageScore * 0.85),
      Math.round(averageScore * 0.88),
      Math.round(averageScore * 0.92),
      Math.round(averageScore * 0.95),
      Math.round(averageScore * 0.98),
      averageScore,
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
          label: "Average Score",
          data: avgScore_data,
          color: "#10b981", // emerald-500
        },
        {
          label: "Matches",
          data: matches_data,
          color: "#f59e0b", // amber-500
        },
      ],
    }
    */

    
    // Mock statistics data
    const statistics = {
      totalPlayers: 256,
      newPlayers: 24,
      activePlayers: 187,
      activePlayersPercentage: 73,
      totalMatches: 1243,
      matchesThisMonth: 156,
      averageScore: 78,
      scoreChange: 5.2,

      // Chart data
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Active Players",
            data: [120, 132, 145, 162, 178, 1],
            color: "#3b82f6", // blue-500
          },
          {
            label: "Average Score",
            data: [65, 68, 72, 75, 76, 78],
            color: "#10b981", // emerald-500
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

      // Team performance
      teamPerformance: [
        {
          name: "Team Alpha",
          wins: 24,
          losses: 8,
          draws: 4,
          winRate: 75,
          totalScore: 1250,
        },
        {
          name: "Team Beta",
          wins: 20,
          losses: 10,
          draws: 6,
          winRate: 67,
          totalScore: 1120,
        },
        {
          name: "Team Gamma",
          wins: 18,
          losses: 12,
          draws: 6,
          winRate: 60,
          totalScore: 980,
        },
        {
          name: "Team Delta",
          wins: 16,
          losses: 14,
          draws: 6,
          winRate: 53,
          totalScore: 920,
        },
        {
          name: "Team Epsilon",
          wins: 12,
          losses: 18,
          draws: 6,
          winRate: 40,
          totalScore: 780,
        },
      ],
    }

    await db.close()
    return statistics

    /*
    return {
      totalPlayers,
      newPlayers,
      activePlayers,
      activePlayersPercentage,
      totalMatches,
      matchesThisMonth,
      averageScore,
      scoreChange,
      chartData,
      topPlayers,
      teamPerformance,
    }
      */
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
    const player = await db.select(playerId)

    if (!player) {
      throw new Error("Player not found")
    }

    // In a real app, you'd have a match history table with timestamps
    // Here we'll generate some realistic looking data based on the player's current stats

    const totalGames = player.stats?.games || 0
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

