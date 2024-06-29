import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import million from 'million/compiler'
import svgr from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const projPath = path.resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // million.vite({
        //     auto: true,
        // }),
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
        createHtmlPlugin({
            inject: {
                tags: [
                    {
                        injectTo: 'head',
                        tag: 'link',
                        attrs: {
                            rel: 'preload',
                            as: 'font',
                            type: 'font/woff2',
                            href: '/assets/fonts/poppins/files/poppins-latin-400-normal.woff2',
                        },
                    },
                    {
                        injectTo: 'head',
                        tag: 'link',
                        attrs: {
                            rel: 'preload',
                            as: 'style',
                            href: '/assets/fonts/poppins.css',
                            onload: "this.onload=null;this.rel='stylesheet'",
                        },
                    },
                    // {
                    //     injectTo: 'head',
                    //     tag: 'link',
                    //     attrs: {
                    //         rel:'stylesheet',
                    //         href: '/assets/fonts/poppins.css',
                    //         crossOrigin:''
                    //     },
                    // },
                ],
            },
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'node_modules/@fontsource/poppins/files',
                    dest: 'assets/fonts/poppins',
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': `${projPath}/src`,
            '@PUBLIC': `${projPath}/public`,
        },
    },
})
