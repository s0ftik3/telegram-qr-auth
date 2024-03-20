import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'

export class Socket {
    constructor({ redis }) {
        this.redis = redis
    }

    async launch() {
        const app = express()
        const server = http.createServer(app)
        const io = new Server(server, {
            cors: {
                origin: /^http[s]?:\/\/(?:qr\.)?(vychs\.com|localhost:4177|localhost:5173)(?:\/.*)?$/,
                methods: ['GET', 'POST'],
                credentials: true,
            },
        })

        io.on('connection', socket => {
            socket.on('qr-auth-data', payload => {
                try {
                    const expiresAt = Math.round(
                        (payload.valid_until - Date.now()) / 1000
                    )
                    this.redis.set(
                        socket.id,
                        JSON.stringify({
                            ip_address:
                                socket.handshake.headers[
                                    'x-forwarded-for'
                                ]?.split(',')?.[0],
                            user_agent: socket.request.headers['user-agent'],
                        }),
                        {
                            EX: expiresAt > 0 ? expiresAt : 1,
                            NX: true,
                        }
                    )
                } catch (e) {
                    console.error('Error occurred with payload ', payload)
                    console.error(e)
                }
            })
        })

        const port = 9999
        server.listen(port, () => {
            console.log(`[Socket.IO] Server running on PORT ${port}`)
        })

        return io
    }
}
