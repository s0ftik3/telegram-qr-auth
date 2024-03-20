import type { Component } from 'solid-js'
import { Show, createSignal, onMount } from 'solid-js'
import { Authenticated } from '~/components/Authenticated'
import { Unauthenticated } from '~/components/Unauthenticated'

const App: Component = () => {
    const [user, setUser] = createSignal<any>(null)

    onMount(() => {
        const localUser = localStorage.getItem('user')

        if (localUser) {
            setUser(JSON.parse(localUser))
        }
    })

    return (
        <>
            <Show when={user()} fallback={<Unauthenticated />}>
                <Authenticated user={user()} />
            </Show>
        </>
    )
}

export default App
