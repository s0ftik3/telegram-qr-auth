import { toHTML } from '@telegraf/entity'

/**
 * @param ctx
 * @returns {Promise<void>}
 */
export const handleDeny = async ctx => {
    await ctx.answerCbQuery()

    await ctx.editMessageText(
        toHTML(ctx.update.callback_query.message) + '\n\n' + 'Denied ❌',
        {
            parse_mode: 'HTML',
        }
    )
}
