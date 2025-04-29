"use server"
import { getSurrealClient } from "./surreal-actions"

// Fetch users with pagination
export async function fetchUsers(page = 1, limit = 10) {
  try {
    const db = await getSurrealClient()
    const offset = (page - 1) * limit

    const countResult = await db.query(`SELECT count() FROM user`)
    const total = countResult[0].result?.[0]?.count || 0

    const usersResult = await db.query(`SELECT * FROM user ORDER BY created_at DESC LIMIT ${limit} START ${offset}`)
    await db.close()

    return {
      users: usersResult[0].result || [],
      total,
    }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return {
      users: [],
      total: 0,
    }
  }
}

// Create a new user
export async function createUser(userData: any) {
  try {
    const db = await getSurrealClient()

    // Add created_at timestamp
    userData.created_at = new Date().toISOString()

    // Hash password in a real application
    // userData.password = await hashPassword(userData.password);

    const result = await db.create("user", userData)
    await db.close()
    return result
  } catch (error) {
    console.error("Failed to create user:", error)
    throw new Error(`Failed to create user: ${error}`)
  }
}

// Update a user
export async function updateUser(id: string, userData: any) {
  try {
    const db = await getSurrealClient()

    // Add updated_at timestamp
    userData.updated_at = new Date().toISOString()

    // If password is provided, hash it in a real application
    // if (userData.password) {
    //   userData.password = await hashPassword(userData.password);
    // }

    const result = await db.change(id, userData)
    await db.close()
    return result
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error)
    throw new Error(`Failed to update user: ${error}`)
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    const db = await getSurrealClient()
    await db.delete(id)
    await db.close()
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error)
    throw new Error(`Failed to delete user: ${error}`)
  }
}

