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
                origin: ['http://localhost:5174', 'http://localhost:5173'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
        })

        io.on('connection', socket => {
            socket.on('qr-auth-data', payload => {
                this.redis.set(
                    socket.id,
                    JSON.stringify({
                        ip_address: socket.request.connection.remoteAddress,
                        user_agent: socket.request.headers['user-agent'],
                    }),
                    {
                        EX: Math.round(
                            (payload.valid_until - Date.now()) / 1000
                        ),
                        NX: true,
                    }
                )
            })
        })

        const port = 9999
        server.listen(port, () => {
            console.log(`[Socket.IO] Server running on PORT ${port}`)
        })

        return io
    }
}
