import { axiosWithAuth } from '@/shared/api'

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

	public async create(columnId: string, name: string, priority: string) {
		const response = (await axiosWithAuth.post('tasks', {
			columnId,
			name,
			priority
		})) as unknown as void
		return response
	}

	public async delete(id: string) {
		const response = (await axiosWithAuth.delete(
			`tasks/${id}`
		)) as unknown as void
		return response
	}
}

export const taskService = new TaskService()
