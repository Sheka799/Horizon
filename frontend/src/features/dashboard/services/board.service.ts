import { axiosWithAuth } from '@/shared/api'

import { TypeBoardSchema } from '../schemes'
import { Board } from '../types'

interface MoveColumnDto {
	prevOrder: string | null
	nextOrder: string | null
}

interface MoveTaskDto {
	columnId: string
	prevOrder: string | null
	nextOrder: string | null
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

	public async moveColumn(id: string, dto: MoveColumnDto) {
		const response = (await axiosWithAuth.patch(
			`columns/${id}`,
			dto
		)) as unknown as void
		return response
	}

	public async moveTask(id: string, dto: MoveTaskDto) {
		const response = (await axiosWithAuth.patch(
			`tasks/${id}`,
			dto
		)) as unknown as void
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
		const response = (await axiosWithAuth.delete(
			`boards/${id}`
		)) as unknown as void
		return response
	}
}

export const boardService = new BoardService()
