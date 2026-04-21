import z from 'zod'

export const ColumnSchema = z.object({
	title: z.string().min(1, {
		message: 'Введите название колонки'
	}),
	boardId: z.string().min(1, {
		message: 'ID доски не может быть пустым'
	})
})

export type TypeColumnSchema = z.infer<typeof ColumnSchema>
