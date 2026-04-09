import z from 'zod'

export const BoardSchema = z
    .object({
        title: z.string().min(1, {
            message: 'Введите название доски'
        })
    })

export type TypeBoardSchema = z.infer<typeof BoardSchema>
