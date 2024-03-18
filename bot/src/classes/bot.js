import { Composer, Telegraf } from 'telegraf'

import { handleApprove } from '../handlers/approve.js'
import { handleCallback } from '../handlers/callback.js'
import { handleDeny } from '../handlers/deny.js'
import { handleStart } from '../handlers/start.js'
import { isCommand } from '../utils/is-command.js'

export class Bot {
    constructor(token, { redis, socket }) {
        this.telegraf = new Telegraf(token)
        this.redis = redis
        this.socket = socket
    }

    async launch(options) {
        this.telegraf.catch(err => {
            console.error(err)
        })

        this.telegraf.use(
            new Composer().use((ctx, next) => {
                ctx.redis = this.redis
                ctx.socket = this.socket

                if (
                    isCommand(ctx.message) &&
                    ctx.message.text.match(/^\/start/g)
                ) {
                    const entity = ctx.message.entities[0]
                    const startPayload = ctx.message.text.slice(
                        entity.length + 1
                    )
                    Object.assign(ctx, { startPayload })
                }

                return next()
            })
        )

        this.telegraf.start(handleStart)

        this.telegraf.action('deny', handleDeny)
        this.telegraf.action(/approve:(.*)/, handleApprove)

        this.telegraf.on('callback_query', handleCallback)

        this.telegraf.launch(options).catch(err => console.error(err))

        process.once('SIGINT', () => this.telegraf.stop('SIGINT'))
        process.once('SIGTERM', () => this.telegraf.stop('SIGTERM'))
        process.on('uncaughtExceptionMonitor', console.error)
    }
}
