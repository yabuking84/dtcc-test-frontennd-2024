import { z } from 'zod'

const citizen = z.object({
    id: z.number(),
    name: z.string().min(1, {
        message: 'Name must be at least 1 character',
    }),
    age: z
        .number()
        .gte(18, {
            message: 'Age must be 18 and above',
        })
        .lte(150, {
            message: 'Age must be less than 150 years old',
        }),
    city: z.string().min(1, {
        message: 'City must be at least 1 character',
    }),
    someNote: z.string().min(1, {
        message: 'Note must be at least 1 character',
    }),
})

export const CitizenSchema = citizen.omit({ someNote: true })
export type CitizenType = z.infer<typeof CitizenSchema>

export type FlattenedCitizenErrors = z.inferFlattenedErrors<
    typeof CitizenSchema
>

export const CitizenFormSchema = citizen.omit({ id: true })
export type CitizenFormType = z.infer<typeof CitizenFormSchema>

export type FlattenedCitizenFormErrors = z.inferFlattenedErrors<
    typeof CitizenFormSchema
>
