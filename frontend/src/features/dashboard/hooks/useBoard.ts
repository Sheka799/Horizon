import { useQuery } from '@tanstack/react-query'

import { boardService } from '../services'

export function useBoard(id: string) {
	const { data: board, isLoading } = useQuery({
		queryKey: ['board'],
		queryFn: () => boardService.findById(id)
	})

	return { board, isLoading }
}
