interface ProviderMessage {
    type: string
    data: unknown
}

interface WalletNetwork {
    chainId: string
    chainName: string
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
}

