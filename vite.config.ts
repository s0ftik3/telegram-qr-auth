import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
    root: 'web',
    plugins: [solidPlugin()],
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, 'web/src'),
        },
    },
    preview: {
        port: 4177,
    },
})
