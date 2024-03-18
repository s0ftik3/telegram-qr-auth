import 'dotenv/config'
import { createClient as createRedisClient } from 'redis'
import { Bot } from './bot.js'
import { Socket } from './socket.js'

export class Core {
    /**
     * @returns {Promise<void>}
     */
    async init() {
        const redis = await this.#initRedis()
        const socket = await this.#initWebSocket(redis)
        await this.#initBot(socket, redis)
    }

    /**
     * @returns {Promise<RedisClient>}
     */
    async #initRedis() {
        const redis = createRedisClient({
            url: process.env.REDIS_CONNECT,
        })
        await redis.connect()
        return redis
    }

    /**
     * @param socket
     * @param redis
     * @returns {Promise<void>}
     */
    async #initBot(socket, redis) {
        const bot = new Bot(process.env.BOT_TOKEN, { socket, redis })
        await bot.launch()
    }

    /**
     * @param redis
     * @returns {Promise<Socket>}
     */
    async #initWebSocket(redis) {
        const socket = new Socket({ redis })
        return socket.launch()
    }
}
