import { useWalletContext } from "@/providers/metamask/wallet"

export interface Block {
    fromBlock: bigint
    toBlock: bigint
}

export const getBlock = async function (wCtx:ReturnType<typeof useWalletContext>): Promise<Block> {
    const block = (await wCtx.web3?.eth.getBlockNumber()) || 1000001n
    return {
        fromBlock: block - 1000000n,
        toBlock: block,
    }
}