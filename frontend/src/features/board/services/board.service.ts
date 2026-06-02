import { axiosWithAuth } from '@/shared/api'

import { TypeBoardSchema } from '../schemes'
import { Board, ITask } from '../types'

export interface ArchivedTasksResponse {
	tasks: ITask[]
	total: number
	page: number
	limit: number
	totalPages: number
}

class BoardService {
	public async findAll() {
		const response = (await axiosWithAuth.get(
			'boards'
		)) as unknown as Board[]
		return response
	}

	public async findById(id: string) {
		const response = (await axiosWithAuth.get(
			`boards/${id}`
		)) as unknown as Board
		return response
	}

	public async create(dto: TypeBoardSchema) {
		const response = (await axiosWithAuth.post(
			'boards',
			dto
		)) as unknown as Board
		return response
	}

	public async delete(id: string) {
		await axiosWithAuth.delete(`boards/${id}`)
	}

	public async update(id: string, dto: TypeBoardSchema) {
		const response = (await axiosWithAuth.patch(
			`boards/${id}`,
			dto
		)) as unknown as Board
		return response
	}

	public async getArchivedTasks(
		boardId: string,
		page: number = 1,
		limit: number = 10
	): Promise<ArchivedTasksResponse> {
		const response = (await axiosWithAuth.get(
			`boards/${boardId}/tasks/archived?page=${page}&limit=${limit}`
		)) as unknown as ArchivedTasksResponse
		return response
	}
}

export const boardService = new BoardService()
