import { useQuery } from '@tanstack/react-query'

import { boardService } from '../services'

export function useArchivedTasksQuery(
	boardId: string,
	page: number = 1,
	limit: number = 10
) {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['archived-tasks', boardId, page, limit],
		queryFn: () => boardService.getArchivedTasks(boardId, page, limit),
		enabled: !!boardId,
		placeholderData: prev => prev
	})

	return {
		tasks: data?.tasks,
		total: data?.total,
		page: data?.page,
		totalPages: data?.totalPages,
		isLoading,
		isFetching
	}
}
