import { useCitizen } from '@/hooks/useCitizen'
import { useCallback, useEffect, useState } from 'react'
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
import { AddCitizenMemo } from './add'
import { NoteMemo } from './note'
import { useWalletContext } from '@/providers/metamask/wallet'
import { ListPaginationMemo } from './pagination'
import { FadeIn } from '@/views/transitions/fadein'
import { waits } from '@/lib/utils'

const pageSize = 5

export function List() {
    const walletCtx = useWalletContext()
    const ctz = useCitizen()

    const [currentPage, setCurrentPage] = useState(1)
    const newCurrentPage = useCallback((e: number) => {
        setCurrentPage(e)
    }, [])
    useEffect(() => {
        if (!walletCtx.connected) ctz.action.resetCitizens()
        else delayedInit()
    }, [walletCtx.connected])

    const delayedInit = useCallback(async () => {
        await waits(1000)
        ctz.action.init()
        setCurrentPage(1)
    },[])

    walletCtx.provider?.on('chainChanged', () => {
        delayedInit()
    })

    return (
        <div>
            <div className="mb-8 flex justify-between gap-8 lg:justify-end">
                <AddCitizenMemo ctz={ctz} walletCtx={walletCtx} onSuccess={delayedInit} />
                {ctz.state.isLoading ? (
                    <Button title="Refresh" disabled>
                        Refresh
                        <SpinnerSVG className="ms-2 animate-spin text-xl" />
                    </Button>
                ) : (
                    <Button
                        title="Refresh"
                        onClick={() => {
                            ctz.action.init()
                            setCurrentPage(1)
                        }}
                    >
                        Refresh
                        <RefreshSVG className="ms-2 text-xl" />
                    </Button>
                )}
            </div>

            <div className="p-0 lg:p-8">
                <FadeIn className="w-full space-y-12">
                    {ctz.state.isLoading ? (
                        new Array(pageSize).fill(true).map((_, i) => (
                            <div
                                key={i}
                                className="flex h-11 items-center space-x-4"
                            >
                                <Skeleton className="h-6 w-12" />
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-6 w-2/3" />
                                <Skeleton className="h-12 min-h-12 w-12 min-w-12 rounded-full" />
                            </div>
                        ))
                    ) : (
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

                            {!ctz.state.citizens.length ? (
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
                                            .paginateCitizens(
                                                pageSize,
                                                currentPage,
                                            )
                                            .map((e) => (
                                                <TableRow key={e.id}>
                                                    <TableCell className="max-w-[60px] font-medium">
                                                        {e.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {e.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {e.age}
                                                    </TableCell>
                                                    <TableCell>
                                                        {e.city}
                                                    </TableCell>
                                                    <TableCell>
                                                        <NoteMemo
                                                            ctz={ctz}
                                                            id={e.id}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                    <TableFooter className="w-full">
                                        <TableRow className="bg-white">
                                            <TableCell colSpan={5}>
                                                <ListPaginationMemo
                                                    pageSize={pageSize}
                                                    changePage={newCurrentPage}
                                                    currentPage={currentPage}
                                                    totalItems={
                                                        ctz.state.citizens
                                                            .length
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </>
                            )}
                        </Table>
                    )}
                </FadeIn>
            </div>
        </div>
    )
}
