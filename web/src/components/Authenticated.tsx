import { Button, Col, Container, Row, Stack } from 'solid-bootstrap'
import { Show } from 'solid-js'

export const Authenticated = ({ user }: { user: any }) => {
    const onSignOutClick = () => {
        localStorage.clear()
        window.location.href = '/'
    }

    return (
        <Container class="centered">
            <Stack gap={3}>
                <Show when={user.profile_photo_base64}>
                    <Row>
                        <Col>
                            <img
                                class="profile-photo"
                                alt="avatar"
                                src={user.profile_photo_base64}
                            />
                        </Col>
                    </Row>
                </Show>
                <Row>
                    <Col>
                        <h3>
                            Hello, <strong>{user.first_name}</strong>!
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div class="user-info">
                            <p class="text-muted">
                                ID: <mark>{user.id}</mark>
                                <br />
                                First Name: <mark>{user.first_name}</mark>
                                <br />
                                Last Name:{' '}
                                <mark>{user.last_name || 'none'}</mark>
                                <br />
                                Username: <mark>{user.username || 'none'}</mark>
                                <br />
                                Language: <mark>{user.language_code}</mark>
                                <br />
                            </p>
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
