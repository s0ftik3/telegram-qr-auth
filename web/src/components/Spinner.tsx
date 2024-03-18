import { Spinner } from 'solid-bootstrap'

export const LoadingSpinner = () => (
    <>
        <Spinner animation="border" role="status">
            <span class="visually-hidden">Loading...</span>
        </Spinner>
    </>
)
