import { toHTML } from '@telegraf/entity'

/**
 * @param ctx
 * @returns {Promise<void>}
 */
export const handleDecline = async ctx => {
    await ctx.answerCbQuery()

    await ctx.editMessageText(
        toHTML(ctx.update.callback_query.message) + '\n\n' + '❌ Declined',
        {
            parse_mode: 'HTML',
        }
    )
}
