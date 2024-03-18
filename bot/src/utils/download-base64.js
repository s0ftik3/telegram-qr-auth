import axios from 'axios'

/**
 * @param url
 * @returns {Promise<string>}
 */
export const downloadPhotoAsBase64 = async url => {
    const buffer = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(buffer.data).toString('base64')
}
