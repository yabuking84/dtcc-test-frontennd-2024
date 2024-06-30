import { useCitizen } from '@/hooks/useCitizen'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import SpinnerSVG from '@/assets/svg/loading-01.svg'
import EmptySVG from '@/assets/svg/empty-box-01.svg'
import RefreshSVG from '@/assets/svg/refresh-ccw-01.svg'
import { Skeleton } from '@/views/components/ui/skeleton'

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/views/components/ui/table'
import { AddCitizen } from './add'
import { Note } from './note'
import { useWalletContext } from '@/providers/metamask/wallet'
import { ListPagination } from './pagination'
import { FadeIn } from '@/views/transitions/fadein'
import { waits } from '@/lib/utils'

const pageSize = 5

export function List() {
    const walletCtx = useWalletContext()
    const ctz = useCitizen()

    const [currentPage, setCurrentPage] = useState(1)
    useEffect(() => {
        if (!walletCtx.connected) ctz.action.resetCitizens()
        else delayed()
    }, [walletCtx.connected])

    const delayed = async () => {
        await waits(1000)
        ctz.action.init()
    }

    walletCtx.provider?.on('chainChanged', () => {
        delayed()
    })

    return (
        <div>
            <div className="mb-8 flex justify-between gap-8 lg:justify-end">
                <AddCitizen ctz={ctz} walletCtx={walletCtx} />
                {ctz.state.isLoading ? (
                    <Button title="Refresh" disabled>
                        Refresh
                        <SpinnerSVG className="ms-2 animate-spin text-xl" />
                    </Button>
                ) : (
                    <Button title="Refresh" onClick={() => ctz.action.init()}>
                        Refresh
                        <RefreshSVG className="ms-2 text-xl" />
                    </Button>
                )}
            </div>

            <div className="p-0 lg:p-8">
                <FadeIn className="w-full">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="max-w-[60px]">
                                    ID
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Note</TableHead>
                            </TableRow>
                        </TableHeader>
                        {ctz.state.isLoading ? (
                            <TableBody>
                                {new Array(pageSize).fill(true).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-full space-y-2">
                                                    <Skeleton className="h-4 w-full" />
                                                </div>
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : !ctz.state.citizens.length ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="flex flex-col items-center justify-center px-12 py-12">
                                            <EmptySVG className="text-9xl" />
                                            <span className="mt-4 text-3xl opacity-65">
                                                No data
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            <>
                                <TableBody>
                                    {ctz.action
                                        .paginateCitizens(pageSize, currentPage)
                                        .map((e) => (
                                            <TableRow key={e.id}>
                                                <TableCell className="max-w-[60px] font-medium">
                                                    {e.id}
                                                </TableCell>
                                                <TableCell>{e.name}</TableCell>
                                                <TableCell>{e.age}</TableCell>
                                                <TableCell>{e.city}</TableCell>
                                                <TableCell>
                                                    <Note ctz={ctz} id={e.id} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                                <TableFooter className="w-full">
                                    <TableRow className='bg-white'>
                                        <TableCell colSpan={5}>
                                            <ListPagination
                                                pageSize={pageSize}
                                                changePage={(e) =>
                                                    setCurrentPage(e)
                                                }
                                                currentPage={currentPage}
                                                totalItems={
                                                    ctz.state.citizens.length
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </>
                        )}
                    </Table>
                </FadeIn>
            </div>
        </div>
    )
}
