import QRCodeStyling from 'qr-code-styling'
import { Socket, io } from 'socket.io-client'
import { Col, Container, Row, Stack } from 'solid-bootstrap'
import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { initQrCode } from '~/utils/qr-code'
import { getQrData } from '~/utils/qr-data'
import { sleep } from '~/utils/sleep'
import { LoadingSpinner } from './Spinner'

const QR_CODE_TTL = 30 // seconds

export const Unauthenticated = () => {
    const [qrRef, setQrRef] = createSignal<HTMLElement>()
    const [qrCode, setQrCode] = createSignal<QRCodeStyling>()
    const [socket, setSocket] = createSignal<Socket>()
    const [socketId, setSocketId] = createSignal<null | string>()
    const [showLoader, setShowLoader] = createSignal(true)
    const [showSignInProcess, setShowSignInProcess] = createSignal(false)
    const [timeoutCounter, setTimeoutCounter] = createSignal(0)
    const [isQrBlurred, setIsQrBlurred] = createSignal(false)

    const updateQrCode = async () => {
        if (!socketId()) return
        if (!showLoader()) {
            setIsQrBlurred(true)
            await sleep(350)
        }
        const qrCodeData = getQrData(
            import.meta.env.VITE_BOT_USERNAME,
            //@ts-ignore
            socketId(),
            QR_CODE_TTL
        )

        qrCode()?.update({
            data: qrCodeData.data,
        })
        socket()?.emit('qr-auth-data', {
            valid_until: Number(qrCodeData.valid_until),
        })

        await sleep(350)
        setIsQrBlurred(false)
        setTimeoutCounter(QR_CODE_TTL)
    }

    onMount(() => {
        const socket = io(import.meta.env.VITE_WEB_SOCKET_URL, {
            autoConnect: true,
        })

        setSocket(socket)

        socket.on('connect', async () => {
            setQrCode(initQrCode())
            setSocketId(socket.id)
            await updateQrCode()
            setShowLoader(false)
            qrCode()?.append(qrRef())
        })

        socket.on('auth-accept', async user => {
            setShowSignInProcess(true)
            setShowLoader(true)
            await sleep(300) // emulate sign in process
            localStorage.setItem('user', JSON.stringify(user))
            window.location.href = '/'
        })

        const qrCodeUpdateInterval = setInterval(
            updateQrCode,
            QR_CODE_TTL * 1000
        )
        const timeoutCounterInterval = setInterval(() => {
            setTimeoutCounter(c => (c === 0 ? 0 : c - 1))
        }, 1_000)

        onCleanup(() => {
            socket.disconnect()
            clearInterval(qrCodeUpdateInterval)
            clearInterval(timeoutCounterInterval)
        })
    })

    return (
        <Container class="centered">
            <Stack gap={3}>
                <Row>
                    <Col>
                        <Show
                            when={!showLoader()}
                            fallback={<LoadingSpinner />}
                        >
                            <div
                                class={
                                    'overlay' +
                                    (isQrBlurred() ? ' blurred' : '')
                                }
                            ></div>
                            <div ref={setQrRef} class="qr-code"></div>
                        </Show>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Show
                            when={showSignInProcess()}
                            fallback={
                                <p class="text-muted">
                                    Reset in <mark>{timeoutCounter()}s</mark>
                                </p>
                            }
                        >
                            <p class="text-muted">Signing in...</p>
                        </Show>
                    </Col>
                </Row>
            </Stack>
        </Container>
    )
}
