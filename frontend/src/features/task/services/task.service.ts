import { ITask } from '@/features/board/types'

import { axiosWithAuth } from '@/shared/api'

import { TypeCreateTaskSchema, TypeUpdateTaskSchema } from '../schemes'

class TaskService {
	public async moveTask(id: string, dto: TypeUpdateTaskSchema) {
		const response = (await axiosWithAuth.patch(
			`tasks/${id}`,
			dto
		)) as unknown as ITask
		return response
	}

	public async create(taskData: TypeCreateTaskSchema) {
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

	public async update(id: string, dto: TypeUpdateTaskSchema) {
		const response = (await axiosWithAuth.patch(
			`tasks/${id}`,
			dto
		)) as unknown as ITask
		return response
	}
}

export const taskService = new TaskService()
