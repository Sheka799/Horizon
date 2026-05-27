import { ITask } from '@/features/dashboard/types'

export type CreateTaskData = Partial<
	Omit<ITask, 'id' | 'createdAt' | 'updatedAt' | 'order'>
>
