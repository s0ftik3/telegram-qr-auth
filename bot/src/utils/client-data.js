import geoip from 'geoip-lite'
import DeviceDetector from 'node-device-detector'

/**
 * @param ip
 * @param userAgent
 * @returns {{location: {country: (string|*), city: (string|*), timezone: string, latitude: *, longitude: *}, device: {os: string | undefined, os_version: string | undefined, brand: string | undefined}}}
 */
export const getClientData = (ip, userAgent) => {
    const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
    })
    const ipInfo = geoip.lookup(ip)
    const deviceInfo = detector.detect(userAgent)

    const location = {
        country: ipInfo?.country,
        timezone: ipInfo?.timezone,
        city: ipInfo?.city,
        latitude: ipInfo?.ll?.[0],
        longitude: ipInfo?.ll?.[1],
    }
    const device = {
        brand: deviceInfo?.device?.brand,
        os: deviceInfo?.os?.name,
        os_version: deviceInfo?.os?.version,
    }

    return { location, device }
}
