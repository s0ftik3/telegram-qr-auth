import dayjs from 'dayjs'

export const getQrData = (botName: string, socketId: string, ttl: number) => {
    const validUntil = dayjs().add(ttl, 'seconds').valueOf()
    const payload = socketId + '__' + validUntil
    return {
        data:
            'tg://resolve?domain=' +
            botName +
            '&start=' +
            encodeURIComponent(payload),
        valid_until: validUntil,
    }
}
