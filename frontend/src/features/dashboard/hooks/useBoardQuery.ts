import { useQuery } from '@tanstack/react-query'

import { boardService } from '../services'

export function useBoardQuery(id: string) {
	const { data: board, isLoading } = useQuery({
		queryKey: ['board', id],
		queryFn: () => boardService.findById(id)
	})

	return { board, isLoading }
}
