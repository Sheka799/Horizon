import z from 'zod'

export const TaskSchema = z.object({
	name: z.string().min(1, {
		message: 'Введите название задачи'
	}),
	priority: z.string().min(0, {
		message: 'Выберите приоритет задачи'
	}),
	columnId: z.string().min(1, {
		message: 'ID колонки не может быть пустым'
	})
})

export type TypeTaskSchema = z.infer<typeof TaskSchema>
