import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
    // ...other config settings
    plugins: [
        vue({ customElement: true }),
        eslintPlugin(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            plugins: [
                // eslint-disable-next-line new-cap
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ],
        }
    }
})
