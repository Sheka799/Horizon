import { ITask } from '@/features/board/types'

export type CreateTaskData = Partial<
	Omit<ITask, 'id' | 'createdAt' | 'updatedAt' | 'order'>
>
