import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/views/components/ui/pagination'
import { useMemo } from 'react'

export function ListPagination({
    pageSize,
    currentPage,
    totalItems,
    changePage,
}: {
    pageSize: number
    currentPage: number
    totalItems: number
    changePage: (newPage: number) => void
}) {
    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / pageSize)
    }, [totalItems, pageSize])

    const handler = (newPage: number) => {
        if (newPage <= 0) return
        else if (newPage > totalPages) return
        changePage(newPage)
    }

    return (
        <>
            {totalPages > 1 ? (
                <Pagination className="w-full">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={`select-none ${currentPage === 1 ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
                                onClick={() => handler(currentPage - 1)}
                            />
                        </PaginationItem>
                        {new Array(totalPages).fill(null).map((e, i) => (
                            <PaginationItem key={'pagination_' + i}>
                                <PaginationLink
                                    className="cursor-pointer"
                                    isActive={i + 1 === currentPage}
                                    onClick={() => handler(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                className={`select-none ${currentPage >= totalPages ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
                                onClick={() => handler(currentPage + 1)}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            ) : (
                ''
            )}
        </>
    )
}
