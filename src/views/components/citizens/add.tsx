import { Button } from '@/views/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/views/components/ui/dialog'
import { Input } from '@/views/components/ui/input'
import { Label } from '@/views/components/ui/label'
import { useEffect, useState } from 'react'
import SpinnerSVG from '@/assets/svg/loading-01.svg'
import { useCitizen } from '@/hooks/useCitizen'
import { z } from 'zod'
import { FlattenedCitizenFormErrors } from '@/schems/citizen'
import { Textarea } from '@/views/components/ui/textarea'
import { useWalletContext } from '@/providers/metamask/wallet'

const DefFormData = {
    name: '',
    age: 0,
    city: '',
    someNote: '',
}

const DefErrors = {
    name: '',
    age: '',
    city: '',
    someNote: '',
}

export function AddCitizen({
    ctz,
    walletCtx,
}: {
    ctz: ReturnType<typeof useCitizen>
    walletCtx: ReturnType<typeof useWalletContext>
}) {
    const [open, setOpen] = useState(false)

    const [errors, setErrors] = useState({ ...DefErrors })
    const [formData, setFormData] = useState({ ...DefFormData })

    useEffect(() => {
        setFormData({ ...DefFormData })
        setErrors({ ...DefErrors })
    }, [open])

    const setForm = <T extends keyof typeof formData>(
        key: T,
        value: (typeof formData)[T],
    ) => {
        setFormData((d) => {
            return {
                ...d,
                [key]: value,
            }
        })
    }

    const submit = async () => {
        setErrors({ ...DefErrors })
        try {
            await ctz.action.addCitizen(formData)
            setOpen(false)
            await ctz.action.init()
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formatted: FlattenedCitizenFormErrors = error.flatten()
                setErrors({
                    name: formatted.fieldErrors.name?.[0] || '',
                    age: formatted.fieldErrors.age?.[0] || '',
                    city: formatted.fieldErrors.city?.[0] || '',
                    someNote: formatted.fieldErrors.someNote?.[0] || '',
                })
            }
        }
    }

    return (
        <>  
            {!walletCtx.connected ? (
                <Button disabled className='opacity-40' variant="outline">Add Citizen</Button>
            ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Add Citizen</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-3xl">
                                Add Citizen
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-8 px-4 py-4">
                            <div className="grid items-center gap-4">
                                <Label htmlFor="name" className="text-xl">
                                    Name {}
                                </Label>
                                <Input
                                    id="name"
                                    placeholder=""
                                    onChange={(e) =>
                                        setForm('name', e.target.value)
                                    }
                                    className=""
                                />
                                <p className="text-destructive">
                                    {errors.name}
                                </p>
                            </div>
                            <div className="grid items-center gap-4">
                                <Label htmlFor="age" className="text-xl">
                                    Age
                                </Label>
                                <Input
                                    id="age"
                                    type="number"
                                    onChange={(e) =>
                                        setForm('age', +e.target.value)
                                    }
                                    placeholder=""
                                    className=""
                                />
                                <p className="text-destructive">{errors.age}</p>
                            </div>
                            <div className="grid items-center gap-4">
                                <Label htmlFor="city" className="text-xl">
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    placeholder=""
                                    onChange={(e) =>
                                        setForm('city', e.target.value)
                                    }
                                    className=""
                                />
                                <p className="text-destructive">
                                    {errors.city}
                                </p>
                            </div>
                            <div className="grid items-center gap-4">
                                <Label htmlFor="someNote" className="text-xl">
                                    Note
                                </Label>
                                <Textarea
                                    placeholder="Type your message here."
                                    onChange={(e) =>
                                        setForm('someNote', e.target.value)
                                    }
                                />
                                <p className="text-destructive">
                                    {errors.someNote}
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            {ctz.state.isAdding ? (
                                <Button type="button" disabled>
                                    Submit
                                    <SpinnerSVG className="ms-2 animate-spin text-2xl" />
                                </Button>
                            ) : (
                                <Button onClick={submit} type="button">
                                    Submit
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
