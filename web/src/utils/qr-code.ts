import QRCodeStyling from 'qr-code-styling'
import telegramLogo from '../assets/telegram-logo.png'

export const initQrCode = (): QRCodeStyling => {
    return new QRCodeStyling({
        width: 256,
        height: 256,
        type: 'svg',
        image: telegramLogo,
        imageOptions: {
            imageSize: 0.8,
            margin: 5,
        },
        qrOptions: {
            errorCorrectionLevel: 'L',
        },
        cornersDotOptions: {
            type: 'dot',
        },
        cornersSquareOptions: {
            type: 'extra-rounded',
            // color: '#1b93c9',
        },
        dotsOptions: {
            color: '#22A9E9',
            type: 'extra-rounded',
        },
        backgroundOptions: {
            color: 'rgba(255,255,255,0)',
        },
    })
}
