import { IColumn } from '@/features/dashboard/types'

import { axiosWithAuth } from '@/shared/api'

import { TypeColumnSchema } from '../schemes'

interface MoveColumnDto {
	prevOrder: string | null
	nextOrder: string | null
}

class ColumnService {
	public async moveColumn(id: string, dto: MoveColumnDto) {
		const response = (await axiosWithAuth.patch(
			`columns/${id}`,
			dto
		)) as unknown as void
		return response
	}

	public async create(boardId: string, title: string) {
		const response = (await axiosWithAuth.post('columns', {
			boardId,
			title
		})) as unknown as void
		return response
	}

	public async findById(id: string) {
		const response = (await axiosWithAuth.get(
			`columns/${id}`
		)) as unknown as IColumn
		return response
	}

	public async delete(id: string) {
		const response = (await axiosWithAuth.delete(
			`columns/${id}`
		)) as unknown as void
		return response
	}

	public async update(id: string, dto: TypeColumnSchema) {
		const response = (await axiosWithAuth.patch(
			`columns/${id}`,
			dto
		)) as unknown as IColumn
		return response
	}
}

export const columnService = new ColumnService()
