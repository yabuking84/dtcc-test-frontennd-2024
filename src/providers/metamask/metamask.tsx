import { ReactNode } from 'react'
import { MetaMaskProvider } from '@metamask/sdk-react'

const MetamaskProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MetaMaskProvider
            debug={true}
            sdkOptions={{
                dappMetadata: {
                    name: 'Test Frontend 2024',
                    url: window.location.href,
                },
                // infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY,
                // Other options.
            }}
        >
            {children}
        </MetaMaskProvider>
    )
}

export default MetamaskProvider
