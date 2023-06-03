import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
    // ...other config settings
    base: './',
    plugins: [
        vue({ customElement: true }),
        eslintPlugin(),
    ],
    publicPath: '',
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
