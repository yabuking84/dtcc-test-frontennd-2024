import type { useCitizen } from '@/hooks/useCitizen'

import SpinnerSVG from '@/assets/svg/loading-01.svg'
import { useEffect, useState } from 'react'

export function Note({
    ctz,
    id,
}: {
    ctz: ReturnType<typeof useCitizen>
    id: number
}) {
    const [note, setNote] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getNote = async () => {
        setIsLoading(true)
        try {
            const note = await ctz.action.getNote(id + '')
            if (note) setNote(note)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getNote()
    }, [])

    return (
        <div className="min-w-52">


            {note ? (
                <p className="text-xl  h-[36px]">{note}</p>
            ) : isLoading ? (
                <div className="flex items-center h-[36px]">
                    <SpinnerSVG className="animate-spin text-2xl my-1" />
                </div>
            ) : (
                // <ShowSVG
                //     onClick={getNote}
                //     className="cursor-pointer text-3xl"
                // />
                '---'
            )}
        </div>
    )
}
