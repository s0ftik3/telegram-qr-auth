/**
 * @param message
 * @returns {boolean}
 */
export const isCommand = message => {
    const firstEntity = message?.entities?.[0]
    return firstEntity?.type === 'bot_command' && firstEntity.offset === 0
}
