import 'dotenv/config'
import { PrismaClient, Prisma } from '@prisma/client'
import { createPrismaRedisCache} from 'prisma-redis-middleware'
import Redis from 'ioredis'

if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')
if (!process.env['REDIS_URL']) throw new Error('REDIS_URL is required')

declare let global: { prisma: PrismaClient }

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

export let client: PrismaClient

if (process.env['NODE_ENV'] === 'production') {
  client = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  client = global.prisma
}

const redis = new Redis(process.env['REDIS_URL'])

const cacheMiddleware = createPrismaRedisCache({
  models: [
  { model: 'Token', cacheTime: 900 }, 
  { model: 'Incentive', cacheTime: 180 }, 
  { model: 'Pool', cacheTime: 24 * 60 * 60 },
  { model: 'SushiPool', cacheTime: 900 }
],
  storage: {
    type: "redis",
    options: { client: redis, invalidation: { referencesTTL: 24 * 60 * 60} },
  },
  onHit: (key: string) => {
    console.log('Hit: ✅', key)
  },
  onMiss: (key: string) => {
    console.log('Miss: ❌', key)
  }
})

client.$use(cacheMiddleware as Prisma.Middleware)

export default client as PrismaClient
export { Prisma, PrismaClient } from '@prisma/client'
export * from '@prisma/client'
