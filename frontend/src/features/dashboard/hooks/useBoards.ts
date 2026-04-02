import { useQuery } from '@tanstack/react-query'

import { boardService } from '../services'

export function useBoards() {
	const { data: boards, isLoading } = useQuery({
		queryKey: ['boards'],
		queryFn: () => boardService.findAll()
	})

	return { boards, isLoading }
}
