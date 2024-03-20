import { Key, Keyboard } from 'telegram-keyboard'
import { getClientData } from '../utils/client-data.js'
import dayjs from '../utils/dayjs.js'

/**
 * @param ctx
 * @returns {Promise<void>}
 */
export const handleStart = async ctx => {
    if (!ctx.startPayload) {
        await ctx.reply(
            'Try Telegram bot QR-code authentication at https://qr.vychs.com/',
            {
                disable_web_page_preview: true,
            }
        )
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
        await ctx.reply(
            'This QR-code has expired. Please scan the updated one.'
        )
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
        `<b>New sign in request.</b>\n\nWe detected a login into your account on ${dayjs
            .utc()
            .format('DD/MM/YYYY [at] HH:mm:ss [UTC]')}.\n\n<b>Device:</b> ${
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
