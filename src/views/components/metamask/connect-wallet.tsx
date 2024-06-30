import { Button } from '../ui/button'

import SpinnerSVG from '@/assets/svg/loading-01.svg'
import MetamaskSVG from '@/assets/svg/metamask.svg'
import { useWalletContext } from '@/providers/metamask/wallet'
import { MetaMaskButton } from '@metamask/sdk-react-ui'

export function ConnectWallet() {
    const wCtx = useWalletContext()

    const connect = async () => {
        await wCtx.connectToMetaMask()
    }

    return (
        <div>
            {wCtx.connecting ? (
                <Button disabled>
                    <MetamaskSVG className="me-2 text-2xl" />
                    <SpinnerSVG className="ms-2 animate-spin text-2xl" />
                </Button>
            ) : wCtx.provider?.isConnected() && wCtx.account ? (
                <Button onClick={() => wCtx.sdk?.disconnect()}>
                    <MetamaskSVG className="me-2 text-2xl" />
                    {wCtx.account?.slice(0, 5) +
                        '...' +
                        wCtx.account?.slice(-5)}
                </Button>
            ) : (
                <Button onClick={connect}>
                    <MetamaskSVG className="me-2 text-2xl" />
                    Connect
                </Button>
            )}
        </div>
    )
}

export const ConnectWalletUI = () => {
    return <MetaMaskButton theme={'dark'} color="orange"></MetaMaskButton>
}
