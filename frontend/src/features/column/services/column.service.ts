import { axiosWithAuth } from '@/shared/api'

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
}

export const columnService = new ColumnService()
