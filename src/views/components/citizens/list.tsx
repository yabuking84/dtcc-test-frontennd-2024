import { useCitizen } from '@/hooks/useCitizen'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import SpinnerSVG from '@/assets/svg/loading-01.svg'
import EmptySVG from '@/assets/svg/empty-box-01.svg'
import { Skeleton } from '@/views/components/ui/skeleton'

import {
    Table,
    TableBody, TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/views/components/ui/table'
import { AddCitizen } from './add'
import { Note } from './note'
import { useWalletContext } from '@/providers/metamask/wallet'
import { ListPagination } from './pagination'
import { FadeIn } from '@/views/transitions/fadein'

const pageSize = 5

export function List() {
    const walletCtx = useWalletContext()
    const ctz = useCitizen()

    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (walletCtx.connected && walletCtx.account) {
            ctz.action.init()
        } else ctz.action.resetCitizens()
    }, [])

    // when user disconnects
    useEffect(() => {
        if (!walletCtx.connected) ctz.action.resetCitizens()
    }, [walletCtx.connected])

    return (
        <div>
            <div className="mb-8 flex justify-end">
                <div className="flex gap-8">
                    <AddCitizen ctz={ctz} walletCtx={walletCtx} />
                    {ctz.state.isLoading ? (
                        <Button disabled>
                            Refresh
                            <SpinnerSVG className="ms-2 animate-spin text-2xl" />
                        </Button>
                    ) : (
                        <Button onClick={() => ctz.action.init()}>
                            Refresh
                        </Button>
                    )}
                </div>
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
                                    <TableRow>
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
