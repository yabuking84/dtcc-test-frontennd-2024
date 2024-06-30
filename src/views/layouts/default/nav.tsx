import {
    ConnectWalletUI
} from '@/views/components/metamask/connect-wallet'

export function Navigation() {
    return (
        <nav className="container px-8 py-6">
            <div className="flex justify-between">
                <h1 className="mb-4 text-4xl font-bold">Citizens</h1>
                <ol className="flex items-center justify-end gap-8">
                    {/* 
                        <li>
                        <Link className="px-2 text-2xl" to={'/'}>
                            Citizens
                        </Link>
                        </li> 
                    */}
                    <li>
                        <ConnectWalletUI />
                    </li>
                </ol>
            </div>
        </nav>
    )
}
