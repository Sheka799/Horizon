import { useQuery } from '@tanstack/react-query'

import { taskService } from '../services'

export function useTaskQuery(id: string) {
	const { data: task, isLoading } = useQuery({
		queryKey: ['task', id],
		queryFn: () => taskService.findById(id)
	})

	return { task, isLoading }
}
