import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import million from 'million/compiler'
import svgr from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const projPath = path.resolve(__dirname)

const chunkVendors = [
    { compare: 'ethers', filename: 'ethers' },
    { compare: 'web3', filename: 'web3' },
    { compare: 'framer-motion', filename: 'framer-motion' },
]

const manualChunks = (id: string) => {
    const fndIdx = chunkVendors.findIndex((el) =>
        id.includes('node_modules/' + el.compare),
    )
    if (fndIdx >= 0) {
        return 'vendors_' + chunkVendors[fndIdx].filename
    } else if (id.includes('node_modules')) {
        return 'vendors'
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        // chunks the menu for async download on components
        rollupOptions: {
            output: {
                manualChunks,
            },
        },
    },
    plugins: [
        react(),
        million.vite({
            auto: true,
        }),
        svgr({
            svgrOptions: {
                svgProps: {
                    fill: 'currentColor',
                    width: '1em',
                    height: '1em',
                },
            },
            include: '**/*.svg',
        }),
    ],
    resolve: {
        alias: {
            '@': `${projPath}/src`,
            '@PUBLIC': `${projPath}/public`,
        },
    },
})
