/**
 * @param ms {number}
 * @returns {Promise<unknown>}
 */
export const sleep = (ms: number): Promise<unknown> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
