import { useQuery } from '@tanstack/react-query'

import { boardService } from '../services'

export function useBoardsQuery() {
	const { data: boards, isLoading } = useQuery({
		queryKey: ['boards'],
		queryFn: () => boardService.findAll()
	})

	return { boards, isLoading }
}
