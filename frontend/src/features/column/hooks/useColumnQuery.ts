import { useQuery } from '@tanstack/react-query'

import { columnService } from '../services'

export function useColumnQuery(id: string) {
	const { data: column, isLoading } = useQuery({
		queryKey: ['column', id],
		queryFn: () => columnService.findById(id)
	})

	return { column, isLoading }
}
