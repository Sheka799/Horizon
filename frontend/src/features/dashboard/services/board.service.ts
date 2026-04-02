import { axiosWithAuth } from '@/shared/api'
import { Board } from '../types'

class BoardService {
	public async findAll() {
		const response = await axiosWithAuth.get<Board[]>('boards') as unknown as Board[]

		return response
	}

	public async findById(id: string) {
		const response = await axiosWithAuth.get<Board>(`boards/${id}`) as unknown as Board

		return response
	}
}

export const boardService = new BoardService()
