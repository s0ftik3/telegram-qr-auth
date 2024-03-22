import { Button, Col, Container, Row, Stack } from 'solid-bootstrap'
import { Show } from 'solid-js'
import { dynamicGreeting } from '~/utils/greeting'
import telegramPremium from '../assets/telegram-premium.png'

export const Authenticated = ({ user }: { user: any }) => {
    const onSignOutClick = () => {
        localStorage.clear()
        window.location.href = '/'
    }

    return (
        <Container class="centered">
            <Stack gap={3}>
                <Row>
                    <Col>
                        <h3>
                            {dynamicGreeting()},{' '}
                            <strong>{user.first_name}</strong>{' '}
                            {user.is_premium ? (
                                <img
                                    class="premium-star"
                                    alt="premium"
                                    src={telegramPremium}
                                    width="24"
                                />
                            ) : (
                                ''
                            )}
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div
                            class={
                                'user-info' +
                                (!user.profile_photo_base64
                                    ? ' without-avatar'
                                    : '')
                            }
                        >
                            <Show when={user.profile_photo_base64}>
                                <img
                                    class="profile-photo"
                                    alt="avatar"
                                    src={user.profile_photo_base64}
                                />
                            </Show>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <td>{user.id}</td>
                                    </tr>
                                    <tr>
                                        <th>First Name</th>
                                        <td>{user.first_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td
                                            class={
                                                user.last_name ? '' : 'empty'
                                            }
                                        >
                                            {user.last_name || 'none'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Username</th>
                                        <td
                                            class={user.username ? '' : 'empty'}
                                        >
                                            {user.username ? (
                                                <a
                                                    class="username"
                                                    href={
                                                        'tg://resolve?domain=' +
                                                        user.username
                                                    }
                                                >
                                                    {user.username}
                                                </a>
                                            ) : (
                                                'none'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Language</th>
                                        <td
                                            class={
                                                user.language_code
                                                    ? ''
                                                    : 'empty'
                                            }
                                        >
                                            {user.language_code || 'unknown'}
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="link" onClick={onSignOutClick}>
                            Sign Out
                        </Button>
                    </Col>
                </Row>
            </Stack>
        </Container>
    )
}
