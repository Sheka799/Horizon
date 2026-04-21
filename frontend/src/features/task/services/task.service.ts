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
}

export const taskService = new TaskService()
