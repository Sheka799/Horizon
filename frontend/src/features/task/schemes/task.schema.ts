import z from 'zod'

import { EPriority } from '@/features/board/types'

const priorityValues = Object.values(EPriority) as [EPriority, ...EPriority[]]

export const CreateTaskSchema = z.object({
	name: z.string().min(1, { message: 'Введите название задачи' }),
	columnId: z.string().min(1, { message: 'ID колонки не может быть пустым' }),
	priority: z.enum(priorityValues).optional(),
	dueDate: z.string().nullable().optional()
})

export type TypeCreateTaskSchema = z.infer<typeof CreateTaskSchema>

export const UpdateTaskSchema = z.object({
	name: z.string().optional(),
	columnId: z.string().optional(),
	priority: z.enum(priorityValues).optional(),
	dueDate: z.string().nullable().optional(),
	status: z.string().optional(),
	isArchived: z.boolean().optional(),
	prevOrder: z.string().nullable().optional(),
	nextOrder: z.string().nullable().optional()
})

export type TypeUpdateTaskSchema = z.infer<typeof UpdateTaskSchema>
