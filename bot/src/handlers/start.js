import { Key, Keyboard } from 'telegram-keyboard'
import { getClientData } from '../utils/client-data.js'
import dayjs from '../utils/dayjs.js'

/**
 * @param ctx
 * @returns {Promise<void>}
 */
export const handleStart = async ctx => {
    if (!ctx.startPayload) {
        await ctx.reply('Hello, World!')
        return
    }

    const [socketId, validUntil] = ctx.startPayload.split('__', 2)
    const browserDataRaw = await ctx.redis.get(socketId)
    const browserData = JSON.parse(browserDataRaw)

    if (
        dayjs(validUntil).isAfter(Date.now()) ||
        !browserData ||
        !Object.keys(browserData).length
    ) {
        await ctx.reply('This QR-code is expired. Please scan the updated one.')
        return
    }

    const { location, device } = getClientData(
        browserData.ip_address,
        browserData.user_agent
    )

    if (location.latitude && location.longitude) {
        await ctx.replyWithLocation(location.latitude, location.longitude)
    }

    await ctx.replyWithHTML(
        `<b>New sign in request.</b>\n\nApprove sign in request from ${dayjs().format(
            'DD/MM/YYYY HH:mm:ss'
        )}.\n\n<b>Device:</b> ${
            device
                ? `${device.brand} ${device.os} ${device.os_version}`
                : 'unknown'
        }\n<b>Location:</b> ${
            location.country && location.timezone
                ? `${location.country}, ${location.timezone}` +
                  (location.city ? ', ' + location.city : '')
                : 'unknown'
        }`,
        Keyboard.make(
            [
                Key.callback('❌ Deny', 'deny'),
                Key.callback('✅ Approve', `approve:${socketId}`),
            ],
            {
                columns: 2,
            }
        ).inline()
    )
}
