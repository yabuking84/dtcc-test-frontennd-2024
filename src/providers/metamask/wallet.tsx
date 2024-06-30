import { createContext, useState, useContext, useEffect } from 'react'
// import { useSDK } from '@metamask/sdk-react'
import { useSDK } from '@metamask/sdk-react-ui'
import type { MetaMaskSDK, SDKProvider } from '@metamask/sdk'
import { RegisteredSubscription } from 'web3-eth'
import Web3 from 'web3'
import { abi, address } from '@/contracts/citizen'
import type { Contract } from 'web3-eth-contract'
import { EthereumRpcError } from 'eth-rpc-errors'

const contextState: {
    account: string
    connectToMetaMask: () => void
    connected: boolean
    connecting: boolean
    provider: SDKProvider | undefined
    sdk: MetaMaskSDK | undefined
    contract: Contract<typeof abi> | undefined
    web3: Web3<RegisteredSubscription> | undefined
    error: EthereumRpcError<unknown> | undefined
} = {
    account: '',
    connectToMetaMask: () => {},
    connected: false,
    connecting: false,
    provider: undefined,
    sdk: undefined,
    contract: undefined,
    web3: undefined,
    error: undefined,
}

const WalletContext = createContext(contextState)

export const WalletContextProvider = ({ children }: Props) => {
    const [account, setAccount] = useState('')
    const { sdk, connected, connecting, provider, error, account:acct } = useSDK()

    const connectToMetaMask = async () => {
        try {
            const accounts = await sdk?.connect()
            setAccount(accounts?.[0])
        } catch (err) {
            console.warn(`failed to connect..`, err)
        }
    }

    const web3 = new Web3(provider)
    const contract = new web3.eth.Contract(abi, address)

    provider?.on('connect', (data: any) => {
        setAccount(data?.[0] || '')
    })

    provider?.on('accountsChanged', (data: any) => {
        setAccount(data?.[0] || '')
    })

    provider?.on('disconnect', () => {
        setAccount('')
    })

    useEffect(() => {
        return () => {
            provider?.removeAllListeners()
        }
    }, [])

    useEffect(() => {
        if(acct) setAccount(acct)
    }, [acct])

    return (
        <WalletContext.Provider
            value={{
                account,
                connectToMetaMask,
                connected,
                connecting,
                provider,
                sdk,
                contract,
                error,
                web3,
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export const useWalletContext = () => useContext(WalletContext)
export default WalletContext
