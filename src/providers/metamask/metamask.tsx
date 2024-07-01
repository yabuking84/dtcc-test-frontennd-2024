import { ReactNode } from 'react'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { MetaMaskUIProvider } from '@metamask/sdk-react-ui'

const MetamaskProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MetaMaskProvider
            sdkOptions={{
                dappMetadata: {
                    name: 'Test Frontend 2024',
                    url: window.location.href,
                },
                preferDesktop: true
                // infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY,
                // Other options.
            }}
        >
            {children}
        </MetaMaskProvider>
    )
}

const MetamaskUIProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MetaMaskUIProvider
            sdkOptions={{
                dappMetadata: {
                    name: 'Test Frontend 2024',
                    url: window.location.href,
                },
                preferDesktop: true
                // infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY,
                // Other options.
            }}
        >
            {children}
        </MetaMaskUIProvider>
    )
}

export { MetamaskProvider, MetamaskUIProvider }
