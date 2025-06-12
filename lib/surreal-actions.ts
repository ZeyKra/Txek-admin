"use server"

import Surreal from "surrealdb"
import { cookies } from "next/headers"
import { type SurrealResponse } from "@/types/surreal-response"
import { getActivePlayerCount } from "./statistics-actions"
import { log } from "console"

interface ConnectionSettings {
  url: string
  namespace: string
  database: string
  username: string
  password: string
}

// Initialize SurrealDB client
export async function getSurrealClient() {
  const settings = await getConnectionSettings()

  if (!settings.url) {
    throw new Error("SurrealDB connection settings not configured")
  }

  // In SurrealDB 1.2.1, we create a new instance
  const db = new Surreal()

  try {
    // Connect to the database
    await db.connect(settings.url)

    // Sign in as a user - method signature in 1.2.1
    await db.signin({
      username: settings.username,
      password: settings.password,
    })

    // Select a specific namespace and database - method signature in 1.2.1
    //await db.use(settings.namespace, settings.database)
    await db.use({ namespace: settings.namespace, database: settings.database})

    return db
  } catch (error) {
    console.error("Failed to connect to SurrealDB:", error)
    throw new Error("Failed to connect to SurrealDB")
  }
}

// Get connection settings from cookies
export async function getConnectionSettings(): Promise<ConnectionSettings> {
  const cookieStore = cookies()

  return {
    url: cookieStore.get("surreal_url")?.value || "",
    namespace: cookieStore.get("surreal_namespace")?.value || "",
    database: cookieStore.get("surreal_database")?.value || "",
    username: cookieStore.get("surreal_username")?.value || "",
    password: cookieStore.get("surreal_password")?.value || "",
  }
}

// Save connection settings to cookies
export async function saveConnectionSettings(settings: ConnectionSettings) {
  const cookieStore = cookies()

  cookieStore.set("surreal_url", settings.url)
  cookieStore.set("surreal_namespace", settings.namespace)
  cookieStore.set("surreal_database", settings.database)
  cookieStore.set("surreal_username", settings.username)
  cookieStore.set("surreal_password", settings.password)

  return { success: true }
}

// Test connection with provided settings
export async function testConnection(settings: ConnectionSettings) {
  const db = new Surreal()

  try {
    // Connect to the database
    await db.connect(settings.url)

    // Sign in as a user
    await db.signin({
      username: settings.username,
      password: settings.password,
    })

    // Select a specific namespace and database
    await db.use({ namespace: settings.namespace, database: settings.database})

    // Try a simple query to verify connection
    await db.query("INFO FOR DB;")

    await db.close();
    return { success: true }
  } catch (error: any) {
    await db.close()
    return {
      success: false,
      message: error.message || "Failed to connect to SurrealDB",
    }
  }
}

// Fetch database statistics
export async function fetchDatabaseStats() {
  try {
    const tablesResult = await fetchTables();
    
    const db = await getSurrealClient()
    // Get tables using SHOW TABLES in 1.2.1
    // In 1.2.1, the result structure is different
    const tables = Array.isArray(tablesResult) ? tablesResult.length : 0

    // Get total records count - we'll need to query each table
    let records = 0
    if (Array.isArray(tablesResult) && tablesResult.length > 0) {
      for (const table of tablesResult) {
        // In 1.2.1, the table might be returned directly as a string
        try {
          const countResult: SurrealResponse<any> = await db.query(`SELECT count() FROM ${table} GROUP ALL`)
                      // In 1.2.1, the result structure is different
          if (countResult && Array.isArray(countResult)) {
            records += countResult[0][0]['count'];
          }
        } catch(e) {
          console.error(`Error counting records in table ${table}:`, e)
        }

      }
    }

    // Get user count
    let users = 0
    try {
      /*
      const userCountResult = await db.query("SELECT count() FROM user GROUP ALL")
      users = userCountResult[0]?.result?.[0]?.count || 0
      */
      users = await countTable("user") || 0
    } catch (e) {
      console.error("Error counting users:", e)
    }

    // Get player count
    let players = 0
    try {
      const playerCountResult: SurrealResponse<any> = await db.query("SELECT count() FROM RecordedUser GROUP ALL")
      players = playerCountResult[0][0]['count'] || 0
    } catch (e) {
      console.error("Error counting players:", e)
    }

    // Get active player count
    let activePlayers = 0
    try {
      activePlayers = await getActivePlayerCount()
    } catch (e) {
      console.error("Error counting active players:", e)
    }

    // Get version info
    let version = "Inconnu"
    try {
      const infoResult = await db.query("INFO FOR DB")
      version = infoResult[0]?.version || "Inconnu"
    } catch (e) {
      console.error("Error getting DB info:", e)
    }

    // Calculate uptime (mock data for now)
    const uptime = "1h 23m"

    await db.close()

    return {
      tables,
      records,
      users,
      players,
      activePlayers,
      uptime,
      version,
    }
  } catch (error) {
    console.error("Failed to fetch database stats:", error)
    return {
      tables: 0,
      records: 0,
      users: 0,
      players: 0,
      activePlayers: 0,
      uptime: "0s",
      version: "Unknown",
    }
  }
}


export async function countTable(table: string) : Promise<number> {
  try {
    const db = await getSurrealClient()
    const query_result: SurrealResponse<any> = await db.query(`SELECT count() FROM ${table} GROUP ALL`)
    await db.close()

    const result: number = query_result[0][0]['count'];
    
    return result //((query_result as any[][])[0][0]['count'] as number)

  } catch (error) {
    console.error("Failed to count :", error)
    return 0
  }
}

// Fetch all tables
export async function fetchTables() {
  try {
    const db = await getSurrealClient()
    const result = await db.query(`INFO FOR DB`)
    await db.close()

    let tables: string[] = Object.keys((result[0] as { tables: Record<string, unknown> })['tables'])

    return tables

  } catch (error) {
    console.error("Failed to fetch tables:", error)
    return []
  }
}

// Fetch table info (record count)
// TODO : REMOVE
export async function fetchTableInfo(tableName: string) {
  try {
    const db = await getSurrealClient()
    const result: any = await db.query(`SELECT count() FROM ${tableName} GROUP ALL`)
    await db.close()

    // In 1.2.1, the result structure is different
    return result[0] || 0
  } catch (error) {
    console.error(`Failed to fetch info for table ${tableName}:`, error)
    return 0
  }
}

// Fetch records from a table with pagination
export async function fetchTableRecords(tableName: string, page = 1, limit = 10) {
  try {
    const db = await getSurrealClient()
    const offset = (page - 1) * limit

    //const countResult = await db.query(`SELECT count() FROM ${tableName} GROUP ALL`)
    const total = await countTable(tableName) || 0

    const recordsResult = await db.query(`SELECT * FROM ${tableName} LIMIT ${limit} START ${offset}`)
    await db.close()

    //console.log(recordsResult[0])

    // In 1.2.1, the result structure is different
    return {
      // Afin d'eviter les warnings 
      records: JSON.parse(JSON.stringify(recordsResult[0] || [])),
      total,
    }
  } catch (error) {
    console.error(`Failed to fetch records from table ${tableName}:`, error)
    return {
      records: [],
      total: 0,
    }
  }
}

// Delete a record
export async function deleteRecord(tableName: string, id: string) {
  try {
    const db = await getSurrealClient()
    // In 1.2.1, the delete method might have a different signature
    let result = await db.query(`DELETE ${id}`)
    console.log(`Delete result for ${id}:`, result);
    
    await db.close()
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete record ${id}:`, error)
    throw new Error(`Failed to delete record: ${error}`)
  }
}

// Create a new record
export async function createRecord(tableName: string, data: any) {
  try {
    const db = await getSurrealClient()
    // In 1.2.1, the create method might have a different signature
    const result = await db.create(tableName, data)
    await db.close()
    return result
  } catch (error) {
    console.error(`Failed to create record in ${tableName}:`, error)
    throw new Error(`Failed to create record: ${error}`)
  }
}

// Update a record
export async function updateRecord(tableName: string, id: string, data: any) {
  try {
    const db = await getSurrealClient()
    // Retret du champ id a fin de mettre a jour l'entré
    data = Object.fromEntries(Object.entries(data).filter(([key]) => key !== "id"));
    // Convert date strings to Date objects for specific fields
    if (data.completed_at && typeof data.completed_at === 'string') {
      data.completed_at = new Date(data.completed_at)
    }
    if (data.created_at && typeof data.created_at === 'string') {
      data.created_at = new Date(data.created_at)
    }


    //const result = await db.update(id, data)
    const result = await db.query(`UPDATE ${id} CONTENT $item`, { item: data })

    
    await db.close()

    return JSON.parse(JSON.stringify(result[0]))
  } catch (error) {
    console.error(`Failed to update record ${id}:`, error)
    throw new Error(`Failed to update record: ${error}`)
  }
}

// Execute a custom query
export async function executeQuery(query: string) {
  try {
    const db = await getSurrealClient()
    const result = await db.query(query)
    await db.close()

    // In 1.2.1, the result structure is different
    if (result[0]) {
      return JSON.parse(JSON.stringify(result[0]))
    }

    // Otherwise return the raw result
    return result
  } catch (error: any) {
    console.error("Failed to execute query:", error)
    throw new Error(error.message || "Failed to execute query")
  }
}

