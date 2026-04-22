import { axiosWithAuth } from '@/shared/api'

import { TypeBoardSchema } from '../schemes'
import { Board } from '../types'

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
		const response = (await axiosWithAuth.delete(
			`boards/${id}`
		)) as unknown as void
		return response
	}

	public async update(id: string, dto: TypeBoardSchema) {
		const response = (await axiosWithAuth.patch(
			`boards/${id}`,
			dto
		)) as unknown as Board
		return response
	}
}

export const boardService = new BoardService()
