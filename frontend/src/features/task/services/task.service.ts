import { ITask } from '@/features/board/types'

import { axiosWithAuth } from '@/shared/api'

import { CreateTaskData } from '../types'

interface MoveTaskDto {
	columnId: string
	prevOrder: string | null
	nextOrder: string | null
}

class TaskService {
	public async moveTask(id: string, dto: MoveTaskDto) {
		const response = (await axiosWithAuth.patch(
			`tasks/${id}`,
			dto
		)) as unknown as void
		return response
	}

	public async create(taskData: CreateTaskData) {
		const response = (await axiosWithAuth.post('tasks', {
			columnId: taskData.columnId,
			name: taskData.name,
			priority: taskData.priority,
			dueDate: taskData.dueDate
		})) as unknown as ITask
		return response
	}

	public async delete(id: string) {
		const response = (await axiosWithAuth.delete(
			`tasks/${id}`
		)) as unknown as void
		return response
	}

	public async findById(id: string) {
		const response = (await axiosWithAuth.get(
			`tasks/${id}`
		)) as unknown as ITask
		return response
	}
}

export const taskService = new TaskService()
