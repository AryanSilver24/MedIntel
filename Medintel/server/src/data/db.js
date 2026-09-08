import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { logger } from '../shared/logger.js'

let memoryServer = null

/**
 * Connects the Data Access layer. Uses MONGODB_URI when present (Atlas M0 free tier),
 * otherwise boots an in-process MongoDB so the app runs with zero external setup.
 */
export async function connectDatabase() {
  let uri = env.mongoUri
  let mode = 'external'

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    memoryServer = await MongoMemoryServer.create()
    uri = memoryServer.getUri('medintel')
    mode = 'in-memory'
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  logger.info('database connected', { mode, db: mongoose.connection.name })
  return { mode }
}

export async function disconnectDatabase() {
  await mongoose.connection.close()
  if (memoryServer) await memoryServer.stop()
}

export function databaseHealth() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  return { status: states[mongoose.connection.readyState] ?? 'unknown', mode: memoryServer ? 'in-memory' : 'external' }
}
