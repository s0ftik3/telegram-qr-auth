import { toHTML } from '@telegraf/entity'
import { downloadPhotoAsBase64 } from '../utils/download-base64.js'

/**
 * @param ctx
 * @returns {Promise<void>}
 */
export const handleApprove = async ctx => {
    await ctx.answerCbQuery()

    const socketId = ctx.match[0].split(':')[1]
    const data = {
        ...ctx.from,
        profile_photo_base64: null,
    }

    const profilePhotos = await ctx.telegram.getUserProfilePhotos(ctx.from.id)

    if (profilePhotos.total_count) {
        const profilePhotoFileId = profilePhotos.photos.at(0).at(-1).file_id
        const profilePhotoLink = await ctx.telegram.getFileLink(
            profilePhotoFileId
        )
        const profilePhotoBase64 = await downloadPhotoAsBase64(
            profilePhotoLink.href
        )
        data.profile_photo_base64 =
            'data:image/png;base64,' + profilePhotoBase64
    }

    if (ctx.socket.sockets.sockets.has(socketId)) {
        ctx.socket.sockets.to(socketId).emit('auth-approve', data)
        await ctx.editMessageText(
            toHTML(ctx.update.callback_query.message) + '\n\n' + 'Approved ✅',
            {
                parse_mode: 'HTML',
            }
        )
    } else {
        await ctx.editMessageText(
            'This sign in request is expired or client closed the tab it was related to.'
        )
    }
}
