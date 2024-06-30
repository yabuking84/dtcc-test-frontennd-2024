import {
    ConnectWalletUI
} from '@/views/components/metamask/connect-wallet'

export function Navigation() {
    return (
        <nav className="container px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between">
                <h1 className="mb-4 text-4xl font-bold">Citizens</h1>
                <ol className="flex items-center justify-start lg:justify-end gap-8">
                    <li>
                        <ConnectWalletUI />
                    </li>
                </ol>
            </div>
        </nav>
    )
}
