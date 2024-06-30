import { Button } from '../ui/button'

import SpinnerSVG from '@/assets/svg/loading-01.svg'
import MetamaskSVG from '@/assets/svg/metamask.svg'
import { useWalletContext } from '@/providers/metamask/wallet'

export function ConnectWallet() {
    const walletCtx = useWalletContext()

    const connect = async () => {
        await walletCtx.connectToMetaMask()
    }
    
    

    return (
        <div>
            {/* walletCtx.connecting: {walletCtx.connecting?.toString()} <br />
            walletCtx.connected: {walletCtx.connected?.toString()}<br /><br /><br /> */}
            {walletCtx.connecting ? (
                <Button disabled>
                    <MetamaskSVG className="me-2 text-2xl" />
                    <SpinnerSVG className="ms-2 animate-spin text-2xl" />
                </Button>
            ) : walletCtx.provider?.isConnected() && walletCtx.account ? (
                <Button onClick={() => walletCtx.sdk?.disconnect()}>
                    <MetamaskSVG className="me-2 text-2xl" />
                    {walletCtx.account?.slice(0, 5) +
                        '...' +
                        walletCtx.account?.slice(-5)}
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
