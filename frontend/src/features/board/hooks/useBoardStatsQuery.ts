import { useQuery } from '@tanstack/react-query'

import { boardService } from '../services'

export function useBoardStatsQuery() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ['board-stats'],
		queryFn: () => boardService.stats()
	})

	return { stats, isLoading }
}
