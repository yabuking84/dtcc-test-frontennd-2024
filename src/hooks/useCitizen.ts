import { waits } from '@/lib/utils'
import { useWalletContext } from '@/providers/metamask/wallet'
import { useState } from 'react'
import { useToast } from '@/views/components/ui/use-toast'
import {
    CitizenFormSchema,
    CitizenFormType,
    CitizenType,
} from '@/schems/citizen'
import { ethers } from 'ethers'

interface Block {
    fromBlock: bigint
    toBlock: bigint
}

export const useCitizen = () => {
    const wCtx = useWalletContext()
    const { toast } = useToast()
    const [citizens, setCitizens] = useState<CitizenType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState(false)
    const [isGettingNote, setIsGettingNote] = useState(false)
    const [addingStatus, setAddingStatus] = useState<
        'idle' | 'adding' | 'success' | 'fail'
    >('idle')

    const addCitizen = async (payload: CitizenFormType) => {
        CitizenFormSchema.parse(payload)

        if (!wCtx.account) {
            toast({
                title: 'Error',
                description: 'Please connect to your wallet',
                variant: 'destructive',
            })
            return
        }

        setIsAdding(true)
        setAddingStatus('adding')
        try {
            await wCtx.contract?.methods
                ?.addCitizen(
                    payload.age,
                    payload.city,
                    payload.name,
                    payload.someNote,
                )
                .send({
                    from: wCtx.account,
                    gas: '3000000',
                })
                .on('receipt', () => {
                    toast({
                        title: 'Success',
                        description: 'Citizen added!',
                    })
                    setIsAdding(false)
                    setAddingStatus('idle')
                })
                .on('error', () => {
                    throw new Error('Error')
                })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: 'Error adding citizen',
                variant: 'destructive',
            })
            throw new Error('Error')
        } finally {
            setIsAdding(false)
            setAddingStatus('idle')
        }
    }

    const getNote = async (id: string): Promise<string> => {
        try {
            setIsGettingNote(true)
            const note = await wCtx.contract?.methods
                .getNoteByCitizenId(id)
                .call()
            setIsGettingNote(false)
            return note?.toString() || ''
        } catch (error) {
            setIsGettingNote(false)
            toast({
                title: 'Error',
                description: 'Getting note failed.',
                variant: 'destructive',
            })
            return ''
        }
    }

    const getBlock = async (): Promise<Block> => {
        const block = (await wCtx.web3?.eth.getBlockNumber()) || 1000001n
        return {
            fromBlock: block - 1000000n,
            toBlock: block,
        }
    }

    const initCitizens = async (block: Block) => {
        const events = await wCtx.contract?.getPastEvents('allEvents', {
            fromBlock: block.fromBlock,
            toBlock: block.toBlock,
        })

        if (events?.length) {
            /**
             * Had difficulty decoding city to string, 
             * so had to redeploy the contract with no indexed city :-( 
             */
            const iface = new ethers.Interface([
                'event Citizen(uint indexed id, uint indexed age, string city, string name)',
            ])
            const ctzns: CitizenType[] = []
            for (let i = 0; i < events.length; i++) {
                const e = events[i]
                if (typeof e !== 'string' && e.transactionHash) {
                    const receipt = await wCtx.web3?.eth.getTransactionReceipt(
                        e.transactionHash,
                    )
                    if (receipt) {
                        // Extract logs
                        const logs = receipt.logs

                        // Decode logs
                        logs.forEach((log) => {
                            const _log = log as {
                                topics: readonly string[]
                                data: string
                            }
                            try {
                                if (_log) {
                                    const decodedLog = iface.parseLog(_log)
                                    const buf = {
                                        id: parseInt(decodedLog?.args[0]),
                                        age:
                                            parseInt(decodedLog?.args[1]) ||
                                            0,
                                        city: decodedLog?.args[2] || '',
                                        name: decodedLog?.args[3] || '',
                                    }
                                    if (decodedLog?.args[0] && ctzns.findIndex(e=>e.id===buf.id) < 0 )
                                        ctzns.push(buf)
                                }
                            } catch (e) {
                                console.error(
                                    'Log does not match the event signature:',
                                    e,
                                )
                            }
                        })
                    }
                }
            }

            setCitizens(ctzns.reverse())
        } else {
            setCitizens([])

        }
    }

    const init = async () => {
        setIsLoading(true)
        try {
            const block = await getBlock()
            await initCitizens(block)
            await waits(500)
        } catch (error: any) {
            console.error(error)
            if (
                (error.message + '').includes(
                    'MetaMask is not connected/installed',
                )
            )
                toast({
                    title: 'Wallet not Connected',
                    description: 'Please connect to your wallet',
                })
            else
                toast({
                    title: 'Error',
                    description: 'Error initializing Citizens.',
                    variant: 'destructive',
                })
        } finally {
            setIsLoading(false)
        }
    }

    const resetCitizens = () => {
        setCitizens([])
    }

    const paginateCitizens = (pageSize: number, pageNumber: number) => {
        const startIndex = (pageNumber - 1) * pageSize
        const endIndex = startIndex + pageSize
        return citizens.slice(startIndex, endIndex)
    }

    return {
        action: {
            init,
            addCitizen,
            getNote,
            resetCitizens,
            paginateCitizens,
        },
        state: {
            citizens,
            isLoading,
            isAdding,
            addingStatus,
            isGettingNote,
        },
    }
}
