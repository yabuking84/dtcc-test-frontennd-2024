import React from 'react'
import '@fontsource/poppins'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import '@/assets/styles/scss/global.scss'
import MetamaskProvider from '@/providers/metamask/metamask.tsx'
import { WalletContextProvider } from '@/providers/metamask/wallet.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MetamaskProvider>
            <WalletContextProvider>
                <App />
            </WalletContextProvider>
        </MetamaskProvider>
    </React.StrictMode>,
)
